<template>
  <div class="space-y-12 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- En-tête de la page de consultation -->
    <section class="relative overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-800 to-amber-600 bg-[length:200%_200%] animate-gradient-move text-white py-12 md:py-16 shadow-xl w-full max-w-6xl mx-auto sm:rounded-3xl text-center px-6">
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_2px,transparent_2px)] bg-[size:32px_32px] animate-dots-blink pointer-events-none"></div>
      
      <div class="relative z-10 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-200 text-xs font-semibold">
          <span>Étape 1 sur 4</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Archives des résultats académiques
        </h1>
        <p class="text-white/95 text-xs sm:text-sm max-w-lg">
          Sélectionnez l'année académique pour accéder aux filières et documents officiels de l'établissement.
        </p>
      </div>
    </section>

    <!-- Zone de sélection de l'année en cartes -->
    <div class="max-w-3xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          v-for="year in availableYears"
          :key="year.id"
          @click="selectYear(year.id)"
          class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 hover:border-emerald-600 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-emerald-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <div class="space-y-3 relative z-10">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wider border border-emerald-200 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                {{ year.name }}
              </span>
              <span v-if="year.isLatest" class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Nouveau
              </span>
            </div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors duration-300">
              Année {{ year.name }}
            </h2>
            <p class="text-xs text-slate-600 leading-relaxed" v-if="year.isLatest">
              Année académique active en cours de consultation.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium relative z-10">
            <span>Consulter les filières</span>
            <span class="text-emerald-800 font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
              Continuer <span>→</span>
            </span>
          </div>
        </div>
      </div>

      <div v-if="availableYears.length === 0" class="text-center text-xs text-slate-400 italic py-10">
        Aucune année académique disponible pour le moment.
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mockAnneesAcademiques } from '../data/mockData.js'
import axios from 'axios'

const router = useRouter()

const sortedYears = computed(() => [...mockAnneesAcademiques.value].sort((first, second) => {
  const firstStart = Number.parseInt(first.libelle, 10) || 0
  const secondStart = Number.parseInt(second.libelle, 10) || 0
  return secondStart - firstStart
}))

const availableYears = computed(() => sortedYears.value.map((year, index) => ({
  id: year.libelle,
  name: year.libelle.replace('-', ' - '),
  isLatest: index === 0
})))

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/annees')
    mockAnneesAcademiques.value = response.data.sort((first, second) => {
      const firstStart = Number.parseInt(first.libelle, 10) || 0
      const secondStart = Number.parseInt(second.libelle, 10) || 0
      return secondStart - firstStart
    })
  } catch (error) {
    console.warn('API indisponible, utilisation des années de démonstration.', error)
  }
})

const selectYear = (yearId) => {
  router.push({ name: 'filieres', query: { annee: yearId } })
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
