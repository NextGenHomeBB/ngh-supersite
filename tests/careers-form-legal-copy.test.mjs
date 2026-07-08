import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const source = readFileSync(new URL('../app/careers/[slug]/ApplicationForm.tsx', import.meta.url), 'utf8')

assert.match(source, /Please confirm you have read and understood the Privacy Notice before submitting\./)
assert.match(source, /I confirm that I have read and understood the\{' '\}/)
assert.match(source, />\s*Privacy Notice\s*</)
assert.match(source, /<input name="consent" type="checkbox" required/)
assert.match(source, /href="\/privacy"/)
assert.doesNotMatch(source, /I agree NGH may store my application data for recruitment purposes/)
assert.doesNotMatch(source, /I consent to NGH Property Group processing my application data/)
assert.doesNotMatch(source, /Please accept the required privacy consent before submitting\./)
assert.doesNotMatch(source, /I&apos;d also like to receive occasional updates/)
assert.doesNotMatch(source, /also like to receive occasional updates/)
assert.doesNotMatch(source, /We delete your application data within 28 days/)

const privacy = readFileSync(new URL('../app/privacy-policy/page.tsx', import.meta.url), 'utf8')
assert.match(privacy, /Controller: PT Next Gen Home, Bali, Indonesia\. These roles are based in Indonesia and this careers page is not specifically directed at residents of the EU\. Contact: info@nghpropertygroup\.com\./)
assert.match(privacy, /We do not rely on consent to process your application\./)
assert.match(privacy, /Telegram \(internal \\\"new application\\\" alert, link\/reference only, no candidate data in the message\)/)
assert.match(privacy, /Your rights: you may request access, correction, deletion, restriction and portability of your data, and object to the processing;/)
assert.doesNotMatch(privacy, /NGH Nexa social media operations/)

const headersUrl = new URL('../public/_headers', import.meta.url)
assert.equal(existsSync(headersUrl), true)
const headers = readFileSync(headersUrl, 'utf8')
assert.match(headers, /\/\*\s*\n\s*Referrer-Policy:\s*no-referrer/)

console.log('careers legal copy ok')
