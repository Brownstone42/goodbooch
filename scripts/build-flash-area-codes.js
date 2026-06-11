// Run once: node scripts/build-flash-area-codes.js
// Fetches Flash Express area codes and builds a lookup map used at checkout
// to convert a Thai subdistrict address into a Flash Express src_area/dst_area code.
//
// Lookup key: "subdistrict_th|postal_code"
// Value:      "TH01-TH0112-TH011202-10140"
//
// Output: src/constants/flashAreaCodes.json

import { writeFileSync } from 'fs'

async function getAreaJsonUrl() {
    const res = await fetch('https://www.flashexpress.co.th/webApi/config/getDistrict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
    })
    const json = await res.json()
    return json.data.url
}

async function main() {
    console.log('Fetching Flash Express area JSON URL...')
    const url = await getAreaJsonUrl()
    console.log('Source:', url)

    console.log('Downloading area data...')
    const res = await fetch(url)
    const rows = await res.json()
    console.log(`Rows: ${rows.length}`)

    const lookup = {}
    const conflicts = []

    for (const row of rows) {
        const parts = row.split('|').map(s => s.trim())
        // subdistrict_th | district_th | province_th | postal_code | area_code | ...
        const [subdistrict_th, , , postal_code, area_code] = parts
        if (!area_code || !postal_code || !subdistrict_th) continue

        const province = area_code.slice(0, 4)   // TH01
        const district = area_code.slice(0, 6)   // TH0112
        const fullCode = `${province}-${district}-${area_code}-${postal_code}`
        const key = `${subdistrict_th}|${postal_code}`

        if (key in lookup && lookup[key] !== fullCode) {
            conflicts.push({ key, a: lookup[key], b: fullCode })
        } else {
            lookup[key] = fullCode
        }
    }

    console.log(`Unique keys: ${Object.keys(lookup).length}`)

    if (conflicts.length > 0) {
        console.warn(`\n⚠️  ${conflicts.length} key conflict(s) (same subdistrict+postalCode, different area code):`)
        conflicts.slice(0, 20).forEach(c => console.warn(`  "${c.key}"\n    ${c.a}\n    ${c.b}`))
    } else {
        console.log('✓ No key conflicts — subdistrict+postalCode is a safe lookup key')
    }

    const out = JSON.stringify(lookup)
    writeFileSync('src/constants/flashAreaCodes.json', out)
    console.log(`\n✓ Saved src/constants/flashAreaCodes.json  (${(out.length / 1024).toFixed(1)} KB)`)
}

main().catch(console.error)
