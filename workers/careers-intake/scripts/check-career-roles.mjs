#!/usr/bin/env node
/**
 * Diffs the vacancies the public site advertises against the vacancies the
 * deployed intake Worker actually accepts.
 *
 * Why this exists: the list of open roles lives in two repos that nothing keeps
 * in sync — `components/sections/career/rolesData.ts` in ngh-website-2026, and
 * OPEN_ROLES in this Worker. Both directions of drift are silent and both have
 * shipped:
 *
 *   site open, Worker missing  -> every applicant is rejected at presign, before
 *                                 any write. No row, no mail, no alert. Happened
 *                                 to relationship-growth-manager (9-18 Oct 2026),
 *                                 full-stack-developer (1-18 Oct 2026) and
 *                                 marketing-assistant-intern (reported 19 Oct 2026).
 *   site retired, Worker open  -> the intake keeps collecting CVs and intro videos
 *                                 for a job that no longer exists. Happened to
 *                                 sales-representative and admin-finance-assistant.
 *
 * The site publishes the authoritative set at /sitemap.xml, built from
 * `ROLES.filter((role) => role.applicationStatus !== "closed")` in app/sitemap.ts.
 * That is precisely the set that must be accepted here, so it is a real manifest
 * and not a convenient proxy — measure the deploy against its own manifest.
 *
 * The role check in the Worker runs *before* Turnstile, so a deliberately invalid
 * token separates the two outcomes cleanly and submits nothing:
 *
 *   403 "Anti-bot verification failed."            -> role resolves, intake healthy
 *   400 "This role is not open for applications."  -> role is dead to applicants
 *
 * Usage: node scripts/check-career-roles.mjs [--site URL] [--intake URL]
 * Exits 0 when both sides agree, 1 on drift, 2 when a side could not be read.
 */

import { readFile } from 'node:fs/promises'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? fallback : args[i + 1]
}

const SITE = flag('site', 'https://nghpropertygroup.com')
const INTAKE = flag('intake', 'https://apply.nghpropertygroup.com')
const PROBE_APP_ID = '11111111-1111-4111-8111-111111111111'

async function advertisedSlugs() {
  const response = await fetch(`${SITE}/sitemap.xml`)
  if (!response.ok) throw new Error(`${SITE}/sitemap.xml returned ${response.status}`)
  const xml = await response.text()
  // Canonical (unprefixed) career URLs only; the sitemap repeats every page per locale.
  const found = xml.matchAll(new RegExp(`<loc>${SITE}/career/([a-z0-9-]+)</loc>`, 'g'))
  const slugs = [...found].map((match) => match[1])
  if (slugs.length === 0) throw new Error('sitemap listed no canonical /career/<slug> URLs — did the URL shape change?')
  return new Set(slugs)
}

async function acceptsSlug(slug) {
  const response = await fetch(`${INTAKE}/uploads/presign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: SITE },
    body: JSON.stringify({ appId: PROBE_APP_ID, roleSlug: slug, turnstileToken: 'probe', files: [] }),
  })
  if (response.status === 403) return true
  if (response.status === 400) return false
  throw new Error(`probe for "${slug}" returned an unexpected ${response.status}; cannot tell healthy from dead`)
}

let advertised
try {
  advertised = await advertisedSlugs()
} catch (error) {
  console.error(`could not read the site manifest: ${error.message}`)
  process.exit(2)
}

// Checking only the advertised set would miss the reverse drift entirely, so
// probe every slug this repo knows about as well. Scraped from source rather
// than kept in a list here: a second hand-maintained list is the bug this
// script exists to catch.
async function knownSlugs() {
  const here = new URL('.', import.meta.url)
  const sources = [new URL('../src/index.ts', here), new URL('../../../data/careers.ts', here)]
  const slugs = new Set()
  for (const source of sources) {
    const text = await readFile(source, 'utf8')
    for (const match of text.matchAll(/slug: '([a-z0-9-]+)'/g)) slugs.add(match[1])
  }
  return slugs
}

const toProbe = [...new Set([...advertised, ...(await knownSlugs())])].sort()

const accepted = new Set()
for (const slug of toProbe) {
  try {
    if (await acceptsSlug(slug)) accepted.add(slug)
  } catch (error) {
    console.error(error.message)
    process.exit(2)
  }
}

const missing = [...advertised].filter((slug) => !accepted.has(slug)).sort()
const orphaned = [...accepted].filter((slug) => !advertised.has(slug)).sort()

for (const slug of toProbe) {
  const onSite = advertised.has(slug)
  const onIntake = accepted.has(slug)
  const mark = onSite === onIntake ? 'ok  ' : 'DRIFT'
  console.log(`${mark} ${slug.padEnd(32)} site=${onSite ? 'open' : 'closed'} intake=${onIntake ? 'open' : 'closed'}`)
}

if (missing.length === 0 && orphaned.length === 0) {
  console.log(`\nin sync: ${advertised.size} advertised role(s), all accepted by the intake.`)
  process.exit(0)
}

console.error('')
if (missing.length > 0) {
  console.error(`advertised but REJECTED by the intake: ${missing.join(', ')}`)
  console.error('  every applicant who completes these forms is turned away and leaves no record.')
  console.error('  fix: add the slug to OPEN_ROLES in src/index.ts, then deploy.')
}
if (orphaned.length > 0) {
  console.error(`accepted by the intake but NOT advertised: ${orphaned.join(', ')}`)
  console.error('  these still collect CVs and intro videos for a vacancy the site no longer offers.')
  console.error('  fix: remove the slug from OPEN_ROLES in src/index.ts, then deploy.')
  console.error('  (retention is anchored per application at submit time, so unregistering does not strand CVs.)')
}
process.exit(1)
