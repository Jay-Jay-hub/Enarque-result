import { ref, watch } from 'vue'

// Initialisation par défaut si le localStorage est vide
const initialAnnees = [
  { id: 1, libelle: '2024-2025' },
  { id: 2, libelle: '2025-2026' },
  { id: 3, libelle: '2026-2027' }
]

const initialFilieres = [
  { code: 'AF', nom: 'Administration des finances' },
  { code: 'AG', nom: 'Administration générale' },
  { code: 'SG', nom: 'Secrétariat de gestion' },
  { code: 'STID', nom: "Sciences et techniques de l'information documentaire" }
]

const initialSpecialites = [
  { code: 'AI', nom: 'Administration des impôts', filiere: 'AF', niveau: 'L2' },
  { code: 'AFT', nom: 'Administration des finances et trésors', filiere: 'AF', niveau: 'L2' },
  { code: 'AHUI', nom: "Administration hospitalière, universitaire et intendance", filiere: 'AF', niveau: 'L2' },
  { code: 'GMP', nom: 'Gestion des marchés publics', filiere: 'AF', niveau: 'L2' },
  { code: 'AGT', nom: 'Administration générale et territoriale', filiere: 'AG', niveau: 'L2' },
  { code: 'ATSS', nom: 'Administration du travail et de la sécurité sociale', filiere: 'AG', niveau: 'L2' },
  { code: 'DRI', nom: 'Diplomatie et relations internationales', filiere: 'AG', niveau: 'L2' },
  { code: 'ARCHI', nom: 'Archivistique', filiere: 'STID', niveau: 'L2' },
  { code: 'BIDOC', nom: 'Bibliothéconomie et documentation', filiere: 'STID', niveau: 'L2' }
]

const initialSessions = [
  { id: 1, annee: '2025-2026', libelle: 'Session Normale' },
  { id: 2, annee: '2025-2026', libelle: 'Session de Reprise' }
]

const initialNiveauxSemestres = {
  L1: ['S1', 'S2'],
  L2: ['S3', 'S4'],
  L3: ['S5', 'S6']
}

const initialUes = [
  { id: 1, annee: '2025-2026', filiere: 'STID', specialite: 'ARCHI', niveau: 'L2', semestre: 'S3', code: 'ARCH201', nom: 'Traitement des archives anciennes' },
  { id: 2, annee: '2025-2026', filiere: 'AF', specialite: 'AI', niveau: 'L3', semestre: 'S5', code: 'FIN301', nom: 'Fiscalité internationale' }
]

const initialPublications = [
  { id: 1, ueId: 1, ueCode: 'ARCH201', ueName: 'Traitement des archives anciennes', session: 'Normale', nomFichier: 'resultats_arch201_v1.pdf', version: 1, actif: true, commentaire: 'Publication initiale' },
  { id: 2, ueId: 1, ueCode: 'ARCH201', ueName: 'Traitement des archives anciennes', session: 'Normale', nomFichier: 'resultats_arch201_v2.pdf', version: 2, actif: false, commentaire: 'Correction de notes suite aux réclamations' }
]

// Helpers LocalStorage
const getStorage = (key, initial) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : initial
}

const setStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

// Exports réactifs basés sur le localStorage
export const mockAnneesAcademiques = ref(getStorage('ena_annees', initialAnnees))
export const mockSessions = ref(getStorage('ena_sessions', initialSessions))
export const mockFilieres = ref(getStorage('ena_filieres', initialFilieres))
export const mockSpecialites = ref(getStorage('ena_specialites', initialSpecialites).map(specialite => ({
  ...specialite,
  niveau: specialite.niveau || 'L2'
})))
export const mockNiveauxSemestres = initialNiveauxSemestres
export const mockUes = ref(getStorage('ena_ues', initialUes))
export const mockPublications = ref(getStorage('ena_publications', initialPublications))

// Fonction de sauvegarde globale élargie à toutes les entités
export const saveToStorage = () => {
  setStorage('ena_annees', mockAnneesAcademiques.value)
  setStorage('ena_sessions', mockSessions.value)
  setStorage('ena_filieres', mockFilieres.value)
  setStorage('ena_specialites', mockSpecialites.value)
  setStorage('ena_ues', mockUes.value)
  setStorage('ena_publications', mockPublications.value)
}

// Watchers automatiques pour synchroniser et sauvegarder dès qu'une modification survient
watch(mockAnneesAcademiques, () => saveToStorage(), { deep: true })
watch(mockSessions, () => saveToStorage(), { deep: true })
watch(mockFilieres, () => saveToStorage(), { deep: true })
watch(mockSpecialites, () => saveToStorage(), { deep: true })
watch(mockUes, () => saveToStorage(), { deep: true })
watch(mockPublications, () => saveToStorage(), { deep: true })

// Écoute des modifications inter-onglets (Multi-onglets)
window.addEventListener('storage', (event) => {
  if (event.key === 'ena_ues') {
    mockUes.value = event.newValue ? JSON.parse(event.newValue) : []
  }
  if (event.key === 'ena_publications') {
    mockPublications.value = event.newValue ? JSON.parse(event.newValue) : []
  }
  if (event.key === 'ena_annees') {
    mockAnneesAcademiques.value = event.newValue ? JSON.parse(event.newValue) : []
  }
  if (event.key === 'ena_sessions') {
    mockSessions.value = event.newValue ? JSON.parse(event.newValue) : []
  }
  if (event.key === 'ena_filieres') {
    mockFilieres.value = event.newValue ? JSON.parse(event.newValue) : []
  }
  if (event.key === 'ena_specialites') {
    mockSpecialites.value = event.newValue ? JSON.parse(event.newValue) : []
  }
})