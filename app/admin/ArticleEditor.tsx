'use client'

import { useMemo, useRef, useState } from 'react'
import RichEditor from './RichEditor'
import { api, uploadImage, ApiError, CATEGORIES, type Article } from '../../lib/adminClient'

// A friendly slug preview. The edge function re-slugifies + guarantees
// uniqueness on save, so this is only guidance for Lucy.
function slugify(input: string): string {
  return (input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['''']/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80)
}

type Props = {
  article: Article | null // null = new
  onSaved: (a: Article) => void
  onCancel: () => void
  onDeleted: () => void
}

type Form = {
  title: string
  slug: string
  category: string
  author: string
  sort_date: string
  excerpt: string
  intro: string
  body_html: string
  cover_image: string
  image_alt: string
  show_cta: boolean
  seo_title: string
  seo_description: string
  og_image: string
}

function toForm(a: Article | null): Form {
  return {
    title: a?.title ?? '',
    slug: a?.slug ?? '',
    category: a?.category ?? CATEGORIES[0],
    author: a?.author ?? 'NGH Property Group',
    sort_date: (a?.sort_date ?? '').slice(0, 10),
    excerpt: a?.excerpt ?? '',
    intro: a?.intro ?? '',
    body_html: a?.body_html ?? '',
    cover_image: a?.cover_image ?? '',
    image_alt: a?.image_alt ?? '',
    show_cta: a?.show_cta ?? true,
    seo_title: a?.seo_title ?? '',
    seo_description: a?.seo_description ?? '',
    og_image: a?.og_image ?? '',
  }
}

const Label = ({ children, hint }: { children: React.ReactNode; hint?: string }) => (
  <label className="block text-xs font-medium uppercase tracking-wider text-[#8A8F83] mb-1.5">
    {children}
    {hint && <span className="ml-2 normal-case tracking-normal text-[#6B6F66]">{hint}</span>}
  </label>
)

const inputCls =
  'w-full bg-black/25 border border-white/10 rounded-lg px-3.5 py-2.5 text-[#F5F3EE] outline-none focus:border-[#C6A96C] placeholder:text-[#5C6057] transition-colors'

export default function ArticleEditor({ article, onSaved, onCancel, onDeleted }: Props) {
  const [form, setForm] = useState<Form>(() => toForm(article))
  const [id, setId] = useState<string | null>(article?.id ?? null)
  const [status, setStatus] = useState<'draft' | 'published'>(article?.status ?? 'draft')
  const [slugTouched, setSlugTouched] = useState(Boolean(article?.slug))
  const [busy, setBusy] = useState<null | string>(null)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [coverBusy, setCoverBusy] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const onTitle = (v: string) => {
    setForm((f) => ({ ...f, title: v, slug: slugTouched ? f.slug : slugify(v) }))
  }

  const previewSlug = useMemo(() => form.slug || slugify(form.title), [form.slug, form.title])

  function payload() {
    return {
      title: form.title,
      slug: form.slug,
      category: form.category,
      author: form.author,
      sort_date: form.sort_date || undefined,
      excerpt: form.excerpt,
      intro: form.intro,
      body_html: form.body_html,
      cover_image: form.cover_image,
      image_alt: form.image_alt,
      show_cta: form.show_cta,
      seo_title: form.seo_title,
      seo_description: form.seo_description,
      og_image: form.og_image,
    }
  }

  // Create-if-new, else update. Returns the persisted article (with id).
  async function persist(): Promise<Article> {
    const data = payload()
    if (id) {
      const out = await api<{ article: Article }>('update', { id, data })
      return out.article
    }
    const out = await api<{ article: Article }>('create', { data })
    setId(out.article.id)
    return out.article
  }

  async function withGuards(label: string, fn: () => Promise<void>) {
    if (!form.title.trim()) {
      setMsg({ kind: 'err', text: 'A title is required.' })
      return
    }
    setBusy(label)
    setMsg(null)
    try {
      await fn()
    } catch (e) {
      const text =
        e instanceof ApiError
          ? e.status === 401
            ? 'Your session expired. Please sign in again.'
            : `Could not save (${e.message}).`
          : 'Something went wrong. Please try again.'
      setMsg({ kind: 'err', text })
    } finally {
      setBusy(null)
    }
  }

  const saveDraft = () =>
    withGuards('save', async () => {
      const a = await persist()
      setStatus(a.status)
      setForm(toForm(a))
      setMsg({ kind: 'ok', text: 'Saved.' })
      onSaved(a)
    })

  const publish = () =>
    withGuards('publish', async () => {
      const saved = await persist()
      const out = await api<{ article: Article; rebuild: { ok: boolean } | null }>('publish', {
        id: saved.id,
        data: { sort_date: form.sort_date || undefined },
      })
      setStatus('published')
      setForm(toForm(out.article))
      setMsg({
        kind: 'ok',
        text: 'Published. The live site is rebuilding — it goes live in ~2 minutes.',
      })
      onSaved(out.article)
    })

  const unpublish = () =>
    withGuards('unpublish', async () => {
      if (!id) return
      const out = await api<{ article: Article }>('unpublish', { id })
      setStatus('draft')
      setForm(toForm(out.article))
      setMsg({ kind: 'ok', text: 'Moved back to draft. It will drop off the live site shortly.' })
      onSaved(out.article)
    })

  const remove = () =>
    withGuards('delete', async () => {
      if (!id) {
        onDeleted()
        return
      }
      if (!window.confirm('Delete this article permanently? This cannot be undone.')) return
      await api('delete', { id })
      onDeleted()
    })

  async function onCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setCoverBusy(true)
    setMsg(null)
    try {
      const url = await uploadImage(file, id || 'new')
      set('cover_image', url)
    } catch {
      setMsg({ kind: 'err', text: 'Cover image upload failed.' })
    } finally {
      setCoverBusy(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="text-sm text-[#8A8F83] hover:text-[#F5F3EE] flex items-center gap-1.5"
          >
            ← Back
          </button>
          <span
            className={`text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              status === 'published'
                ? 'border-[#C6A96C]/50 text-[#C6A96C] bg-[#C6A96C]/10'
                : 'border-white/15 text-[#8A8F83]'
            }`}
          >
            {status === 'published' ? 'Live' : 'Draft'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="px-3.5 py-2 rounded-lg text-sm border border-white/10 text-[#D4D0C8] hover:border-[#C6A96C]/40 hover:text-[#F5F3EE]"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={saveDraft}
            disabled={Boolean(busy)}
            className="px-3.5 py-2 rounded-lg text-sm border border-white/10 text-[#D4D0C8] hover:border-[#C6A96C]/40 hover:text-[#F5F3EE] disabled:opacity-50"
          >
            {busy === 'save' ? 'Saving…' : 'Save draft'}
          </button>
          {status === 'published' ? (
            <button
              onClick={unpublish}
              disabled={Boolean(busy)}
              className="px-3.5 py-2 rounded-lg text-sm border border-white/10 text-[#D4D0C8] hover:border-white/30 disabled:opacity-50"
            >
              {busy === 'unpublish' ? 'Working…' : 'Unpublish'}
            </button>
          ) : null}
          <button
            onClick={publish}
            disabled={Boolean(busy)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#C6A96C] text-[#1F1F1F] hover:opacity-90 disabled:opacity-50"
          >
            {busy === 'publish' ? 'Publishing…' : status === 'published' ? 'Update live' : 'Publish'}
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`mb-5 rounded-lg px-4 py-3 text-sm border ${
            msg.kind === 'ok'
              ? 'border-[#C6A96C]/40 bg-[#C6A96C]/10 text-[#E7DCC4]'
              : 'border-red-500/40 bg-red-500/10 text-red-200'
          }`}
        >
          {msg.text}
        </div>
      )}

      {showPreview ? (
        <Preview form={form} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <Label>Title</Label>
              <input
                className={`${inputCls} text-lg`}
                value={form.title}
                onChange={(e) => onTitle(e.target.value)}
                placeholder="Your headline"
              />
            </div>

            <div>
              <Label hint="Shown on the article card & search results">Excerpt</Label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="A one or two sentence summary."
              />
            </div>

            <div>
              <Label hint="The opening lead paragraph (styled larger)">Intro</Label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                value={form.intro}
                onChange={(e) => set('intro', e.target.value)}
                placeholder="Set the scene for the reader."
              />
            </div>

            <div>
              <Label>Article body</Label>
              <RichEditor
                value={form.body_html}
                onChange={(html) => set('body_html', html)}
                articleId={id || 'new'}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-xl border border-white/10 bg-black/15 p-4 space-y-4">
              <div>
                <Label>Category</Label>
                <select
                  className={inputCls}
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#262626]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Author</Label>
                <input
                  className={inputCls}
                  value={form.author}
                  onChange={(e) => set('author', e.target.value)}
                />
              </div>
              <div>
                <Label hint="Used to order & date the article">Date</Label>
                <input
                  type="date"
                  className={inputCls}
                  value={form.sort_date}
                  onChange={(e) => set('sort_date', e.target.value)}
                />
              </div>
              <div>
                <Label>URL slug</Label>
                <input
                  className={`${inputCls} font-mono text-sm`}
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    set('slug', e.target.value)
                  }}
                  placeholder={slugify(form.title) || 'auto-generated'}
                />
                <p className="mt-1.5 text-xs text-[#6B6F66] break-all">
                  /insights/{previewSlug || '…'}
                </p>
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[#C6A96C] w-4 h-4"
                  checked={form.show_cta}
                  onChange={(e) => set('show_cta', e.target.checked)}
                />
                <span className="text-sm text-[#D4D0C8]">
                  Show &ldquo;Book a Consultation&rdquo; call-to-action at the end
                </span>
              </label>
            </div>

            {/* Cover image */}
            <div className="rounded-xl border border-white/10 bg-black/15 p-4 space-y-3">
              <Label>Cover image</Label>
              {form.cover_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.cover_image}
                  alt=""
                  className="w-full rounded-lg border border-white/10 aspect-[16/9] object-cover"
                />
              ) : (
                <div className="w-full rounded-lg border border-dashed border-white/15 aspect-[16/9] flex items-center justify-center text-sm text-[#6B6F66]">
                  No image yet
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => coverRef.current?.click()}
                  disabled={coverBusy}
                  className="flex-1 px-3 py-2 rounded-lg text-sm border border-white/10 text-[#D4D0C8] hover:border-[#C6A96C]/40 disabled:opacity-50"
                >
                  {coverBusy ? 'Uploading…' : form.cover_image ? 'Replace' : 'Upload'}
                </button>
                {form.cover_image && (
                  <button
                    onClick={() => set('cover_image', '')}
                    className="px-3 py-2 rounded-lg text-sm border border-white/10 text-[#8A8F83] hover:text-red-300 hover:border-red-400/30"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={onCoverPick} />
              <div>
                <Label hint="For accessibility & SEO">Image description</Label>
                <input
                  className={inputCls}
                  value={form.image_alt}
                  onChange={(e) => set('image_alt', e.target.value)}
                  placeholder="Describe the cover image"
                />
              </div>
            </div>

            {/* SEO */}
            <details className="rounded-xl border border-white/10 bg-black/15 p-4">
              <summary className="cursor-pointer text-xs font-medium uppercase tracking-wider text-[#8A8F83]">
                Search & social (optional)
              </summary>
              <div className="space-y-4 mt-4">
                <div>
                  <Label hint="Defaults to the title">SEO title</Label>
                  <input
                    className={inputCls}
                    value={form.seo_title}
                    onChange={(e) => set('seo_title', e.target.value)}
                  />
                </div>
                <div>
                  <Label hint="Defaults to the excerpt">SEO description</Label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={2}
                    value={form.seo_description}
                    onChange={(e) => set('seo_description', e.target.value)}
                  />
                </div>
                <div>
                  <Label hint="Defaults to the cover image">Social share image URL</Label>
                  <input
                    className={`${inputCls} text-sm`}
                    value={form.og_image}
                    onChange={(e) => set('og_image', e.target.value)}
                    placeholder="https://…"
                  />
                </div>
              </div>
            </details>

            {/* Danger */}
            <button
              onClick={remove}
              disabled={Boolean(busy)}
              className="w-full px-3 py-2 rounded-lg text-sm border border-red-500/25 text-red-300/80 hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
            >
              {busy === 'delete' ? 'Deleting…' : 'Delete article'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Preview({ form }: { form: Form }) {
  return (
    <div className="max-w-3xl mx-auto">
      {form.cover_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={form.cover_image}
          alt={form.image_alt}
          className="w-full rounded-xl border border-white/10 aspect-[16/9] object-cover mb-8"
        />
      )}
      <p className="text-xs uppercase tracking-widest text-[#C6A96C] mb-3">{form.category}</p>
      <h1 className="ngh-article" style={{ fontSize: '2.4rem', lineHeight: 1.15, marginBottom: '1.5rem' }}>
        {form.title || 'Untitled article'}
      </h1>
      <div className="ngh-article">
        {form.intro && <p className="ngh-lead">{form.intro}</p>}
        <div dangerouslySetInnerHTML={{ __html: form.body_html }} />
        {form.show_cta && (
          <div className="callout" style={{ marginTop: '2rem' }}>
            <strong>Book a Consultation</strong> — the standard call-to-action block appears here on
            the live page.
          </div>
        )}
      </div>
    </div>
  )
}
