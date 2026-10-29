import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const schema = JSON.parse(fs.readFileSync(path.join(rootDir, 'schemas', 'asset.schema.json'), 'utf8'))
const assetsIndex = JSON.parse(fs.readFileSync(path.join(rootDir, 'indexes', 'assets.json'), 'utf8'))

console.log(`Validating ${assetsIndex.assets.length} assets against schema...`)

let errors = []

for (const asset of assetsIndex.assets) {
  // Check required fields
  for (const req of schema.required) {
    if (asset[req] === undefined || asset[req] === null) {
      errors.push(`Asset ${asset.id}: missing required property '${req}'`)
    }
  }

  // Check ID pattern
  if (!/^mc-[a-z0-9-]+$/.test(asset.id)) {
    errors.push(`Asset ${asset.id}: invalid ID format`)
  }

  // Check enum types
  if (!schema.properties.type.enum.includes(asset.type)) {
    errors.push(`Asset ${asset.id}: invalid type '${asset.type}'`)
  }

  if (!schema.properties.platform.enum.includes(asset.platform)) {
    errors.push(`Asset ${asset.id}: invalid platform '${asset.platform}'`)
  }

  if (!schema.properties.validation_status.enum.includes(asset.validation_status)) {
    errors.push(`Asset ${asset.id}: invalid validation_status '${asset.validation_status}'`)
  }

  // Check entry points exist
  for (const ep of asset.entry_points) {
    const epPath = path.join(rootDir, ep)
    if (!fs.existsSync(epPath)) {
      errors.push(`Asset ${asset.id}: entry point file '${ep}' does not exist at '${epPath}'`)
    }
  }
}

// Check that every related_assets / internal asset dependency points at a real asset id
const knownIds = new Set(assetsIndex.assets.map((a) => a.id))
for (const asset of assetsIndex.assets) {
  for (const rel of asset.related_assets || []) {
    if (!knownIds.has(rel)) errors.push(`Asset ${asset.id}: related_assets references unknown id '${rel}'`)
  }
  for (const dep of asset.dependencies || []) {
    if (dep.startsWith('mc-') && !knownIds.has(dep)) errors.push(`Asset ${asset.id}: dependency references unknown asset id '${dep}'`)
  }
}

if (errors.length > 0) {
  console.error("Validation failed with errors:")
  errors.forEach(e => console.error(" - " + e))
  process.exit(1)
} else {
  console.log(`All ${assetsIndex.assets.length} assets successfully validated against schema and verified on disk!`)
}
