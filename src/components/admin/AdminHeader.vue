<template>
    <header class="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
        <div class="flex items-center gap-4 flex-1">
            <div class="relative w-full max-w-md group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#005c3d] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Search products, orders..." 
                    class="block w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#005c3d] focus:bg-white transition-all duration-200"
                />
            </div>
        </div>
        
        <div class="flex items-center gap-6">
            <button class="relative text-slate-400 hover:text-[#005c3d] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            
            <div class="h-8 w-px bg-slate-200"></div>
            
            <button class="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div class="text-right hidden sm:block">
                    <p class="text-sm font-semibold text-slate-900">Admin User</p>
                    <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Super Admin</p>
                </div>
                <div class="w-10 h-10 rounded-xl bg-[#005c3d] text-white flex items-center justify-center font-bold">
                    A
                </div>
            </button>
        </div>
    </header>
</template>

<script>
export default {
    name: 'AdminHeader'
}
</script>
