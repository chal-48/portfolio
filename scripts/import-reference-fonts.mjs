import { mkdir, writeFile } from 'node:fs/promises'

// Keep the reference's English font faces local; no font requests at runtime.
const families = [
  { name:'Noto Sans TC', slug:'notosanstc', query:'Noto+Sans+TC:wght@100..900' },
  { name:'JetBrains Mono', slug:'jetbrainsmono', query:'JetBrains+Mono:wght@400..700' },
  { name:'Shippori Mincho', slug:'shipporimincho', query:'Shippori+Mincho:wght@400;500;600;700' },
]
await mkdir('public/assets/fonts', { recursive:true })
await mkdir('public/licenses', { recursive:true })
let styles = '/* Latin font faces matching the reference. SIL OFL licenses are in public/licenses/. */\n'
for (const family of process.argv.includes('--licenses-only') ? [] : families) {
  const response = await fetch(`https://fonts.googleapis.com/css2?family=${family.query}&display=swap`, { headers:{ 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' } })
  if (!response.ok) throw new Error(`Font stylesheet ${family.name}: ${response.status}`)
  const css = await response.text()
  const blocks = [...css.matchAll(/(@font-face\s*\{[^}]+\})/g)].filter(match => /unicode-range:\s*U\+0(?:000)?-(?:00)?FF[,;]/i.test(match[1]))
  if (!blocks.length) throw new Error(`No Latin face found for ${family.name}`)
  for (const [index, match] of blocks.entries()) {
    const url = /url\(([^)]+)\)/.exec(match[1])?.[1]
    if (!url) throw new Error('Missing font file URL')
    const asset = await fetch(url)
    if (!asset.ok) throw new Error(`Font file: ${asset.status}`)
    const filename = `${family.slug}-latin-${index}.woff2`
    await writeFile(`public/assets/fonts/${filename}`, new Uint8Array(await asset.arrayBuffer()))
    styles += `${match[1].replace(url, `/assets/fonts/${filename}`)}\n`
  }
  const license = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family.slug}/OFL.txt`)
  if (!license.ok) throw new Error(`Font license ${family.name}: ${license.status}`)
  await writeFile(`public/licenses/OFL-${family.slug}.txt`, await license.text())
  console.log(`Saved ${family.name} and its license.`)
}
if (!process.argv.includes('--licenses-only')) await writeFile('src/reference-fonts.css', styles)
for (const [name, url] of [
  ['OFL-ChenYuluoyan.txt','https://raw.githubusercontent.com/Chenyu-otf/chenyuluoyan_thin/main/license.txt'],
  ['Devicon-MIT.txt','https://raw.githubusercontent.com/devicons/devicon/master/LICENSE'],
]) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Asset license ${name}: ${response.status}`)
  await writeFile(`public/licenses/${name}`, await response.text())
  console.log(`Saved ${name}.`)
}
