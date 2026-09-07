<template>
  <div class="max-w-4xl mx-auto px-4 py-8 space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">

    <!-- En-tête -->
    <div class="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <span class="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{{ route.query.annee }}</span>
          <span>/</span>
          <span class="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{{ route.query.filiere }}</span>
          <span>/</span>
          <span class="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{{ route.query.semestre }}</span>
          <span>/</span>
          <span class="bg-emerald-700 text-white px-3 py-1 rounded-lg font-bold">{{ route.query.ueCode }}</span>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-white">{{ currentUe?.nom || 'Documents officiels' }}</h1>
      </div>
      <router-link :to="{ name: 'ues', query: routeQueryWithoutUe }" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        Changer d'UE
      </router-link>
    </div>

    <div v-if="loading" class="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm">
      <p class="text-sm font-bold text-slate-500">Chargement des documents...</p>
    </div>

    <div v-else class="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">

      <!-- Résultats de la session normale (affichés directement) -->
      <div class="space-y-4">
        <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Résultats — Session normale</h3>

        <div v-if="normalPublications.length === 0" class="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200">
          Aucun fichier PDF n'est actuellement publié pour la session normale de cette unité d'enseignement.
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="pub in normalPublications" :key="pub.id" class="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="px-2.5 py-1 rounded bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200/60">
                  {{ pub.session }}
                </span>
                <span class="text-[11px] text-slate-400 font-medium">Format PDF</span>
              </div>
              <p class="text-sm font-bold text-slate-900">{{ pub.nomFichier }}</p>
              <p class="text-xs text-slate-600 leading-relaxed">{{ pub.commentaire || 'Aucune description fournie.' }}</p>
            </div>

            <div class="flex items-center gap-3 pt-3 border-t border-slate-200/60">
              <button @click="visualiserPdf(pub)" class="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                Aperçu
              </button>
              <button @click="telechargerPdf(pub)" class="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Télécharger
              </button>
            </div>
          </div>
        </div>

        <!-- Lien discret vers le rattrapage -->
        <div v-if="rattrapagePublications.length > 0" class="pt-2">
          <button
            @click="expandedRattrapage = !expandedRattrapage"
            class="text-[11px] text-slate-400 hover:text-emerald-800 font-medium underline decoration-dotted transition-colors cursor-pointer"
          >
            {{ expandedRattrapage ? '▲ Masquer' : '▼ Voir aussi' }} les résultats de la session de rattrapage
          </button>

          <div v-if="expandedRattrapage" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div v-for="pub in rattrapagePublications" :key="pub.id" class="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-1 rounded bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200/60">
                    {{ pub.session }}
                  </span>
                  <span class="text-[11px] text-slate-400 font-medium">Format PDF</span>
                </div>
                <p class="text-sm font-bold text-slate-900">{{ pub.nomFichier }}</p>
                <p class="text-xs text-slate-600 leading-relaxed">{{ pub.commentaire || 'Aucune description fournie.' }}</p>
              </div>

              <div class="flex items-center gap-3 pt-3 border-t border-slate-200/60">
                <button @click="visualiserPdf(pub)" class="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  Aperçu
                </button>
                <button @click="telechargerPdf(pub)" class="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { mockUes, mockPublications } from '../data/mockData.js'
import axios from 'axios'

const route = useRoute()
const apiUrl = 'http://localhost:5000'
const apiUes = ref(null)
const apiPublications = ref(null)
const loading = ref(true)
const expandedRattrapage = ref(false)

const currentUeId = computed(() => Number(route.query.ueId))

const routeQueryWithoutUe = computed(() => {
  const { ueId, ueCode, ...rest } = route.query
  return rest
})

onMounted(async () => {
  try {
    const [uesResponse, publicationsResponse] = await Promise.all([
      axios.get(`${apiUrl}/api/ues`),
      axios.get(`${apiUrl}/api/publications`)
    ])
    apiUes.value = uesResponse.data
    apiPublications.value = publicationsResponse.data.map(publication => ({
      ...publication,
      ueId: Number(publication.ue_id),
      nomFichier: publication.nomFichier || publication.fichier,
      fileUrl: `${apiUrl}${publication.fileUrl}`
    }))
  } catch (error) {
    console.warn('API indisponible, utilisation des données de démonstration.', error)
  } finally {
    loading.value = false
  }
})

const currentUe = computed(() => {
  return (apiUes.value || mockUes.value).find(ue => Number(ue.id) === currentUeId.value)
})

const publicationsForUe = computed(() => {
  return (apiPublications.value || mockPublications.value).filter(pub => {
    const publicationUeId = Number(pub.ueId ?? pub.ue_id)
    // L'année est désormais portée par la publication elle-même (plus par l'UE),
    // donc on la compare à celle choisie dans le parcours.
    const matchAnnee = String(pub.annee || '').trim() === String(route.query.annee || '').trim()
    return publicationUeId === currentUeId.value && Boolean(pub.actif) && matchAnnee
  })
})

// Une session est classée "rattrapage" si son libellé contient ce mot,
// sinon elle est traitée comme "normale" par défaut.
const isSessionRattrapage = (libelle) => /rattrap/i.test(libelle || '')

const normalPublications = computed(() => publicationsForUe.value.filter(pub => !isSessionRattrapage(pub.session)))
const rattrapagePublications = computed(() => publicationsForUe.value.filter(pub => isSessionRattrapage(pub.session)))

const visualiserPdf = (pub) => {
  if (pub.fileUrl) {
    window.open(pub.fileUrl, '_blank')
  } else {
    alert("Le fichier source n'est pas disponible pour l'aperçu direct.")
  }
}

const telechargerPdf = async (pub) => {
  if (!pub.fileUrl) {
    alert(`Téléchargement simulé de : ${pub.nomFichier}`)
    return
  }
  try {
    const response = await fetch(pub.fileUrl)
    if (!response.ok) throw new Error('Le fichier est indisponible.')
    const blob = await response.blob()
    const fileURL = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = fileURL
    link.download = pub.nomFichier || 'document.pdf'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(fileURL)
  } catch (error) {
    alert('Le téléchargement du PDF est impossible pour le moment.')
  }
}
</script>
