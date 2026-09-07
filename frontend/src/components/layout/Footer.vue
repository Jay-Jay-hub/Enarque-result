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

      <div class="text-emerald-200/70 text-center md:text-right font-normal">
        &copy; {{ currentYear }} BUE-ENA (Université d'Abomey-Calavi). Tous droits réservés.
      </div>

    </div>
  </footer>
</template>