
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Masque le footer si l'URL commence par /admin
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const currentYear = computed(() => new Date().getFullYear())

// Coordonnées des concepteurs
const designers = [
  {
    name: 'Thomas DEFODJI',
    whatsapp: '2290147031558',
    email: 'thomasdefodji793@gmail.com'
  },
  {
    name: 'Fréjus DAGBA',
    whatsapp: '2290140141063',
    email: 'frejusdagba07@gmail.com'
  }
]
</script>

<template>
  <footer 
    v-if="!isAdminRoute" 
    class="relative w-full bg-emerald-950/85 backdrop-blur-xl border-t border-white/10 text-white mt-auto shadow-2xl font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden"
  >
    <!-- Effet de lueur subtil en haut du footer -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"></div>
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-800/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
      <!-- Section Supérieure : Grille adaptative -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 items-center md:items-start text-center md:text-left">
        
        <!-- Bloc 1 : Marque & Description -->
        <div class="md:col-span-4 flex flex-col items-center md:items-start gap-4">
          <div class="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-[0_0_15px_rgba(251,191,36,0.1)] group hover:bg-white/10 transition-all duration-300 cursor-default">
            <span class="text-amber-300 font-bold tracking-widest text-xs sm:text-sm">
              ENARQUE RESULT
            </span>
          </div>
          <p class="text-emerald-100/70 text-sm leading-relaxed max-w-xs">
            Plateforme d'Archivage et de Consultation des Résultats de l'École Nationale d'Administration.
          </p>
        </div>

        <!-- Bloc 2 : Mandature & Parrainage -->
        <div class="md:col-span-4 flex flex-col items-center gap-3">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-300/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <span class="text-white font-semibold tracking-wide text-sm">BUE ENA — 2026-2027</span>
          </div>
          <div class="px-4 py-2 rounded-xl bg-emerald-900/40 border border-emerald-800/50">
            <span class="text-emerald-200/80 text-xs">
              Sous le haut parrainage de <br class="hidden sm:block md:hidden">
              <span class="font-bold text-amber-100">Alex HOUNSOUNOU</span>
            </span>
          </div>
        </div>

        <!-- Bloc 3 : Concepteurs -->
        <div class="md:col-span-4 flex flex-col items-center md:items-end gap-4">
          <span class="text-emerald-500/80 font-bold uppercase tracking-widest text-[10px]">L'Équipe Technique</span>
          <div class="flex flex-col gap-3 w-full max-w-[240px] md:max-w-none md:w-auto">
            <div 
              v-for="designer in designers" 
              :key="designer.name"
              class="group flex items-center justify-between gap-4 bg-emerald-900/20 hover:bg-emerald-800/40 border border-emerald-800/50 hover:border-emerald-600/50 rounded-xl px-4 py-2 transition-all duration-300 hover:-translate-y-0.5"
            >
              <span class="text-emerald-50 text-sm font-medium">{{ designer.name }}</span>
              <div class="flex items-center gap-2.5">
                <a 
                  :href="`https://wa.me/${designer.whatsapp}`" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="p-1.5 rounded-lg bg-emerald-950/50 text-emerald-400 hover:text-white hover:bg-emerald-600 transition-colors"
                  :title="`WhatsApp ${designer.name}`"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.35-.375.523-.562.174-.188.233-.317.35-.53.116-.213.058-.406-.03-.55-.089-.145-.792-1.914-1.089-2.617-.297-.703-.6-.606-.822-.618-.213-.011-.457-.013-.7-.013-.246 0-.646.093-.984.462-.34.37-1.29 1.263-1.29 3.08 0 1.817 1.32 3.573 1.505 3.822.187.248 2.559 3.897 6.198 5.311 3.639 1.414 3.639.944 4.297.884.657-.06 2.13-.873 2.43-1.719.298-.844.298-1.567.209-1.719-.088-.152-.34-.224-.717-.375z"/>
                    <path d="M12.001 2C6.478 2 2 6.477 2 12c0 2.108.65 4.063 1.762 5.68L2.05 22l4.436-1.696A9.955 9.955 0 0012.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.15a8.14 8.14 0 01-4.15-1.135l-.297-.176-3.09 1.183.996-2.911-.192-.298A8.126 8.126 0 013.85 12c0-4.494 3.657-8.15 8.151-8.15 4.494 0 8.15 3.656 8.15 8.15 0 4.494-3.656 8.15-8.15 8.15z"/>
                  </svg>
                </a>
                <a 
                  :href="`mailto:${designer.email}`"
                  class="p-1.5 rounded-lg bg-emerald-950/50 text-emerald-400 hover:text-white hover:bg-emerald-600 transition-colors"
                  :title="`Email ${designer.name}`"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Ligne de séparation -->
      <div class="my-8 h-px w-full bg-gradient-to-r from-transparent via-emerald-800/60 to-transparent"></div>

      <!-- Section Inférieure : Copyright & Icône discrète -->
      <div class="flex justify-center items-center text-xs pb-2">
        <p class="text-emerald-300/60 font-medium flex items-center justify-center gap-1.5">
          &copy; {{ currentYear }} Université d'Abomey-Calavi. Tous droits réservés.
          
          <!-- Icône ultra-discrète sans aucun attribut textuel / infobulle -->
          <router-link 
            to="/admin" 
            class="inline-flex items-center text-emerald-100/15 hover:text-emerald-200/40 transition-colors duration-300 ml-1"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </router-link>
        </p>
      </div>

    </div>
  </footer>
</template>

