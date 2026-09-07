<template>
  <div class="space-y-10 pb-20 font-['Plus_Jakarta_Sans',sans-serif] max-w-5xl mx-auto px-4 sm:px-6">
    
    <!-- En-tête de recherche -->
    <section class="relative overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 bg-[length:200%_200%] animate-gradient-move text-white py-12 md:py-16 shadow-xl w-full sm:rounded-3xl text-center px-6">
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_2px,transparent_2px)] bg-[size:32px_32px] animate-dots-blink pointer-events-none"></div>
      
      <div class="relative z-10 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
        <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-200 text-xs font-bold tracking-wide shadow-sm">
          <span>Portail Documentaire</span>
          <span class="text-white/60">•</span>
          <span class="uppercase bg-white/10 px-2 py-0.5 rounded-md text-[11px]">Recherche rapide</span>
        </span>
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Trouvez votre document en un clin d'Œil
        </h1>
        <p class="text-white/90 text-xs sm:text-sm max-w-lg leading-relaxed">
          Effectuez une recherche globale ou utilisez directement nos filtres pour accéder à vos procès-verbaux et archives.
        </p>
      </div>
    </section>

    <!-- Barre de recherche globale & Filtres -->
    <div class="backdrop-blur-xl bg-white/70 dark:bg-slate-900/40 rounded-3xl p-6 md:p-8 border border-white/65 shadow-xl space-y-6">
      
      <!-- Champ de recherche par mot-clé -->
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Rechercher par titre, filière, mot-clé..." 
          class="w-full bg-white/60 backdrop-blur-md border border-slate-300/80 rounded-2xl pl-12 pr-4 py-4 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-sm transition-all"
        >
      </div>

      <!-- Filtres combinés -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        <!-- Filtre Année -->
        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Année</label>
          <select v-model="selectedAnnee" class="w-full bg-white/60 border border-slate-300/80 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600">
            <option value="">Toutes les années</option>
            <option v-for="a in anneesDisponibles" :key="a.id" :value="a.libelle">{{ a.libelle }}</option>
          </select>
        </div>

        <!-- Filtre Filière -->
        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Filière</label>
          <select v-model="selectedFiliere" class="w-full bg-white/60 border border-slate-300/80 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600">
            <option value="">Toutes les filières</option>
            <option v-for="f in filieresDisponibles" :key="f.id" :value="f.code">{{ f.nom }}</option>
          </select>
        </div>

        <!-- Filtre Niveau -->
        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Niveau</label>
          <select v-model="selectedNiveau" class="w-full bg-white/60 border border-slate-300/80 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600">
            <option value="">Tous les niveaux</option>
            <option v-for="n in niveauxDisponibles" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <!-- Filtre Session -->
        <div class="space-y-1">
          <label class="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Session / Type</label>
          <select v-model="selectedSession" class="w-full bg-white/60 border border-slate-300/80 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600">
            <option value="">Toutes les sessions</option>
            <option v-for="s in sessionsDisponibles" :key="s" :value="s">{{ s }}</option>
            <option value="Procès-verbaux définitifs">Procès-verbaux définitifs</option>
          </select>
        </div>

      </div>
    </div>

    <!-- Résultats de la recherche -->
    <div class="space-y-4">
      <div class="flex justify-between items-center px-2">
        <h2 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
          Résultats de recherche <span class="text-emerald-800 font-bold">({{ filteredDocuments.length }})</span>
        </h2>
      </div>

      <!-- Liste des documents filtrés -->
      <div v-if="filteredDocuments.length > 0" class="grid grid-cols-1 gap-4">
        <div 
          v-for="doc in filteredDocuments" 
          :key="doc.id"
          class="backdrop-blur-xl bg-white/80 hover:bg-white rounded-2xl p-5 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
        >
          <div class="space-y-1.5">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase">
                {{ doc.filiere_code }} • {{ doc.niveau }}
              </span>
              <span class="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                {{ doc.session_type }}
              </span>
              <span class="text-xs text-slate-500 font-semibold">Année : {{ doc.annee_id }}</span>
            </div>
            <h3 class="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
              {{ doc.title }}
            </h3>
          </div>

          <!-- Bouton de consultation -->
          <a 
            :href="doc.file_url" 
            target="_blank"
            class="px-5 py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Consulter / Télécharger</span>
          </a>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="backdrop-blur-xl bg-white/60 rounded-3xl p-10 text-center border border-slate-200/80 shadow-sm space-y-3">
        <p class="text-sm font-bold text-slate-700">Aucun document ne correspond à vos critères.</p>
        <p class="text-xs text-slate-500">Modifiez vos filtres ou suivez le parcours étape par étape ci-dessous.</p>
      </div>
    </div>

    <!-- SECTION : PROCÉDURE ÉTAPE PAR ÉTAPE (NAVIGATION CLASSIQUE) -->
    <div class="backdrop-blur-xl bg-white/80 dark:bg-slate-900/50 rounded-3xl p-8 border border-emerald-500/30 shadow-xl space-y-6">
      <div class="text-center space-y-2">
        <span class="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200">
          Alternative guidée
        </span>
        <h2 class="text-lg font-extrabold text-slate-900 tracking-tight">
          Vous préférez procéder étape par étape ?
        </h2>
        <p class="text-xs text-slate-600 max-w-md mx-auto">
          Laissez-vous guider à travers l'arborescence académique pour trouver votre document.
        </p>
      </div>

      <div class="pt-2">
        <button 
          @click="goToStepByStep"
          class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white text-xs font-extrabold uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
        >
          <span>Commencer par choisir l'Année Académique</span>
          <svg class="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const searchQuery = ref('')
