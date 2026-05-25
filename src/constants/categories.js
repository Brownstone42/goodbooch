import imgAll from '@/assets/Home/ทั้งหมด.png'
import imgDisposableGloves from '@/assets/Home/ถุงมือใช้แล้วทิ้ง.png'
import imgSpecialGloves from '@/assets/Home/ถุงมือเฉพาะทาง.png'
import imgFingerCots from '@/assets/Home/ถุงนิ้วยาง.png'
import imgSafetyShoes from '@/assets/Home/รองเท้าป้องกัน.png'
import imgEsdMat from '@/assets/Home/แผ่นยาง ESD.png'
import imgEsdFabric from '@/assets/Home/ผ้า ESD.png'
import imgStickyRoll from '@/assets/Home/ม้วนกาวดักฝุ่น.png'

export const CATEGORIES = [
    'ถุงมือใช้แล้วทิ้ง',
    'ถุงมือเฉพาะทาง',
    'ถุงนิ้วยาง',
    'รองเท้าป้องกัน',
    'แผ่นยาง ESD',
    'ผ้า ESD',
    'ม้วนกาวดักฝุ่น',
]

export const CATEGORY_IMAGES = {
    'ทั้งหมด': imgAll,
    'ถุงมือใช้แล้วทิ้ง': imgDisposableGloves,
    'ถุงมือเฉพาะทาง': imgSpecialGloves,
    'ถุงนิ้วยาง': imgFingerCots,
    'รองเท้าป้องกัน': imgSafetyShoes,
    'แผ่นยาง ESD': imgEsdMat,
    'ผ้า ESD': imgEsdFabric,
    'ม้วนกาวดักฝุ่น': imgStickyRoll,
}
