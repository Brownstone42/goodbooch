## HomeView.vue (src/views/HomeView.vue)

### Violations
- [R5] TailwindCSS only: lines 247–253 — The `<style scoped>` block contains raw CSS rules (`.no-scrollbar::-webkit-scrollbar { display: none; }` and `.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`). These are not `@apply` or `@tailwind` directives. → The pseudo-element selector `::webkit-scrollbar` and the `scrollbar-width`/`-ms-overflow-style` properties cannot be expressed as Tailwind classes, which makes this a borderline case. However, since they are raw CSS in a `<style>` block rather than `@apply` directives, they technically violate R5. Minimal fix: add a comment noting these are intentional browser-compatibility overrides, or accept the violation as justified (see Warning below).

### Warnings
- Lines 247–253: The `.no-scrollbar` styles use browser-specific scrollbar-hiding CSS that has no Tailwind equivalent. Tailwind v3 does not ship a `scrollbar-hide` utility by default (it requires the `tailwind-scrollbar-hide` plugin). If that plugin is not installed, keeping these raw CSS rules is the only viable option — treat as a justified exception rather than a hard violation.

### Pass
✓ R1 (Vue Options API only), R2 (Component section order: template → script → style), R3 (No direct Firebase in components), R4 (Back button format — no back button present, N/A), R6 (localStorage in stores only), R7 (loading and error exposed as computed properties), R8 (CATEGORIES imported from src/constants/categories)

---

## Review Summary
Files reviewed: 1
Violations: 1 across 1 file
Warnings: 1

Priority fixes:
1. [HomeView.vue] R5: Raw CSS in `<style scoped>` (lines 247–253) — scrollbar-hiding rules are not `@apply` directives. Justified by lack of Tailwind equivalent; consider installing `tailwind-scrollbar-hide` plugin to eliminate the custom CSS entirely.
