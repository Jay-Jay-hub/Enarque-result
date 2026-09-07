<template>
  <div class="space-y-12 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- En-tête -->
    <section class="relative overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-800 to-amber-600 bg-[length:200%_200%] animate-gradient-move text-white py-12 md:py-16 shadow-xl w-full max-w-6xl mx-auto sm:rounded-3xl text-center px-6">
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_2px,transparent_2px)] bg-[size:32px_32px] animate-dots-blink pointer-events-none"></div>
      
      <div class="relative z-10 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-200 text-xs font-bold tracking-wide shadow-sm">
          <span>Étape 4 sur l'arborescence</span>
          <span class="text-white/60">•</span>
          <span class="uppercase bg-white/10 px-2 py-0.5 rounded-md text-[11px]">{{ currentFiliere }} - {{ currentNiveau }}</span>
        </div>
        <BreadcrumbNav />
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Sélectionnez la spécialité
        </h1>
        <p class="text-white/90 text-xs sm:text-sm max-w-lg leading-relaxed">
          Veuillez choisir votre option de spécialisation pour la filière <strong class="text-white font-bold">{{ currentFiliere }}</strong> en <strong class="text-amber-200 font-bold">{{ currentNiveau }}</strong>.
        </p>
      </div>
    </section>

    <!-- Grille des spécialités -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="spec in currentSpecialites" 
          :key="spec.code"
          @click="selectSpecialite(spec.code)"
          class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 hover:border-emerald-600 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-emerald-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <div class="space-y-3 relative z-10">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wider border border-emerald-200 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                {{ spec.code }}
              </span>
              <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-all duration-300">
                <svg class="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors duration-300">
              {{ spec.name }}
            </h2>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ spec.description }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium relative z-10">
            <span>Accéder aux documents</span>
            <span class="text-emerald-800 font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
              Consulter <span>→</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Bouton Retour -->
      <div class="mt-10 text-center">
        <router-link 
          :to="{ name: 'niveaux', query: { annee: currentYear, filiere: currentFiliere } }" 
          class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-emerald-900 text-xs font-bold shadow-sm hover:shadow transition-all duration-200 group"
        >
          <svg class="w-4 h-4 text-emerald-800 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Retour au choix du niveau</span>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockSpecialites } from '../data/mockData.js'
import axios from 'axios'
import { API_URL, BASE_URL } from '../config.js'

const route = useRoute()
const router = useRouter()

const currentYear = computed(() => route.query.annee || '2025-2026')
const currentFiliere = computed(() => route.query.filiere || 'AG')
const currentNiveau = computed(() => route.query.niveau || 'L2')

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/specialites`)
    mockSpecialites.value = response.data.map(specialite => ({
      ...specialite,
      niveau: specialite.niveau_min
    }))
  } catch (error) {
    console.warn('API indisponible, utilisation des spécialités de démonstration.', error)
  }
})

// Récupération dynamique des spécialités selon la filière sélectionnée
const currentSpecialites = computed(() => {
  const niveaux = { L1: 1, L2: 2, L3: 3 }
  return mockSpecialites.value
    .filter(specialite => specialite.filiere === currentFiliere.value && niveaux[specialite.niveau] <= niveaux[currentNiveau.value])
    .map(specialite => ({
      ...specialite,
      name: specialite.nom,
      description: `Spécialité ${specialite.nom} de la filière ${specialite.filiere}.`
    }))
})

const selectSpecialite = (specCode) => {
  // Redirection vers l'étape des semestres (S3/S4 pour L2, S5/S6 pour L3)
  router.push({ 
    name: 'semestres', 
    query: { 
      annee: currentYear.value, 
      filiere: currentFiliere.value, 
      niveau: currentNiveau.value, 
      specialite: specCode 
    } 
  })
}
</script>

<style>
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-move {
  animation: gradientMove 12s ease infinite;
}
@keyframes dotsBlink {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.8; }
}
.animate-dots-blink {
  animation: dotsBlink 3s ease-in-out infinite;
}
</style>