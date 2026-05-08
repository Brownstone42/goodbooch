# Project Architecture

- Vue3
- Pinia state management
- Firebase backend
- TailwindCSS
- Never load Firebase directly inside components
- Use stores for all data access
- Use Javascript only not Typescript
- Use Vue Method API not Composition API
- Always wait for my approval before generating code
- Not using script setup, layout should be template > script > style
- Using TailwindCSS as a css framework
- All Firebase access must go through Pinia stores
- Use Firebase Storage for images
- Use Firestore for metadata
- Mobile-first for customer pages
- Desktop-first for admin pages
- Prefer simple implementations
- Avoid overengineering

# Firebase Rules

- Never modify Firebase rules without asking
- Never modify Firebase config without asking
