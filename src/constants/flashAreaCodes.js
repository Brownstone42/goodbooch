import lookup from './flashAreaCodes.json'

// Shop origin address: บางมด, ทุ่งครุ, กรุงเทพ 10140
export const SHOP_AREA_CODE = 'TH01-TH0112-TH011202-10140'

/**
 * Returns the Flash Express area code string for the given address,
 * used as src_area / dst_area in the freightCharge API.
 *
 * @param {string} subdistrict  Thai subdistrict name (e.g. "คลองตัน")
 * @param {string} postalCode   5-digit postal code (e.g. "10110")
 * @returns {string|null}       e.g. "TH01-TH0101-TH010101-10110", or null if not found
 */
export function getFlashAreaCode(subdistrict, postalCode) {
    return lookup[`${subdistrict}|${postalCode}`] ?? null
}
