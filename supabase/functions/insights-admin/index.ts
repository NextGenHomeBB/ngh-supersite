// Insights CMS backend — the single write path for nghpropertygroup.com/admin.
//
// The public site is a static export, so it can't host server logic. This edge
// function is that logic: it authenticates the editor (Supabase Auth + an
// allowlist), sanitizes article HTML, writes with the service role, and triggers
// a site rebuild on publish. The browser admin never touches the database
// directly — RLS grants `authenticated` no write access, so this is the only door.
//
// Deploy: supabase functions deploy insights-admin --no-verify-jwt --project-ref <ref>
// (auth is enforced in-code so we can answer CORS preflight ourselves.)

// Platform-injected env (present in every Supabase Edge Function).
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// Function secrets (set via `supabase secrets set`).
const DEPLOY_TOKEN = Deno.env.get("SUPERSITE_DEPLOY_TOKEN") || "";
const DEPLOY_REPO = Deno.env.get("SUPERSITE_DEPLOY_REPO") || "NextGenHomeBB/ngh-supersite";
const DEPLOY_WORKFLOW = Deno.env.get("SUPERSITE_DEPLOY_WORKFLOW") || "deploy-cloudflare-pages.yml";
const DEPLOY_REF = Deno.env.get("SUPERSITE_DEPLOY_REF") || "main";

const BUCKET = "insights-images";
const PROFILE = "imperium"; // custom Postgres schema

const ALLOWED_ORIGINS = [
  "https://nghpropertygroup.com",
  "https://www.nghpropertygroup.com",
  "http://localhost:3000",
  "http://localhost:3100",
];

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

// ── PostgREST helpers (service role, imperium schema) ────────────────────────
async function pg(path: string, init: RequestInit = {}, write = false): Promise<Response> {
  const headers: Record<string, string> = {
    apikey: SERVICE_ROLE,
    Authorization: `Bearer ${SERVICE_ROLE}`,
    "Content-Type": "application/json",
    ...(write ? { "Content-Profile": PROFILE } : { "Accept-Profile": PROFILE }),
    ...(init.headers as Record<string, string> || {}),
  };
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, { ...init, headers });
}

// ── slugify (mirror of the site's server helper) ─────────────────────────────
function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['‘’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 80);
}

// ── Edge-safe HTML sanitizer (scheme-allowlist for URLs) ─────────────────────
const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li",
  "h2", "h3", "h4", "blockquote", "figure", "figcaption", "img", "hr",
  "div", "span",
]);
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "title"]),
  div: new Set(["class"]),
  span: new Set(["class"]),
  p: new Set(["class"]),
  figure: new Set(["class"]),
  figcaption: new Set(["class"]),
  blockquote: new Set(["class"]),
};
const ALLOWED_CLASSES = new Set([
  "callout", "cta-lead", "cta-button", "signoff", "signoff-name",
  "signoff-role", "disclaimer", "ngh-lead",
]);

function scrubAttrs(tag: string, attrString: string): string {
  const allowed = ALLOWED_ATTRS[tag];
  if (!allowed) return "";
  const out: string[] = [];
  const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(attrString))) {
    const name = m[1].toLowerCase();
    let value = m[3] ?? m[4] ?? m[5] ?? "";
    if (!allowed.has(name)) continue;
    if (name.startsWith("on")) continue;
    if (name === "href" || name === "src") {
      // Scheme allowlist after normalizing entity/control-char obfuscation.
      const decoded = value
        .replace(/&#x([0-9a-f]+);?/gi, (_s, h) => String.fromCodePoint(parseInt(h, 16)))
        .replace(/&#(\d+);?/g, (_s, d) => String.fromCodePoint(parseInt(d, 10)))
        .replace(/&colon;/gi, ":")
        .replace(/&(tab|newline);/gi, " ");
      const stripped = decoded.replace(/[\u0000-\u0020]+/g, "").toLowerCase();
      const scheme = stripped.match(/^([a-z][a-z0-9+.-]*):/);
      if (scheme && !["http", "https", "mailto", "tel"].includes(scheme[1])) continue;
    }
    if (name === "class") {
      const kept = value.split(/\s+/).filter((c) => ALLOWED_CLASSES.has(c));
      if (kept.length === 0) continue;
      value = kept.join(" ");
    }
    if (name === "target") value = "_blank";
    out.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
  }
  if (tag === "a" && /target=/.test(out.join(" ")) && !/rel=/.test(out.join(" "))) {
    out.push('rel="noopener noreferrer"');
  }
  return out.length ? " " + out.join(" ") : "";
}

function sanitizeHtml(html: string): string {
  if (!html) return "";
  let s = html;
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<(script|style|iframe|object|embed|noscript|template|svg|math|form|input|button|textarea|select|link|meta)\b[\s\S]*?<\/\1\s*>/gi, "");
  s = s.replace(/<(script|style|iframe|object|embed|link|meta|input)\b[^>]*\/?>/gi, "");
  s = s.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g,
    (_full, slash: string, rawName: string, attrs: string) => {
      const tag = rawName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";
      if (slash) return `</${tag}>`;
      const selfClose = tag === "br" || tag === "img" || tag === "hr";
      return `<${tag}${scrubAttrs(tag, attrs)}${selfClose ? " /" : ""}>`;
    });
  return s.trim();
}

