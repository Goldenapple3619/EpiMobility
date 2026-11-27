// Vérifie qu'un build de production (dist/) ne contient ni le mode mock ni ses données fictives.
// Usage : npm run build && npm run check:bundle
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const assetsDir = new URL('../dist/assets/', import.meta.url)
const forbidden = [
  { label: 'identifiants des universités fictives', pattern: /uni-fictive-\d+/ },
  { label: 'identifiants des étudiants fictifs', pattern: /stu-demo-\d+/ },
  { label: 'adresses e-mail fictives', pattern: /@example\.org/ },
  { label: 'implémentation mock (createMockApi)', pattern: /Règles de démonstration/ },
]

let files
try {
  files = readdirSync(assetsDir).filter((file) => file.endsWith('.js'))
} catch {
  console.error('dist/assets introuvable : lancez « npm run build » avant cette vérification.')
  process.exit(2)
}

const findings = []
for (const file of files) {
  if (/mock/i.test(file)) findings.push(`${file} : fichier dont le nom évoque le mock`)
  const code = readFileSync(join(assetsDir.pathname, file), 'utf8')
  for (const { label, pattern } of forbidden) {
    if (pattern.test(code)) findings.push(`${file} : ${label}`)
  }
}

if (findings.length > 0) {
  console.error('Données ou code mock présents dans le bundle de production :')
  for (const finding of findings) console.error(`  - ${finding}`)
  process.exit(1)
}
console.log(`OK : ${files.length} fichier(s) JS analysé(s), aucune donnée ni code mock.`)
