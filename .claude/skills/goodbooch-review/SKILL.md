---
name: goodbooch-review
description: >
  Reviews Vue components and Pinia stores in the goodbooch project for compliance with
  CLAUDE.md architecture rules. Use this skill whenever the user asks to check compliance,
  run a project rules check, review a Vue file, or types /goodbooch-review. Also trigger
  automatically when code is generated or modified and a compliance check would be useful —
  e.g., after adding a new component, editing a store, or implementing a feature. This skill
  checks: Vue Options API usage, component section order, no direct Firebase in components,
  back button format, TailwindCSS-only styling, localStorage in stores only, loading/error
  state exposure, and constants placement.
---

# Goodbooch Project Compliance Review

You are reviewing Vue3/Pinia source files in `C:\Storage\Antigravity\appx\goodbooch\src`
against the project's CLAUDE.md rules. Your job is to find violations, explain them clearly,
and suggest the minimal fix for each one.

## How to run the review

1. **Determine scope** from the user's message or argument:
   - If a file path is given: review that file.
   - If no path is given: review all recently changed files (`git diff --name-only HEAD` and
     `git status --short`). If git shows nothing changed, ask the user which file(s) to check.

2. **Read each target file** fully before making any judgment.

3. **Check every rule** below against each file. Don't skip rules because a file "looks fine."

4. **Report findings** using the format below, then give a summary verdict.

---

## Rules to check

### R1 — Vue Options API only
- `<script>` must use `export default { ... }` (Options API).
- **Violation signals:** `import { ref, reactive, computed, watch, onMounted } from 'vue'` at
  the top of a component file; `<script setup>` attribute on the script tag; `setup()` function
  inside the export.
- **Not a violation:** using `ref`/`reactive` inside a Pinia store — stores use `defineStore`
  and may use either style.

### R2 — Component section order
- Order inside `.vue` files must be: `<template>` → `<script>` → `<style>`.
- **Violation:** any other order (e.g., `<script>` before `<template>`, or `<style>` before
  `<script>`).

### R3 — No direct Firebase in components
- Vue components (`.vue` files) must NOT import from `firebase/*` or `../firebase` or
  `../../firebase`.
- All Firebase access goes through Pinia stores (`useXxxStore()`).
- **Violation signals:** `import { ... } from 'firebase/firestore'`,
  `import { db } from '../firebase'`, `getDoc(`, `setDoc(`, `collection(` in a `.vue` file.

### R4 — Back button format
- Any button or link that navigates back must:
  - Display exactly `← Back` as its visible text (the arrow is the Unicode left arrow `←`,
    not an SVG icon, not `<-`, not `&larr;`).
  - Have both `text-gray-500` and `text-sm` in its `class`.
  - Call `$router.back()` on click (not `$router.push(...)` or `history.back()`).
- **Violation:** SVG-icon-only back buttons, missing classes, wrong click handler.
- **Only applies** to customer-facing views. Admin sidebar navigation is not a back button.

### R5 — TailwindCSS only
- No `<style>` block with custom CSS rules (except `@apply` directives which are fine).
- No `style="..."` inline attribute in templates.
- No CSS-in-JS or style object bindings like `:style="{ color: '#fff' }"` (unless the value
  truly cannot be expressed as a Tailwind class, e.g., a dynamic pixel value from data).
- **Violation:** any raw CSS property in a `<style>` block that isn't an `@apply` or
  `@tailwind` directive; hard-coded hex colors in `:style` bindings.

### R6 — localStorage in stores only
- `localStorage.getItem`, `localStorage.setItem`, `localStorage.removeItem` must NOT appear
  inside `.vue` component files.
- They belong in Pinia store files (`src/stores/*.js`).

### R7 — Stores expose loading and error; components use computed
- Pinia stores (`src/stores/*.js`) must have a `loading` state property and an `error` state
  property that are set during async operations.
- Vue components that use store data must read `loading` and `error` as `computed` properties
  (not hard-coding `false` or `null`, not reading them inside `methods`).
- **Violation in store:** async action never sets `this.loading = true/false` or
  `this.error = ...`.
- **Violation in component:** component references store's loading/error in `data()` (local
  copy) instead of a `computed` that reads from the store.

### R8 — Shared constants in src/constants/
- Values that are reused across multiple files (category lists, status strings, route names)
  must live in `src/constants/*.js` and be imported from there.
- **Violation:** the same string literal appearing 3+ times across different files, or a
  hardcoded list that already exists in `src/constants/`.

---

## Report format

For each file reviewed, output:

```
## <filename> (<relative path>)

### Violations
- [R<N>] <rule name>: <line number(s)> — <what's wrong> → <minimal fix>

### Warnings (non-rule, quality issues)
- <line number(s)>: <description>

### Pass
✓ <list rules that passed, comma-separated>
```

If a file has zero violations and zero warnings, write:
```
## <filename>
✓ All rules pass. No issues found.
```

---

## Summary

After reviewing all files, end with:

```
## Review Summary
Files reviewed: N
Violations: X across Y files
Warnings: Z

<If violations exist:>
Priority fixes:
1. [file] R<N>: one-line description
2. ...
```

---

## Tone and approach

- Be specific: always cite the line number and the exact code that's wrong.
- Suggest the minimal fix, not a refactor.
- Don't flag things that comply with the rules just because they could be "better."
- If something is ambiguous (e.g., a `:style` binding that seems justified), note it as a
  Warning rather than a Violation.
