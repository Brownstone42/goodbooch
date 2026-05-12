# Goodbooch Compliance Review

**Task:** Check `src/stores/orders.js` and `src/views/admin/AdminOrders.vue` for compliance with project rules
**Date:** 2026-05-12

---

## orders.js (src/stores/orders.js)

### Violations

- **[R7] Stores expose loading and error — async actions `createOrder`, `updateOrderStatus`, `getOrdersByUser`, `getOrderById`:** Lines 46–86, 87–91, 92–98, 99–103 — These four actions perform async Firebase operations but never set `this.loading = true/false` or `this.error = ...`. Only `getOrders` (lines 32–45) correctly manages loading/error state. Callers of the other actions cannot react to in-progress or failed states.
  - **Minimal fix for `createOrder`:** wrap the body in `this.loading = true / try { ... } catch (e) { this.error = e.message } finally { this.loading = false }`.
  - **Minimal fix for `updateOrderStatus`:** same pattern; surface errors so the component can show a retry.
  - **Minimal fix for `getOrdersByUser` and `getOrderById`:** same pattern (or document them as fire-and-forget if callers handle errors themselves — but the rule requires the store to expose error state).

- **[R8] Shared constants in src/constants/ — status strings `'pending'` and `'shipped'`:** Lines 79, 88, 93, 96, 97 (store) and the same literals appear in `AdminOrders.vue` lines 93, 96, 97, 139–144. The string literals `'pending'` and `'shipped'` appear in both the store and the component (and likely in other files too). These are candidate shared constants. If they appear in 3+ files they must live in `src/constants/`.
  - **Minimal fix:** create `src/constants/orderStatuses.js` exporting `ORDER_STATUSES = { PENDING: 'pending', SHIPPED: 'shipped' }` and import it in the store and component.

### Warnings

- **Line 23 — `import` after function declaration:** `import { useProductsStore } from './products'` appears on line 23, after the `normalizeOrder` function definition (lines 5–21). All imports should be grouped at the top of the file. This is not a CLAUDE.md rule violation but is a code quality issue and can cause confusion.
- **Lines 87–91 — `updateOrderStatus` silently ignores errors:** The action has no try/catch. If the Firestore `updateDoc` call fails, the local `order.status` is never updated, but there is no feedback to the UI. Pair with the R7 fix above.

### Pass

✓ R1 (Options API / defineStore — store correctly uses `defineStore` with an options object), R2 (N/A — `.js` file, not a `.vue` file), R3 (N/A — Firebase imports are expected and correct in a store), R4 (N/A — no back buttons in a store), R5 (N/A — no template/style), R6 (no `localStorage` usage)

---

## AdminOrders.vue (src/views/admin/AdminOrders.vue)

### Violations

- **[R8] Shared constants in src/constants/ — status strings `'pending'` and `'shipped'` and `statusOptions` list:** Lines 93–94 (`:class` binding), 96–97 (`<option>` values), 139–144 (`statusOptions` computed). The status strings `'pending'` and `'shipped'` are hardcoded inline in the template and in the computed `statusOptions`. The same strings exist in `orders.js`. If a third file uses them (e.g., a customer order view), this triggers the 3-file rule. Even at two files this is a strong candidate for `src/constants/`.
  - **Minimal fix:** import from `src/constants/orderStatuses.js` (once created) and replace all inline string literals.

- **[R5] TailwindCSS only — hard-coded hex color strings in class bindings:** Lines 31 (`focus:ring-[#005c3d]`), 76 (`text-[#005c3d]`, `bg-[#005c3d]/10`), 92 (`focus:ring-[#005c3d]`). The hex value `#005c3d` appears three times as an arbitrary Tailwind value. While Tailwind's JIT arbitrary-value syntax `[#005c3d]` is technically within Tailwind, the project should define this brand color as a Tailwind theme extension (e.g., `brand` color) and use `text-brand`, `bg-brand/10`, `focus:ring-brand` instead of repeating the hex. Repeating a raw hex 3+ times is a maintainability violation.
  - **Minimal fix:** add `brand: '#005c3d'` to `tailwind.config.js` colors and replace all `[#005c3d]` occurrences with `brand`.

  > Note: if the project already defines this color in tailwind.config.js as a theme extension, this is not a violation — treat it as a warning.

### Warnings

- **Line 147 — `useOrdersStore()` called inside a computed property:** `let all = useOrdersStore().orders` is called on every computed evaluation. The store instance is stable in Pinia (it returns the same singleton), so this is safe, but it is cleaner and more idiomatic to call `useOrdersStore()` once in `created()`/`mounted()` or store the reference in `data()`. The current pattern works but can be confusing.
- **Lines 159–163 — `useOrdersStore()` called three times (in `orders`, `loading`, `error` computed):** Same note as above — consider caching the store reference.
- **Lines 96–97 — `<option>` values not `v-bind`:** `<option value="pending">` and `<option value="shipped">` use plain string attributes. Once constants are extracted (R8 fix), these should be `:value="ORDER_STATUSES.PENDING"` etc. This is a follow-on to the R8 fix, not an independent violation.

### Pass

✓ R1 (uses `export default { ... }` Options API, no `<script setup>`, no `setup()` function), R2 (`<template>` → `<script>` order correct; no `<style>` block present), R3 (no Firebase imports in the component — all access goes through `useOrdersStore()`), R4 (N/A — admin view, no back button required), R6 (no `localStorage` usage), R7 (component reads `loading` and `error` as `computed` properties — lines 159–164 — compliant)

---

## Review Summary

Files reviewed: 2
Violations: 4 across 2 files (R7 × 1 in store, R8 × 2 shared across both files counted per file, R5 × 1 in component)
Warnings: 5

Priority fixes:
1. `orders.js` R7: Add `loading`/`error` state management to `createOrder`, `updateOrderStatus`, `getOrdersByUser`, and `getOrderById` — currently only `getOrders` is guarded.
2. `orders.js` + `AdminOrders.vue` R8: Extract `'pending'` and `'shipped'` status strings into `src/constants/orderStatuses.js` and import them in both files.
3. `AdminOrders.vue` R5: Replace repeated `[#005c3d]` arbitrary hex values with a named Tailwind theme color (or confirm it is already in `tailwind.config.js`).
