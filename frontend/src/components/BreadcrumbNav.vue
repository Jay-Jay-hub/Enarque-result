<template>
  <div class="flex flex-wrap items-center gap-2 text-xs font-semibold">
    <template v-for="(crumb, index) in crumbs" :key="crumb.key">
      <router-link
        v-if="!crumb.isCurrent"
        :to="{ name: crumb.routeName, query: crumb.query }"
        class="bg-white/10 hover:bg-white/25 px-3 py-1 rounded-lg border border-white/20 text-white/90 hover:text-white transition-all cursor-pointer"
      >
        {{ crumb.label }}
      </router-link>
      <span
        v-else
        class="bg-emerald-700 text-white px-3 py-1 rounded-lg font-bold"
      >
        {{ crumb.label }}
      </span>
      <span v-if="index < crumbs.length - 1" class="text-white/40">/</span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Ordre fixe des étapes du parcours, avec la route qui permet de revenir
// choisir/modifier cette étape précisément.
const stepDefinitions = [
  { key: 'annee', routeName: 'consultation', paramsKeys: [] },
  { key: 'filiere', routeName: 'filieres', paramsKeys: ['annee'] },
  { key: 'niveau', routeName: 'niveaux', paramsKeys: ['annee', 'filiere'] },
  { key: 'specialite', routeName: 'specialites', paramsKeys: ['annee', 'filiere', 'niveau'] },
  { key: 'semestre', routeName: 'semestres', paramsKeys: ['annee', 'filiere', 'niveau', 'specialite'] },
  { key: 'ueCode', routeName: 'ues', paramsKeys: ['annee', 'filiere', 'niveau', 'specialite', 'semestre'] }
]

const crumbs = computed(() => {
  const query = route.query
  const result = []

  stepDefinitions.forEach((step) => {
    const value = query[step.key]
    // On n'affiche pas l'étape "spécialité" si elle n'a jamais été choisie
    // (cas Licence 1 ou filière sans spécialité).
    if (!value) return

    const crumbQuery = {}
    step.paramsKeys.forEach((paramKey) => {
      if (query[paramKey]) crumbQuery[paramKey] = query[paramKey]
    })

    result.push({
      key: step.key,
      label: value,
      routeName: step.routeName,
      query: crumbQuery,
      isCurrent: false
    })
  })

  // La dernière miette correspond toujours à la page actuellement affichée.
  if (result.length > 0) {
    result[result.length - 1].isCurrent = true
  }

  return result
})
</script>
