import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../app/careers/[slug]/ApplicationForm.tsx', import.meta.url), 'utf8')

assert.match(source, /Please confirm you have read the Privacy Notice before submitting\./)
assert.match(source, /I confirm I(&apos;|'|’)ve read the\{' '\}/)
assert.match(source, />\s*Privacy Notice\s*</)
assert.doesNotMatch(source, /I consent to NGH Property Group processing my application data/)
assert.doesNotMatch(source, /Please accept the required privacy consent before submitting\./)

console.log('careers legal copy ok')