// ── rebuild trigger ──────────────────────────────────────────────────────────
async function triggerRebuild(): Promise<{ ok: boolean; detail: string }> {
  if (!DEPLOY_TOKEN) return { ok: false, detail: "deploy_not_configured" };
  try {
    const r = await fetch(
      `https://api.github.com/repos/${DEPLOY_REPO}/actions/workflows/${DEPLOY_WORKFLOW}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DEPLOY_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "ngh-insights-admin",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ref: DEPLOY_REF }),
      },
    );
    if (r.status === 204) return { ok: true, detail: "dispatched" };
    return { ok: false, detail: `github_${r.status}` };
  } catch (e) {
    return { ok: false, detail: (e as Error).message };
  }
}

// ── auth: verify user token + editor allowlist ───────────────────────────────
async function authEditor(req: Request): Promise<{ id: string; email: string } | null> {
  const authz = req.headers.get("Authorization") || "";
  const token = authz.replace(/^Bearer\s+/i, "").trim();
  if (!token || token === ANON_KEY) return null; // anon key is not a user
  // Resolve the user from the access token.
  const ur = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}` },
  });
  if (!ur.ok) return null;
  const user = await ur.json() as { id?: string; email?: string };
  if (!user.id) return null;
  // Check the allowlist.
  const er = await pg(`/insights_editors?user_id=eq.${user.id}&select=user_id&limit=1`);
  if (!er.ok) return null;
  const rows = await er.json() as unknown[];
  if (rows.length === 0) return null;
  return { id: user.id, email: user.email || "" };
}

// ── field helpers ────────────────────────────────────────────────────────────
const STR_FIELDS = [
  "title", "slug", "category", "excerpt", "intro", "body_html", "cover_image",
  "og_image", "image_alt", "seo_title", "seo_description", "author", "external_href",
];
function emptyToNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base || "article";
  for (let i = 0; i < 50; i++) {
    const suffix = i === 0 ? "" : `-${i + 1}`;
    const slug = (candidate + suffix).slice(0, 80);
    let q = `/insights_articles?slug=eq.${encodeURIComponent(slug)}&select=id`;
    const r = await pg(q);
    const rows = await r.json() as Array<{ id: string }>;
    const clash = rows.some((row) => row.id !== excludeId);
    if (!clash) return slug;
  }
  return `${candidate}-${Date.now()}`.slice(0, 80);
}

