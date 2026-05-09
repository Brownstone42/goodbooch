<template>
    <div class="text-center py-12">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <slot name="icon" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-1">{{ title }}</h3>
        <p class="text-sm text-gray-500 mb-6">{{ message }}</p>
        <slot />
    </div>
</template>

<script>
export default {
    name: 'EmptyState',
    props: {
        title: { type: String, required: true },
        message: { type: String, default: '' },
    }
}
</script>
