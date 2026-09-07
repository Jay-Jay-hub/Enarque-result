<template>
  <div class="space-y-12 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- Hero Section optimisée et compacte, centrée -->
    <section class="relative overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-800 to-amber-600 bg-[length:200%_200%] animate-gradient-move text-white py-14 md:py-20 shadow-xl w-full max-w-6xl mx-auto sm:rounded-3xl text-center">
      
      <!-- Motif de points scintillants (clignotants) -->
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_2px,transparent_2px)] bg-[size:32px_32px] animate-dots-blink pointer-events-none"></div>

      <!-- Lueurs d'ambiance -->
      <div class="absolute -right-20 -top-20 w-80 h-80 bg-amber-400/25 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      
      <!-- Conteneur interne centré -->
      <div class="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 space-y-6 flex flex-col items-center">
        
        <!-- Badge institutionnel -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-200 text-xs font-semibold tracking-wide shadow-xs">
          <span class="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
          <span>BUE-ENA</span>
        </div>

        <!-- Titre principal -->
        <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Enarque result, la mémoire académique officielle
        </h1>
        
        <!-- Description centrée -->
        <p class="text-white/95 text-sm md:text-base font-normal leading-relaxed max-w-xl">
          Plateforme officielle de conservation, d'organisation et de consultation des résultats académiques au fil des années.
        </p>

        <!-- Bouton d'action principal redirigeant vers la recherche -->
        <div class="pt-1">
          <router-link 
            to="/recherche" 
            class="px-6 py-3 rounded-xl bg-amber-300 hover:bg-amber-400 text-slate-900 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center gap-2 group"
          >
            <span>Rechercher un document</span>
            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>

      </div>
    </section>

    <!-- Conteneur centralisé pour les cartes principales -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      <!-- Grille des Parcours -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Carte 1: Recherche Globale -->
        <div class="bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-base border border-emerald-200 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
              01
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900 tracking-tight">Recherche Rapide</h2>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 font-normal">
                Trouvez instantanément vos procès-verbaux et archives grâce à notre outil de recherche globale par mots-clés et filtres.
              </p>
            </div>
          </div>

          <router-link 
            to="/recherche" 
            class="mt-8 w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl text-center transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-center gap-2 uppercase tracking-wider group/btn"
          >
            <span>Accéder à la recherche</span>
            <span class="transform group-hover/btn:translate-x-1 transition-transform duration-200">&rarr;</span>
          </router-link>
        </div>

        <!-- Carte 2: Consultation Étape par Étape -->
        <div class="bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-base border border-emerald-200 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300">
              02
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900 tracking-tight">Procédure Guidée</h2>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 font-normal">
                Parcourez l'arborescence pas à pas selon la structure classique : <strong>Année &rarr; Filière &rarr; Spécialité</strong>.
              </p>
            </div>
          </div>

          <router-link 
            to="/consultation" 
            class="mt-8 w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl text-center transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-center gap-2 uppercase tracking-wider group/btn"
          >
            <span>Commencer par l'année</span>
            <span class="transform group-hover/btn:translate-x-1 transition-transform duration-200">&rarr;</span>
          </router-link>
        </div>

      </section>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
const openFaqIndex = ref(null)
const toggleFaq = (index) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
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