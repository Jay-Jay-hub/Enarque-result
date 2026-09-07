<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Masque le footer si l'URL commence par /admin
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const currentYear = computed(() => new Date().getFullYear())
</script>

<template>
  <footer v-if="!isAdminRoute" class="w-full bg-emerald-950 border-t border-emerald-900/60 text-white py-8 mt-auto shadow-inner font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
      
      <div class="flex items-center gap-3 text-center md:text-left">
        <div class="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-amber-300 tracking-wider shadow-xs font-bold">
          ENARQUE RESULT / BUE-ENA
        </div>
        <span class="hidden md:inline text-emerald-700">|</span>
        <span class="text-emerald-100/90 font-medium">Plateforme d'Archivage et de Consultation des Résultats</span>
      </div>

      <div class="text-emerald-200/70 text-center md:text-right font-normal flex items-center gap-3">
        <span>&copy; {{ currentYear }} BUE-ENA (Université d'Abomey-Calavi). Tous droits réservés.</span>
        <router-link to="/admin" title="Espace administrateur" class="text-amber-200/40 hover:text-amber-300 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </router-link>
      </div>

    </div>
  </footer>
</template>