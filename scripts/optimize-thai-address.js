// Run once: node scripts/optimize-thai-address.js
// Strips unused fields from the raw JSON files and outputs a single
// optimised file that the app imports at build time.

import { readFileSync, writeFileSync } from 'fs'

const provinces = JSON.parse(readFileSync('src/constants/thai_provinces.json', 'utf8'))
    .filter((p) => !p.deleted_at)
    .map((p) => ({ id: p.id, name_th: p.name_th }))

const districts = JSON.parse(readFileSync('src/constants/thai_districts.json', 'utf8'))
    .filter((d) => !d.deleted_at)
    .map((d) => ({ id: d.id, name_th: d.name_th, province_id: d.province_id }))

const subdistricts = JSON.parse(readFileSync('src/constants/thai_subdistricts.json', 'utf8'))
    .filter((s) => !s.deleted_at)
    .map((s) => ({ name_th: s.name_th, district_id: s.district_id, zip_code: String(s.zip_code) }))

const out = JSON.stringify({ provinces, districts, subdistricts })
writeFileSync('src/constants/thaiAddressData.json', out)

const kb = (out.length / 1024).toFixed(1)
console.log(`✓ provinces:    ${provinces.length}`)
console.log(`✓ districts:    ${districts.length}`)
console.log(`✓ subdistricts: ${subdistricts.length}`)
console.log(`✓ output:       src/constants/thaiAddressData.json  (${kb} KB raw)`)
