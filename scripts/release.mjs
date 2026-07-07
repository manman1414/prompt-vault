/**
 * Prepare a release: bump version, commit, create git tag
 * @author prompt-vault team
 * @date 2026-07-07
 *
 * Usage:
 *   node scripts/release.mjs 0.2.0
 *   node scripts/release.mjs patch
 *   node scripts/release.mjs minor
 *   node scripts/release.mjs major
 */

import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packagePath = path.join(__dirname, '../package.json')

function run(command) {
  execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..') })
}

function readPackage() {
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'))
}

function writePackage(pkg) {
  fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)
}

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version)
  if (!match) throw new Error(`Invalid version: ${version}`)
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  }
}

function bumpVersion(current, kind) {
  const parts = parseVersion(current)
  if (kind === 'major') {
    return `${parts.major + 1}.0.0`
  }
  if (kind === 'minor') {
    return `${parts.major}.${parts.minor + 1}.0`
  }
  if (kind === 'patch') {
    return `${parts.major}.${parts.minor}.${parts.patch + 1}`
  }
  if (/^\d+\.\d+\.\d+$/.test(kind)) {
    return kind
  }
  throw new Error(`Unknown release type: ${kind}`)
}

function main() {
  const arg = process.argv[2]
  if (!arg) {
    console.error('Usage: node scripts/release.mjs <patch|minor|major|x.y.z>')
    process.exit(1)
  }

  const pkg = readPackage()
  const nextVersion = bumpVersion(pkg.version, arg)
  const tag = `v${nextVersion}`

  pkg.version = nextVersion
  writePackage(pkg)

  run('git add package.json')
  run(`git commit -m "chore: release ${tag}"`)
  run(`git tag ${tag}`)

  console.log('')
  console.log(`Prepared ${tag}`)
  console.log('Push to trigger GitHub Actions release build:')
  console.log('')
  console.log('  git push origin main')
  console.log(`  git push origin ${tag}`)
  console.log('')
}

main()
