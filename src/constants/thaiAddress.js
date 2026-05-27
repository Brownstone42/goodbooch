import data from './thaiAddressData.json'

// Pre-build lookup maps once at module load for O(1) access
const provinceByName = new Map(data.provinces.map((p) => [p.name_th, p]))
const districtByKey  = new Map(data.districts.map((d) => [`${d.province_id}:${d.name_th}`, d]))

/** All provinces sorted: กรุงเทพมหานคร first, then Thai alphabetical */
export function getProvinces() {
    return data.provinces
        .slice()
        .sort((a, b) => {
            if (a.id === 1) return -1
            if (b.id === 1) return 1
            return a.name_th.localeCompare(b.name_th, 'th')
        })
        .map((p) => p.name_th)
}

/** Districts for a given province name */
export function getDistricts(provinceName) {
    const province = provinceByName.get(provinceName)
    if (!province) return []
    return data.districts
        .filter((d) => d.province_id === province.id)
        .map((d) => d.name_th)
}

/** Subdistricts for a given province + district, each with postalCode string */
export function getSubdistricts(provinceName, districtName) {
    const province = provinceByName.get(provinceName)
    if (!province) return []
    const district = districtByKey.get(`${province.id}:${districtName}`)
    if (!district) return []
    return data.subdistricts
        .filter((s) => s.district_id === district.id)
        .map((s) => ({ name: s.name_th, postalCode: s.zip_code }))
}
