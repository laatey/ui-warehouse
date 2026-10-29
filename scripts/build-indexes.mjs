import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

function findAssetManifests(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  for (const item of list) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      if (item === '_temp_extract' || item === 'node_modules' || item === '.git') continue
      results = results.concat(findAssetManifests(fullPath))
    } else if (item === 'asset.json') {
      results.push(fullPath)
    }
  }
  return results
}

const manifestPaths = findAssetManifests(rootDir)
console.log(`Found ${manifestPaths.length} asset manifests.`)

const manifests = manifestPaths.map((p) => {
  const content = JSON.parse(fs.readFileSync(p, 'utf8'))
  const relativeDir = path.relative(rootDir, path.dirname(p)).replace(/\\/g, '/')
  return {
    ...content,
    storage_path: relativeDir
  }
})

// Sort deterministically by id
manifests.sort((a, b) => a.id.localeCompare(b.id))

// 1. Build indexes/assets.json
const assetsIndex = {
  version: "1.0.0",
  updated_at: new Date().toISOString(),
  total_assets: manifests.length,
  assets: manifests.map((m) => ({
    id: m.id,
    name: m.name,
    type: m.type,
    platform: m.platform,
    frameworks: m.frameworks,
    description: m.description,
    capabilities: m.capabilities,
    keywords: m.keywords,
    aliases: m.aliases,
    visual_references: m.visual_references,
    related_assets: m.related_assets,
    dependencies: m.dependencies,
    design_constraints: m.design_constraints,
    entry_points: m.entry_points.map((ep) => `${m.storage_path}/${ep}`),
    storage_path: m.storage_path,
    license: m.license,
    validation_status: m.validation_status,
    version: m.version,
    search_terms: Array.from(
      new Set([
        m.id.toLowerCase(),
        m.name.toLowerCase(),
        ...m.keywords.map((k) => k.toLowerCase()),
        ...m.aliases.map((a) => a.toLowerCase()),
        ...m.visual_references.map((v) => v.name.toLowerCase()),
        ...m.capabilities.map((c) => c.toLowerCase())
      ])
    )
  }))
}

fs.writeFileSync(
  path.join(rootDir, 'indexes', 'assets.json'),
  JSON.stringify(assetsIndex, null, 2),
  'utf8'
)
console.log(`Wrote indexes/assets.json (${assetsIndex.assets.length} assets).`)

// 2. Build indexes/dependencies.json
const depMap = {}
for (const m of manifests) {
  for (const dep of m.dependencies || []) {
    if (!depMap[dep]) {
      depMap[dep] = {
        name: dep,
        used_by_assets: []
      }
    }
    depMap[dep].used_by_assets.push(m.id)
  }
}

const dependenciesIndex = {
  version: "1.0.0",
  updated_at: new Date().toISOString(),
  total_dependencies: Object.keys(depMap).length,
  dependencies: Object.keys(depMap).sort().map((k) => depMap[k])
}

fs.writeFileSync(
  path.join(rootDir, 'indexes', 'dependencies.json'),
  JSON.stringify(dependenciesIndex, null, 2),
  'utf8'
)
console.log(`Wrote indexes/dependencies.json (${dependenciesIndex.dependencies.length} packages).`)

// 3. Build indexes/frameworks.json
const fwMap = {}
for (const m of manifests) {
  for (const fw of m.frameworks || []) {
    if (!fwMap[fw]) {
      fwMap[fw] = {
        framework: fw,
        compatible_platforms: new Set(),
        assets: []
      }
    }
    fwMap[fw].compatible_platforms.add(m.platform)
    fwMap[fw].assets.push({
      id: m.id,
      name: m.name,
      type: m.type,
      storage_path: m.storage_path
    })
  }
}

const frameworksIndex = {
  version: "1.0.0",
  updated_at: new Date().toISOString(),
  total_frameworks: Object.keys(fwMap).length,
  frameworks: Object.keys(fwMap).sort().map((k) => ({
    framework: k,
    compatible_platforms: Array.from(fwMap[k].compatible_platforms).sort(),
    total_assets: fwMap[k].assets.length,
    assets: fwMap[k].assets
  }))
}

fs.writeFileSync(
  path.join(rootDir, 'indexes', 'frameworks.json'),
  JSON.stringify(frameworksIndex, null, 2),
  'utf8'
)
console.log(`Wrote indexes/frameworks.json (${frameworksIndex.frameworks.length} frameworks).`)