// ── main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405, origin);

  const editor = await authEditor(req);
  if (!editor) return json({ ok: false, error: "unauthorized" }, 401, origin);

  const ct = req.headers.get("content-type") || "";

  // ── image upload (multipart) ──
  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    // Sanitize the client-supplied id before it enters the storage path — strip
    // anything but [A-Za-z0-9_-] so it can't traverse out of articles/ (e.g. "../").
    const rawId = String(form.get("id") || "misc");
    const id = rawId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64) || "misc";
    if (!(file instanceof File)) return json({ ok: false, error: "no_file" }, 400, origin);
    const okTypes: Record<string, string> = {
      "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
      "image/gif": "gif", "image/avif": "avif",
    };
    const ext = okTypes[file.type];
    if (!ext) return json({ ok: false, error: "unsupported_type" }, 400, origin);
    if (file.size > 8 * 1024 * 1024) return json({ ok: false, error: "too_large" }, 400, origin);
    const path = `articles/${id}/${Date.now()}.${ext}`;
    const up = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE}`,
        "Content-Type": file.type,
        "x-upsert": "true",
      },
      body: await file.arrayBuffer(),
    });
    if (!up.ok) return json({ ok: false, error: `upload_${up.status}`, detail: await up.text() }, 502, origin);
    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
    return json({ ok: true, url }, 200, origin);
  }

  // ── JSON actions ──
  let payload: { action?: string; id?: string; data?: Record<string, unknown> };
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400, origin);
  }
  const action = payload.action || "";
  const id = payload.id || "";
  const data = payload.data || {};

  try {
    if (action === "list") {
      const r = await pg(`/insights_articles?select=*&order=status.asc,sort_date.desc.nullslast,updated_at.desc`);
      if (!r.ok) return json({ ok: false, error: await r.text() }, 502, origin);
      return json({ ok: true, articles: await r.json() }, 200, origin);
    }

    if (action === "get") {
      if (!id) return json({ ok: false, error: "missing_id" }, 400, origin);
      const r = await pg(`/insights_articles?id=eq.${id}&select=*&limit=1`);
      const rows = await r.json() as unknown[];
      if (!rows.length) return json({ ok: false, error: "not_found" }, 404, origin);
      return json({ ok: true, article: rows[0] }, 200, origin);
    }

    if (action === "create") {
      const title = emptyToNull(data.title);
      if (!title) return json({ ok: false, error: "title_required" }, 400, origin);
      const base = slugify((emptyToNull(data.slug) as string) || title);
      const slug = await uniqueSlug(base);
      const row: Record<string, unknown> = { title, slug, status: "draft", external_page: false };
      for (const f of STR_FIELDS) {
        if (f === "title" || f === "slug") continue;
        if (f in data) row[f] = f === "body_html" ? sanitizeHtml(String(data[f] ?? "")) : emptyToNull(data[f]);
      }
      if (typeof data.show_cta === "boolean") row.show_cta = data.show_cta;
      const r = await pg(`/insights_articles`, {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(row),
      }, true);
      if (!r.ok) return json({ ok: false, error: await r.text() }, 502, origin);
      const created = (await r.json() as unknown[])[0];
      return json({ ok: true, article: created }, 200, origin);
    }

    if (action === "update" || action === "publish" || action === "unpublish") {
      if (!id) return json({ ok: false, error: "missing_id" }, 400, origin);
      // Guard: external_page rows are code-managed, read-only here.
      const cur = await pg(`/insights_articles?id=eq.${id}&select=external_page,status&limit=1`);
      const curRows = await cur.json() as Array<{ external_page: boolean; status: string }>;
      if (!curRows.length) return json({ ok: false, error: "not_found" }, 404, origin);
      if (curRows[0].external_page) return json({ ok: false, error: "external_readonly" }, 409, origin);

      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      for (const f of STR_FIELDS) {
        if (f in data) patch[f] = f === "body_html" ? sanitizeHtml(String(data[f] ?? "")) : emptyToNull(data[f]);
      }
      if (typeof data.show_cta === "boolean") patch.show_cta = data.show_cta;
      if (patch.title != null && (patch.title as string) === "") return json({ ok: false, error: "title_required" }, 400, origin);
      // Slug uniqueness (if slug or title changed).
      if (patch.slug != null || patch.title != null) {
        const base = slugify((patch.slug as string) || (patch.title as string) || "");
        if (base) patch.slug = await uniqueSlug(base, id);
      }

      let willBuild = false;
      if (action === "publish") {
        patch.status = "published";
        patch.published_at = new Date().toISOString();
        if (data.sort_date) patch.sort_date = String(data.sort_date);
        else patch.sort_date = new Date().toISOString().slice(0, 10);
        willBuild = true;
      } else if (action === "unpublish") {
        patch.status = "draft";
        willBuild = true; // was live -> rebuild to drop it
      } else if (curRows[0].status === "published") {
        willBuild = true; // editing a live article -> rebuild
      }
      if (data.sort_date && action === "update") patch.sort_date = String(data.sort_date);

      const r = await pg(`/insights_articles?id=eq.${id}`, {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(patch),
      }, true);
      if (!r.ok) return json({ ok: false, error: await r.text() }, 502, origin);
      const updated = (await r.json() as unknown[])[0];
      const rebuild = willBuild ? await triggerRebuild() : null;
      return json({ ok: true, article: updated, rebuild }, 200, origin);
    }

    if (action === "delete") {
      if (!id) return json({ ok: false, error: "missing_id" }, 400, origin);
      const cur = await pg(`/insights_articles?id=eq.${id}&select=external_page,status&limit=1`);
      const curRows = await cur.json() as Array<{ external_page: boolean; status: string }>;
      if (!curRows.length) return json({ ok: false, error: "not_found" }, 404, origin);
      if (curRows[0].external_page) return json({ ok: false, error: "external_readonly" }, 409, origin);
      const wasLive = curRows[0].status === "published";
      const r = await pg(`/insights_articles?id=eq.${id}`, { method: "DELETE" }, true);
      if (!r.ok) return json({ ok: false, error: await r.text() }, 502, origin);
      const rebuild = wasLive ? await triggerRebuild() : null;
      return json({ ok: true, rebuild }, 200, origin);
    }

    return json({ ok: false, error: "unknown_action" }, 400, origin);
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500, origin);
  }
});
