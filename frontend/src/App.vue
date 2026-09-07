<template>
  <div :class="[isAdminRoute ? 'min-h-screen w-full' : 'min-h-screen bg-slate-50 flex flex-col', 'font-sans antialiased text-slate-900']">
    <Navbar v-if="!isAdminRoute" />
    
    <main :class="isAdminRoute ? 'min-h-screen w-full' : 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8'">
      <router-view />
    </main>

    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script setup>
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>