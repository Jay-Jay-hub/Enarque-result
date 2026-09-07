<template>
  <div class="space-y-3">
    <label class="text-xs font-bold text-slate-700 block">Sélectionnez l'Unité d'Enseignement (UE) :</label>
    <div v-if="loading" class="text-xs text-slate-400 italic">Chargement des UEs...</div>
    <div v-else-if="ues.length === 0" class="text-xs text-amber-600 font-medium">Aucune UE disponible pour ce semestre.</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <button 
        v-for="ue in ues" 
        :key="ue.id"
        @click="$emit('select', ue)"
        :class="[
          'p-3.5 rounded-xl border text-left text-xs font-bold transition-all duration-300 cursor-pointer flex items-center justify-between',
          selectedUeId === ue.id 
            ? 'bg-emerald-900 border-emerald-900 text-white shadow-md' 
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200'
        ]"
      >
        <span>{{ ue.code }} - {{ ue.nom }}</span>
        <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100/20 text-emerald-300">{{ ue.credits }} crédits</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { API_URL, BASE_URL } from '../config.js'

const props = defineProps({
  anneeId: { type: Number, required: true },
  filiereId: { type: Number, required: true },
  specialiteId: { type: Number, default: null },
  semestreId: { type: Number, required: true },
  selectedUeId: { type: Number, default: null }
})

const emit = defineEmits(['select'])
const ues = ref([])
const loading = ref(false)

const fetchUes = async () => {
  if (!props.semestreId || !props.anneeId || !props.filiereId) return
  loading.value = true
  try {
    const params = {
      annee_id: props.anneeId,
      filiere_id: props.filiereId,
      semestre_id: props.semestreId
    }
    if (props.specialiteId) params.specialite_id = props.specialiteId

    const response = await axios.get(`${API_URL}/ues`, { params })
    ues.value = response.data
  } catch (error) {
    console.error("Erreur lors de la récupération des UEs:", error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUes)
watch(() => [props.anneeId, props.filiereId, props.specialiteId, props.semestreId], fetchUes)
</script>