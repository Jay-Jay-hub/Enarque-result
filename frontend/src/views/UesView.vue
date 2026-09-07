<template>
  <div class="space-y-12 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">

    <!-- En-tête -->
    <section class="relative overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-800 to-amber-600 bg-[length:200%_200%] animate-gradient-move text-white py-12 md:py-16 shadow-xl w-full max-w-6xl mx-auto sm:rounded-3xl text-center px-6">
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_2px,transparent_2px)] bg-[size:32px_32px] animate-dots-blink pointer-events-none"></div>

      <div class="relative z-10 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-200 text-xs font-bold tracking-wide shadow-sm">
          <span>Étape 6 sur l'arborescence</span>
          <span class="text-white/60">•</span>
          <span class="uppercase bg-white/10 px-2 py-0.5 rounded-md text-[11px]">{{ route.query.semestre }}</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Sélectionnez l'Unité d'Enseignement
        </h1>
        <p class="text-white/90 text-xs sm:text-sm max-w-lg leading-relaxed">
          Choisissez l'UE dont vous souhaitez consulter les résultats.
        </p>
      </div>
    </section>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">

      <!-- Bandeau PV Définitif du semestre, si disponible -->
      <a
        v-if="pvDefinitif"
        :href="pvDefinitif.fileUrl"
        target="_blank"
        class="flex items-center justify-between gap-4 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-2xl px-5 py-4 shadow-sm transition-all group"
      >
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-amber-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-xs font-bold text-amber-900">Voir le PV définitif du semestre ({{ route.query.semestre }})</span>
        </div>
        <span class="text-amber-700 text-xs font-bold group-hover:translate-x-1 transition-transform">→</span>
      </a>

      <div v-if="loading" class="text-center py-10 text-slate-500 text-xs font-bold">
        Chargement des UE...
      </div>

      <div v-else-if="filteredUes.length === 0" class="bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
        <h2 class="text-sm font-bold text-slate-800">Aucune UE disponible</h2>
        <p class="text-xs text-slate-500 max-w-md mx-auto">Aucune unité d'enseignement n'a été trouvée pour cette sélection exacte.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="ue in filteredUes"
          :key="ue.id"
          @click="selectUe(ue)"
          class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 hover:border-emerald-600 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-emerald-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <div class="space-y-3 relative z-10">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold tracking-wider border border-emerald-200 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
                {{ ue.code }}
              </span>
              <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-all duration-300">
                <svg class="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors duration-300">
              {{ ue.nom }}
            </h2>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium relative z-10">
            <span>Consulter les résultats</span>
            <span class="text-emerald-800 font-semibold group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-1">
              Consulter <span>→</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Bouton Retour -->
      <div class="mt-10 text-center">
        <router-link
          :to="{ name: 'semestres', query: route.query }"
          class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-emerald-900 text-xs font-bold shadow-sm hover:shadow transition-all duration-200 group"
        >
          <svg class="w-4 h-4 text-emerald-800 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Retour au choix du semestre</span>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockUes } from '../data/mockData.js'
import axios from 'axios'
import { API_URL, BASE_URL } from '../config.js'

const route = useRoute()
const router = useRouter()
const apiUes = ref(null)
const loading = ref(true)
const pvSemestresList = ref([])

onMounted(async () => {
  try {
    const response = await axios.get(`${API_URL}/ues`)
    apiUes.value = response.data.map(ue => ({
      ...ue,
      filiere: String(ue.filiere || '').trim().toUpperCase(),
      specialite: ue.specialite ? String(ue.specialite).trim().toUpperCase() : null,
      niveau: String(ue.niveau || '').trim().toUpperCase(),
      semestre: String(ue.semestre || '').trim().toUpperCase()
    }))
  } catch (error) {
    console.warn('API indisponible, utilisation des UE de démonstration.', error)
  } finally {
    loading.value = false
  }

  try {
    const pvResponse = await axios.get(`${API_URL}/pv-semestres`)
    pvSemestresList.value = pvResponse.data.map(pv => ({
      ...pv,
      fileUrl: `${BASE_URL}${pv.fileUrl}`
    }))
  } catch (error) {
    console.warn('PV définitifs indisponibles.', error)
  }
})

// Le PV définitif actif correspondant à la filière + niveau + semestre + année (+ spécialité) en cours
const pvDefinitif = computed(() => {
  return pvSemestresList.value.find(pv => {
    const matchBase = pv.actif &&
      String(pv.filiere || '').trim().toUpperCase() === String(route.query.filiere || '').trim().toUpperCase() &&
      String(pv.niveau || '').trim().toUpperCase() === String(route.query.niveau || '').trim().toUpperCase() &&
      String(pv.semestre || '').trim().toUpperCase() === String(route.query.semestre || '').trim().toUpperCase() &&
      String(pv.annee || '').trim() === String(route.query.annee || '').trim()
    const matchSpecialite = (route.query.niveau === 'L1' || route.query.filiere === 'SG')
      ? true
      : String(pv.specialite || '') === String(route.query.specialite || '')
    return matchBase && matchSpecialite
  }) || null
})

const filteredUes = computed(() => {
  // L'UE ne dépend plus de l'année (catalogue fixe) : on ne filtre plus dessus ici.
  return (apiUes.value || mockUes.value).filter(ue => {
    const matchFiliere = String(ue.filiere).trim().toUpperCase() === String(route.query.filiere || '').trim().toUpperCase()
    const matchNiveau = String(ue.niveau).trim().toUpperCase() === String(route.query.niveau || '').trim().toUpperCase()
    const matchSemestre = String(ue.semestre).trim().toUpperCase() === String(route.query.semestre || '').trim().toUpperCase()
    const matchSpecialite = (route.query.niveau === 'L1' || route.query.filiere === 'SG')
      ? true
      : String(ue.specialite || '') === String(route.query.specialite || '')

    return matchFiliere && matchNiveau && matchSemestre && matchSpecialite
  })
})

const selectUe = (ue) => {
  router.push({
    name: 'ue-detail',
    query: { ...route.query, ueId: ue.id, ueCode: ue.code }
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