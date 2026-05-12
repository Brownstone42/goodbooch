<template>
    <div :class="spinnerClass"></div>
</template>

<script>
export default {
    name: 'LoadingSpinner',
    props: {
        admin: { type: Boolean, default: false },
    },
    computed: {
        spinnerClass() {
            return this.admin
                ? 'w-6 h-6 border-4 border-slate-300 border-t-brand rounded-full animate-spin'
                : 'w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin'
        }
    }
}
</script>
