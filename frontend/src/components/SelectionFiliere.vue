<template>
  <div class="space-y-12 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- En-tête -->
    <section class="relative overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-800 to-amber-600 bg-[length:200%_200%] animate-gradient-move text-white py-12 md:py-16 shadow-xl w-full max-w-6xl mx-auto sm:rounded-3xl text-center px-6">
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_2px,transparent_2px)] bg-[size:32px_32px] animate-dots-blink pointer-events-none"></div>
      
      <div class="relative z-10 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/25 backdrop-blur-md border border-white/30 text-amber-200 text-xs font-semibold shadow-sm">
          <span>Étape 2 sur l'arborescence</span>
          <span>•</span>
          <span>Année : {{ currentYear }}</span>
        </div>
        <BreadcrumbNav />
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Choisissez une filière
        </h1>
        <p class="text-white/95 text-xs sm:text-sm max-w-lg">
          Sélectionnez la filière de formation au sein de l'École Nationale d'Administration.
        </p>
      </div>
    </section>

    <!-- Grille des 4 filières de l'ENA avec animations de hover avancées -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="filiere in filieresList" 
          :key="filiere.code"
          @click="selectFiliere(filiere.code)"
          class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 hover:border-emerald-600 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          <!-- Effet lumineux subtil en arrière-plan au survol -->
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-emerald-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <div class="space-y-3 relative z-10">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wider border border-emerald-200 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                {{ filiere.code }}
              </span>
              <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-all duration-300">
                <svg class="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors duration-300">
              {{ filiere.name }}
            </h2>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ filiere.description }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium relative z-10">
            <span>Sélectionner le niveau d'études</span>
            <span class="text-emerald-800 font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
              Accéder <span>→</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Bouton Retour -->
      <div class="mt-8 text-center">
        <router-link 
          to="/consultation" 
          class="inline-flex items-center gap-2 text-xs font-bold text-emerald-900 hover:text-emerald-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Changer d'année académique</span>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const currentYear = computed(() => route.query.annee || '2025-2026')

const filieresList = ref([
  { 
    code: 'AG', 
    name: 'Administration Générale', 
    description: 'Dédié à la gestion territoriale, l administration du travail et de la sécurité sociale, ainsi qu à la diplomatie.' 
  },
  { 
    code: 'AF', 
    name: 'Administration des Finances', 
    description: 'Forme aux métiers de la gestion financière publique, administration des impôts, trésor et marchés publics.' 
  },
  { 
    code: 'SG', 
    name: 'Secrétariat de Gestion', 
    description: 'Axé sur les techniques administratives, la gestion de bureau et le secrétariat de direction.' 
  },
  { 
    code: 'STID', 
    name: "Sciences et Techniques de l'Information Documentaire", 
    description: 'Spécialisé en archivistique, bibliothéconomie et gestion de l information documentaire.' 
  }
])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/filieres')
    filieresList.value = response.data.map(filiere => ({
      ...filiere,
      name: filiere.nom,
      description: `Parcours de la filière ${filiere.nom}.`
    }))
  } catch (error) {
    console.warn('API indisponible, utilisation des filières de démonstration.', error)
  }
})

const selectFiliere = (filiereCode) => {
  router.push({ 
    name: 'niveaux', 
    query: { annee: currentYear.value, filiere: filiereCode } 
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