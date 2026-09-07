<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- EN-TÊTE -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
      <h1 class="text-xl font-extrabold text-slate-900 tracking-tight">Consultation des Résultats - ENA Bénin</h1>
      <p class="text-xs text-slate-500">Sélectionnez votre parcours académique pour afficher les relevés et résultats officiels.</p>
    </div>

    <!-- FORMULAIRE DE FILTRAGE EN CASCADE -->
    <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <!-- 1. Année Académique -->
        <div>
          <label class="text-xs font-bold text-slate-700 block mb-1">Année Académique :</label>
          <select v-model="filters.annee" class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-800">
            <option v-for="a in mockAnneesAcademiques" :key="a.id" :value="a.libelle">{{ a.libelle }}</option>
          </select>
        </div>

        <!-- 2. Filière -->
        <div>
          <label class="text-xs font-bold text-slate-700 block mb-1">Filière :</label>
          <select v-model="filters.filiere" @change="onFiliereChange" class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-800">
            <option v-for="f in mockFilieres" :key="f.code" :value="f.code">{{ f.nom }}</option>
          </select>
        </div>

        <!-- 3. Niveau -->
        <div>
          <label class="text-xs font-bold text-slate-700 block mb-1">Niveau d'études :</label>
          <select v-model="filters.niveau" @change="onNiveauChange" class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-800">
            <option value="L1">Licence 1 (L1)</option>
            <option value="L2">Licence 2 (L2)</option>
            <option value="L3">Licence 3 (L3)</option>
          </select>
        </div>

        <!-- 4. Spécialité (Conditionnelle : masquée si L1 ou SG) -->
        <div v-if="filters.niveau !== 'L1' && filters.filiere !== 'SG'">
          <label class="text-xs font-bold text-slate-700 block mb-1">Spécialité :</label>
          <select v-model="filters.specialite" class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-800">
            <option value="">-- Choisir une spécialité --</option>
            <option v-for="s in availableSpecialites" :key="s.code" :value="s.code">{{ s.nom }}</option>
          </select>
        </div>

        <!-- 5. Semestre -->
        <div>
          <label class="text-xs font-bold text-slate-700 block mb-1">Semestre :</label>
          <select v-model="filters.semestre" class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-emerald-800">
            <option v-for="sem in availableSemestres" :key="sem" :value="sem">{{ sem }}</option>
          </select>
        </div>

      </div>
    </div>

    <!-- RÉSULTATS / PUBLICATIONS TROUVÉES -->
    <div class="space-y-4">
      <h2 class="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Résultats Disponibles</h2>
      
      <div v-if="filteredPublications.length === 0" class="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
        <p class="text-xs font-bold text-slate-500">Aucun résultat publié ne correspond à ces critères pour le moment.</p>
      </div>

      <div class="grid grid-cols-1 gap-4" v-else>
        <div v-for="pub in filteredPublications" :key="pub.id" class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-[10px]">Session {{ pub.session }}</span>
              <span class="text-xs font-bold text-slate-400">{{ pub.ueCode }}</span>
            </div>
            <h3 class="font-extrabold text-slate-900 text-sm">{{ pub.ueName }}</h3>
            <p class="text-xs text-slate-500">{{ pub.commentaire }}</p>
          </div>
          <button @click="telechargerPdf(pub)" class="px-5 py-3 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-extrabold uppercase tracking-widest cursor-pointer transition-all shadow-md">
            Télécharger le PDF
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { 
  mockAnneesAcademiques, 
  mockFilieres, 
  mockSpecialites, 
  mockNiveauxSemestres, 
  mockUes, 
  mockPublications 
} from '@/data/mockData.js'

// État des filtres utilisateur
const filters = reactive({
  annee: '2025-2026',
  filiere: 'STID',
  niveau: 'L2',
  specialite: 'ARCHI',
  semestre: 'S3'
})

// Spécialités filtrées dynamiquement selon la filière sélectionnée
const availableSpecialites = computed(() => {
  return mockSpecialites.filter(s => s.filiere === filters.filiere)
})

// Semestres disponibles selon le niveau (L1 -> S1/S2, L2 -> S3/S4, L3 -> S5/S6)
const availableSemestres = computed(() => {
  return mockNiveauxSemestres[filters.niveau] || []
})

// Réinitialisations automatiques lors des changements majeurs
const onFiliereChange = () => {
  if (filters.filiere === 'SG') {
    filters.specialite = ''
  }
}

const onNiveauChange = () => {
  if (filters.niveau === 'L1') {
    filters.specialite = ''
  }
  // Mettre à jour automatiquement le premier semestre du niveau choisi
  const semestres = mockNiveauxSemestres[filters.niveau]
  if (semestres && semestres.length > 0) {
    filters.semestre = semestres[0]
  }
}

// Filtrage des UE et des publications correspondantes
const filteredPublications = computed(() => {
  // Trouver les UE correspondant aux filtres
  const uesCorrespondantes = mockUes.filter(ue => {
    const matchAnnee = ue.annee === filters.annee
    const matchFiliere = ue.filiere === filters.filiere
    const matchNiveau = ue.niveau === filters.niveau
    const matchSemestre = ue.semestre === filters.semestre
    const matchSpecialite = (filters.niveau === 'L1' || filters.filiere === 'SG') ? true : ue.specialite === filters.specialite
    
    return matchAnnee && matchFiliere && matchNiveau && matchSemestre && matchSpecialite
  })

  const ueIds = uesCorrespondantes.map(u => u.id)

  // Renvoyer les publications actives liées à ces UE
  return mockPublications.filter(pub => ueIds.includes(pub.ueId) && pub.actif)
})

const telechargerPdf = (pub) => {
  alert(`Simulation de téléchargement du fichier : ${pub.nomFichier}`)
}
</script>