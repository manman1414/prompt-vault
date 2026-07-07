/**
 * Verify package.json version matches release tag
 * @author prompt-vault team
 * @date 2026-07-07
 *
 * Usage:
 *   node scripts/verify-release.mjs           # check package.json vs v{version}
 *   node scripts/verify-release.mjs v0.2.4    # check explicit tag
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const packagePath = path.join(root, 'package.json')

function readVersion() {
  return JSON.parse(fs.readFileSync(packagePath, 'utf8')).version
}

function fail(message) {
  console.error(`[verify-release] ${message}`)
  process.exit(1)
}

const pkgVersion = readVersion()
const tagArg = process.argv[2]
const tag = tagArg ?? `v${pkgVersion}`
const tagVersion = tag.replace(/^v/, '')

if (!/^\d+\.\d+\.\d+$/.test(tagVersion)) {
  fail(`Invalid tag format: ${tag}`)
}

if (pkgVersion !== tagVersion) {
  fail(`package.json version (${pkgVersion}) != tag (${tagVersion})`)
}

try {
  execSync('git diff --quiet package.json', { cwd: root, stdio: 'ignore' })
} catch {
  fail('package.json has unstaged changes — commit version bump before tagging')
}

try {
  execSync('git diff --cached --quiet package.json', { cwd: root, stdio: 'ignore' })
} catch {
  fail('package.json has staged but uncommitted changes')
}

console.log(`[verify-release] OK: package.json ${pkgVersion} matches ${tag}`)
