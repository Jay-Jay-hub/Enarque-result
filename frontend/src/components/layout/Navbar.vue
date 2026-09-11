<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import logoUrl from '../../assets/OIP.webp'

const route = useRoute()

// Masque la navbar si l'URL commence par /admin
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <header 
    v-if="!isAdminRoute" 
    class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all duration-300 font-['Plus_Jakarta_Sans',sans-serif]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
      
      <!-- Logo & Identité Visuelle -->
      <router-link 
        to="/" 
        class="flex items-center gap-3 sm:gap-3.5 group py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded-xl"
      >
        <div class="relative flex items-center justify-center p-1 bg-slate-50/80 border border-slate-200/60 rounded-xl group-hover:bg-emerald-50/60 group-hover:border-emerald-200/80 transition-all duration-300">
          <img 
            :src="logoUrl" 
            alt="Logo ENA Bénin" 
            class="h-9 sm:h-11 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        
        <div class="border-l border-slate-200/80 pl-3 sm:pl-3.5 flex flex-col justify-center">
          <span class="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none group-hover:text-emerald-800 transition-colors duration-200">
            Enarque Result
          </span>
          <div class="flex items-center gap-1.5 mt-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
              Résultats Académiques
            </span>
          </div>
        </div>
      </router-link>

      <!-- Navigation & Actions -->
      <nav class="flex items-center gap-2 sm:gap-4">
        <!-- Lien Accueil Discret (Visible sur écran moyen et grand) -->
        <router-link 
          to="/" 
          class="hidden md:inline-flex items-center text-xs font-semibold text-slate-600 hover:text-emerald-800 px-3.5 py-2 rounded-xl hover:bg-slate-100/80 transition-all duration-200"
          exact-active-class="text-emerald-800 font-bold bg-emerald-50/80"
        >
          Accueil
        </router-link>

        <!-- Bouton Consultation Interactif -->
        <router-link 
          to="/consultation" 
          class="relative inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] transition-all duration-300 shadow-xs hover:shadow-lg hover:shadow-emerald-900/20 group overflow-hidden"
        >
          <!-- Reflet lumineux au survol -->
          <span class="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          
          <!-- Texte adapté selon l'écran -->
          <span class="relative z-10 hidden sm:inline">Consulter les résultats</span>
          <span class="relative z-10 sm:hidden">Consulter</span>
          
          <!-- Icône Flèche Animée -->
          <svg class="relative z-10 w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </router-link>
      </nav>

    </div>
  </header>
</template>
