<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import logoUrl from '../../assets/OIP.webp'

const route = useRoute()

// Masque la navbar si l'URL commence par /admin
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <header v-if="!isAdminRoute" class="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-xs font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      
      <!-- Logo & Identité Visuelle -->
      <router-link to="/" class="flex items-center gap-3.5 group py-2">
        <img 
          :src="logoUrl" 
          alt="Logo ENA Bénin" 
          class="h-11 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-200" 
        />
        <div class="border-l border-slate-200 pl-3.5">
          <span class="font-extrabold text-lg text-slate-900 tracking-tight block leading-tight group-hover:text-emerald-800 transition-colors">
            Enarque Result
          </span>
          <span class="text-[11px] font-medium text-slate-500 tracking-wider uppercase block">
            Résultats Académiques
          </span>
        </div>
      </router-link>

      <!-- Navigation & Actions unifiées -->
      <nav class="flex items-center gap-3">
        <!-- Lien Consultation -->
        <router-link 
          to="/consultation" 
          class="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 border border-emerald-900 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <span>Consulter les résultats</span>
          <span class="text-amber-300">&rarr;</span>
        </router-link>
      </nav>

    </div>
  </header>
</template>