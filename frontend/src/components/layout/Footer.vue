<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Masque le footer si l'URL commence par /admin
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const currentYear = computed(() => new Date().getFullYear())

// Coordonnées des concepteurs (à adapter avec les vrais numéros/emails)
const designers = [
  {
    name: 'Thomas DEFODJI',
    whatsapp: '2290147031558', // format international sans "+"
    email: 'thomasdefodji793@gmail.com'
  },
  {
    name: 'Fréjus DAGBA',
    whatsapp: '2290140141063', // format international sans "+"
    email: 'frejus.dagba@example.com'
  }
]
</script>

<template>
  <footer v-if="!isAdminRoute" class="w-full bg-emerald-950 border-t border-emerald-900/60 text-white py-8 mt-auto shadow-inner font-['Plus_Jakarta_Sans',sans-serif]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6 text-xs">

      <!-- Ligne principale existante -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3 text-center md:text-left">
          <div class="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-amber-300 tracking-wider shadow-xs font-bold">
            ENARQUE RESULT / BUE-ENA
          </div>
          <span class="hidden md:inline text-emerald-700">|</span>
          <span class="text-emerald-100/90 font-medium">Plateforme d'Archivage et de Consultation des Résultats</span>
        </div>

        <div class="text-emerald-200/70 text-center md:text-right font-normal flex items-center gap-3">
          <span>&copy; {{ currentYear }} BUE-ENA (Université d'Abomey-Calavi). Tous droits réservés.</span>
          <router-link to="/admin" title="Espace administrateur" class="text-amber-200/40 hover:text-amber-300 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </router-link>
        </div>
      </div>

      <!-- Ligne mandature / parrainage / concepteurs -->
      <div class="border-t border-emerald-900/60 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">

        <div class="flex flex-col gap-1">
          <span class="text-amber-300 font-bold tracking-wide">BUE ENA — Mandature 2026-2027</span>
          <span class="text-emerald-100/80">
            Sous le haut parrainage du président <span class="font-semibold text-white">Alex HOUNSOUNOU</span>
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-emerald-100/70 font-semibold uppercase tracking-wider text-[10px]">Conçu par</span>
          <div class="flex flex-col sm:flex-row gap-3">
            <div
              v-for="designer in designers"
              :key="designer.name"
              class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5"
            >
              <span class="text-emerald-100 font-medium">{{ designer.name }}</span>
              <a
                :href="`https://wa.me/${designer.whatsapp}`"
                target="_blank"
                rel="noopener noreferrer"
                :title="`WhatsApp ${designer.name}`"
                class="text-emerald-300 hover:text-emerald-400 transition-colors"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.149-.15.35-.375.523-.562.174-.188.233-.317.35-.53.116-.213.058-.406-.03-.55-.089-.145-.792-1.914-1.089-2.617-.297-.703-.6-.606-.822-.618-.213-.011-.457-.013-.7-.013-.246 0-.646.093-.984.462-.34.37-1.29 1.263-1.29 3.08 0 1.817 1.32 3.573 1.505 3.822.187.248 2.559 3.897 6.198 5.311 3.639 1.414 3.639.944 4.297.884.657-.06 2.13-.873 2.43-1.719.298-.844.298-1.567.209-1.719-.088-.152-.34-.224-.717-.375z"/>
                  <path d="M12.001 2C6.478 2 2 6.477 2 12c0 2.108.65 4.063 1.762 5.68L2.05 22l4.436-1.696A9.955 9.955 0 0012.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.15a8.14 8.14 0 01-4.15-1.135l-.297-.176-3.09 1.183.996-2.911-.192-.298A8.126 8.126 0 013.85 12c0-4.494 3.657-8.15 8.151-8.15 4.494 0 8.15 3.656 8.15 8.15 0 4.494-3.656 8.15-8.15 8.15z"/>
                </svg>
              </a>
              <a
                :href="`mailto:${designer.email}`"
                :title="`Email ${designer.name}`"
                class="text-emerald-300 hover:text-emerald-400 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  </footer>
</template>
