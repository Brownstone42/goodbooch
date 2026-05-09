# CLAUDE-SPECIFIC INSTRUCTIONS

These instructions are intended for Claude Code only.
Other AI agents should ignore this file unless explicitly requested.

# Tech Stack

- Vue3
- Pinia
- Firebase
- Firestore
- Firebase Storage
- TailwindCSS
- Javascript only (No Typescript)

---

# Vue Rules

- Use Vue Method API
- Do not use Composition API
- Do not use `<script setup>`
- Component order must always be:
    - template
    - script
    - style

---

# Architecture Rules

- Never load Firebase directly inside Vue components
- All Firebase access must go through Pinia stores
- Use Firestore for metadata
- Use Firebase Storage for images
- Keep implementation simple
- Avoid overengineering
- Keep file sizes small and modular
- Prefer editing existing components over generating new systems
- Never rewrite working UI unless requested
- Shared constants (e.g. category lists) live in `src/constants/` and are imported by both admin and customer views
- localStorage persistence belongs in the Pinia store, not in components
- Stores expose `loading` and `error` state; components read them as computed properties

---

# UI / UX Rules

- Use TailwindCSS only
- Reuse existing Tailwind utility patterns whenever possible
- Mobile-first for customer pages
- Desktop-first for admin pages
- Preserve existing UI design language unless explicitly requested
- Back buttons use `← Back` text, `text-gray-500 text-sm` class, and call `$router.back()`

---

# Firebase Rules

- Never modify Firebase rules without asking
- Never modify Firebase config without asking

---

# AI Workflow Rules

- Always wait for my approval before generating code
- Do not refactor unrelated systems
- Do not rewrite entire pages unless explicitly requested
- Focus only on the requested task scope
