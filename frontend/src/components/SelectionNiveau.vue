<template>
  <div class="space-y-12 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
    
    <!-- En-tête -->
    <section class="relative overflow-hidden bg-gradient-to-tr from-emerald-950 via-teal-800 to-amber-600 bg-[length:200%_200%] animate-gradient-move text-white py-12 md:py-16 shadow-xl w-full max-w-6xl mx-auto sm:rounded-3xl text-center px-6">
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.4)_2px,transparent_2px)] bg-[size:32px_32px] animate-dots-blink pointer-events-none"></div>
      
      <div class="relative z-10 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-200 text-xs font-bold tracking-wide shadow-sm">
          <span>Étape 3 sur l'arborescence</span>
          <span class="text-white/60">•</span>
          <span class="uppercase bg-white/10 px-2 py-0.5 rounded-md text-[11px]">{{ currentFiliere }}</span>
        </div>
        <BreadcrumbNav />
        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Sélectionnez le niveau d'études
        </h1>
        <p class="text-white/90 text-xs sm:text-sm max-w-lg leading-relaxed">
          Veuillez choisir votre année d'études pour la filière <strong class="text-white font-bold">{{ currentFiliere }}</strong> au titre de l'année académique <strong class="text-amber-200 font-bold">{{ currentYear }}</strong>.
        </p>
      </div>
    </section>

    <!-- Grille des niveaux (Licence 1, Licence 2, Licence 3) -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div 
          v-for="niveau in niveauxList" 
          :key="niveau.code"
          @click="selectNiveau(niveau.code)"
          class="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 hover:border-emerald-600 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden text-center"
        >
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/50 to-emerald-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

          <div class="space-y-4 relative z-10 py-3">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-900 font-extrabold text-sm tracking-tight flex items-center justify-center border border-emerald-200 group-hover:bg-emerald-800 group-hover:text-white transition-colors duration-300 shadow-sm uppercase">
              {{ niveau.code }}
            </div>
            <div class="space-y-1.5">
              <h2 class="text-base font-bold text-slate-900 group-hover:text-emerald-900 transition-colors">
                {{ niveau.name }}
              </h2>
              <p class="text-[11px] text-slate-600 leading-normal px-2">
                {{ niveau.description }}
              </p>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform duration-300 relative z-10 flex items-center justify-center gap-1.5">
            <span>Accéder au niveau</span>
            <span>→</span>
          </div>
        </div>
      </div>

      <!-- Bouton Retour amélioré et épuré -->
      <div class="mt-10 text-center">
        <router-link 
          :to="{ name: 'filieres', query: { annee: currentYear } }" 
          class="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-emerald-900 text-xs font-bold shadow-sm hover:shadow transition-all duration-200 group"
        >
          <svg class="w-4 h-4 text-emerald-800 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Retour au choix de la filière</span>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script setup>
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentYear = computed(() => route.query.annee || '2025-2026')
const currentFiliere = computed(() => route.query.filiere || 'AG')

const niveauxList = ref([
  { code: 'L1', name: 'Licence 1', description: 'Semestres 1 & 2 (Tronc commun)' },
  { code: 'L2', name: 'Licence 2', description: 'Semestres 3 & 4 (Choix des spécialités)' },
  { code: 'L3', name: 'Licence 3', description: 'Semestres 5 & 6 (Spécialisation & Stage)' }
])

const selectNiveau = (niveauCode) => {
  const filiere = currentFiliere.value

  if (niveauCode === 'L1' || filiere === 'SG') {
    router.push({ 
      name: 'semestres', 
      query: { annee: currentYear.value, filiere: filiere, niveau: niveauCode } 
    })
  } else {
    router.push({ 
      name: 'specialites', 
      query: { annee: currentYear.value, filiere: filiere, niveau: niveauCode } 
    })
  }
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