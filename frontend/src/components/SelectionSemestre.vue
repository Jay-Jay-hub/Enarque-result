<template>
  <div class="space-y-12 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- En-tête -->
    <section class="relative overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-800 to-amber-600 bg-[length:200%_200%] animate-gradient-move text-white py-12 md:py-16 shadow-xl w-full max-w-6xl mx-auto sm:rounded-3xl text-center px-6">
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_2px,transparent_2px)] bg-[size:32px_32px] animate-dots-blink pointer-events-none"></div>
      
      <div class="relative z-10 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-200 text-xs font-bold tracking-wide shadow-sm">
          <span>Étape 5 sur l'arborescence</span>
          <span class="text-white/60">•</span>
          <span class="uppercase bg-white/10 px-2 py-0.5 rounded-md text-[11px]">{{ currentNiveau }} - {{ currentSpecialite || currentFiliere }}</span>
        </div>
        <BreadcrumbNav />
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Sélectionnez le semestre
        </h1>
        <p class="text-white/90 text-xs sm:text-sm max-w-lg leading-relaxed">
          Veuillez choisir le semestre concerné par votre recherche de documents académiques.
        </p>
      </div>
    </section>

    <!-- Grille des semestres -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="sem in currentSemestres" 
          :key="sem.code"
          @click="selectSemestre(sem.code)"
          class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 hover:border-emerald-650 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-emerald-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <div class="space-y-3 relative z-10">
            <div class="flex items-center justify-between">
              <span class="px-3.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-extrabold tracking-wider border border-emerald-200 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                {{ sem.code }}
              </span>
              <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-all duration-300">
                <svg class="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <h2 class="text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors duration-300">
              {{ sem.name }}
            </h2>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ sem.description }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium relative z-10">
            <span>Choisir ce semestre</span>
            <span class="text-emerald-800 font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
              Continuer <span>→</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Bouton Retour -->
      <div class="mt-10 text-center">
        <router-link 
          :to="{ name: 'specialites', query: { annee: currentYear, filiere: currentFiliere, niveau: currentNiveau } }" 
          class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-emerald-900 text-xs font-bold shadow-sm hover:shadow transition-all duration-200 group"
        >
          <svg class="w-4 h-4 text-emerald-800 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Retour au choix de la spécialité</span>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentYear = computed(() => route.query.annee || '2025-2026')
const currentFiliere = computed(() => route.query.filiere || 'AG')
const currentNiveau = computed(() => route.query.niveau || 'L2')
const currentSpecialite = computed(() => route.query.specialite || '')

// Définition des semestres par niveau
const semestresData = {
  L1: [
    { code: 'S1', name: 'Semestre 1', description: 'Premier semestre du tronc commun de première année.' },
    { code: 'S2', name: 'Semestre 2', description: 'Second semestre du tronc commun de première année.' }
  ],
  L2: [
    { code: 'S3', name: 'Semestre 3', description: 'Premier semestre de spécialisation en deuxième année.' },
    { code: 'S4', name: 'Semestre 4', description: 'Second semestre de spécialisation en deuxième année.' }
  ],
  L3: [
    { code: 'S5', name: 'Semestre 5', description: 'Premier semestre de consolidation et d approfondissement en licence 3.' },
    { code: 'S6', name: 'Semestre 6', description: 'Second semestre de fin de cycle (stages et mémoires / soutenances).' }
  ]
}

const currentSemestres = computed(() => {
  return semestresData[currentNiveau.value] || semestresData.L2
})

const selectSemestre = (semCode) => {
  router.push({ 
    name: 'ues', 
    query: { 
      ...route.query,
      semestre: semCode 
    } 
  })
}
</script>