const selectedAnnee = ref('')
const selectedFiliere = ref('')
const selectedNiveau = ref('')
const selectedSession = ref('')

const anneesDisponibles = ref([])
const filieresDisponibles = ref([])
const niveauxDisponibles = ref([])
const sessionsDisponibles = ref([])

const documentsList = ref([
  { id: '1', title: 'PV Définitif L1 Administration Générale - Session Normale', annee_id: '2026-2027', filiere_code: 'AG', niveau: 'L1', session_type: 'Session normale', file_url: '#' },
  { id: '2', title: 'Procès-verbal de Rattrapage L2 Administration Financière', annee_id: '2026-2027', filiere_code: 'AF', niveau: 'L2', session_type: 'Session de rattrapages', file_url: '#' },
  { id: '3', title: 'Résultats Définitifs L3 STID Archivistique', annee_id: '2025-2026', filiere_code: 'STID', niveau: 'L3', session_type: 'Procès-verbaux définitifs', file_url: '#' }
])

onMounted(async () => {
  try {
    const [anneesRes, filieresRes, semestresRes, sessionsRes, publicationsRes, pvRes] = await Promise.all([
      axios.get('http://localhost:5000/api/annees'),
      axios.get('http://localhost:5000/api/filieres'),
      axios.get('http://localhost:5000/api/semestres'),
      axios.get('http://localhost:5000/api/sessions'),
      axios.get('http://localhost:5000/api/publications'),
      axios.get('http://localhost:5000/api/pv-semestres')
    ])

    anneesDisponibles.value = anneesRes.data
    filieresDisponibles.value = filieresRes.data
    niveauxDisponibles.value = [...new Set(semestresRes.data.map(s => s.niveau))].sort()
    sessionsDisponibles.value = [...new Set(sessionsRes.data.map(s => s.libelle))]

    const publications = publicationsRes.data.map(publication => ({
      id: `pub-${publication.id}`,
      title: `${publication.ueCode} - ${publication.ueName}`,
      annee_id: publication.annee,
      filiere_code: publication.filiere || '',
      niveau: publication.niveau || '',
      session_type: publication.session,
      file_url: `http://localhost:5000${publication.fileUrl}`
    }))

    const pvSemestres = pvRes.data
      .filter(pv => pv.actif)
      .map(pv => ({
        id: `pv-${pv.id}`,
        title: `PV Définitif - ${pv.filiere} ${pv.semestre} (${pv.niveau})`,
        annee_id: pv.annee,
        filiere_code: pv.filiere || '',
        niveau: pv.niveau || '',
        session_type: 'Procès-verbaux définitifs',
        file_url: `http://localhost:5000${pv.fileUrl}`
      }))

    documentsList.value = [...publications, ...pvSemestres]
  } catch (error) {
    console.warn('API indisponible, utilisation des documents de démonstration.', error)
  }
})

const filteredDocuments = computed(() => {
  return documentsList.value.filter(doc => {
    const matchesQuery = searchQuery.value === '' || doc.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesAnnee = selectedAnnee.value === '' || doc.annee_id === selectedAnnee.value
    const matchesFiliere = selectedFiliere.value === '' || doc.filiere_code === selectedFiliere.value
    const matchesNiveau = selectedNiveau.value === '' || doc.niveau === selectedNiveau.value
    const matchesSession = selectedSession.value === '' || doc.session_type === selectedSession.value

    return matchesQuery && matchesAnnee && matchesFiliere && matchesNiveau && matchesSession
  })
})

// Redirige vers SelectionAnnee via la route /consultation
const goToStepByStep = () => {
  router.push({ path: '/consultation' })
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