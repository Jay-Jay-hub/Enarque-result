<template>
  <div class="space-y-12 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- En-tête -->
    <section class="relative overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-800 to-amber-600 bg-[length:200%_200%] animate-gradient-move text-white py-12 md:py-16 shadow-xl w-full max-w-6xl mx-auto sm:rounded-3xl text-center px-6">
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_2px,transparent_2px)] bg-[size:32px_32px] animate-dots-blink pointer-events-none"></div>
      
      <div class="relative z-10 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-200 text-xs font-bold tracking-wide shadow-sm">
          <span>Étape finale</span>
          <span class="text-white/60">•</span>
          <span class="uppercase bg-white/10 px-2 py-0.5 rounded-md text-[11px]">UE : {{ currentUeCode }}</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Sélectionnez la Session & Situation
        </h1>
        <p class="text-white/90 text-xs sm:text-sm max-w-lg leading-relaxed">
          Choisissez la session d'évaluation pour consulter ou télécharger le document officiel associé.
        </p>
      </div>
    </section>

    <!-- Contenu : Liste des Publications / Sessions disponibles -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      
      <div v-if="loading" class="text-center py-10 text-slate-500 text-xs font-bold">
        Recherche des documents disponibles...
      </div>

      <div v-else-if="publicationsList.length === 0" class="backdrop-blur-xl bg-white/80 rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
        <p class="text-sm font-bold text-slate-700">Aucun document ou résultat n'a encore été publié pour cette UE et ce contexte.</p>
        <p class="text-xs text-slate-500">Veuillez patienter que l'administration procède à la publication.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="pub in publicationsList" 
          :key="pub.id"
          class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-200">
                {{ pub.session_nom || 'Session' }}
              </span>
              <span class="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                Version v{{ pub.version || 1 }}
              </span>
            </div>
            <h2 class="text-base font-bold text-slate-900">
              {{ pub.situation_nom || 'Situation' }}
            </h2>
            <p class="text-xs text-slate-500">
              Publié le : {{ new Date(pub.date_publication).toLocaleDateString() }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-400">Document officiel PDF</span>
            <a 
              :href="`${BASE_URL}/uploads/${pub.fichier}`" 
              target="_blank" 
              class="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Télécharger le PV →</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Bouton Retour -->
      <div class="mt-10 text-center">
        <router-link 
          :to="{ name: 'ues', query: { ...route.query, ueId: undefined, ueCode: undefined } }" 
          class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-emerald-900 text-xs font-bold shadow-sm transition-all"
        >
          <span>← Retour au choix de l'UE</span>
        </router-link>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { API_URL, BASE_URL } from '../config.js'

const route = useRoute()
const currentUeId = computed(() => route.query.ueId || null)
const currentUeCode = computed(() => route.query.ueCode || '')
const currentSemestreId = computed(() => route.query.semestreId || null)
const currentAnneeId = computed(() => route.query.annee || '')

const publicationsList = ref([])
const loading = ref(false)

// Récupération des publications correspondantes depuis le backend
const fetchPublications = async () => {
  if (!currentUeId.value) return
  loading.value = true
  try {
    const response = await axios.get(`${API_URL}/publications`, {
      params: {
        annee_id: currentAnneeId.value,
        semestre_id: currentSemestreId.value,
        ue_id: currentUeId.value,
        type: 'UE'
      }
    })
    publicationsList.value = response.data
  } catch (error) {
    console.error("Erreur lors de la récupération des publications:", error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPublications)
</script>