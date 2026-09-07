import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import AdminView from '../views/AdminView.vue'
import SelectionAnnee from '../components/SelectionAnnee.vue'
import SelectionFiliere from '../components/SelectionFiliere.vue'
import SelectionNiveau from '../components/SelectionNiveau.vue'
import SelectionSpecialite from '../components/SelectionSpecialite.vue'
import SelectionSemestre from '../components/SelectionSemestre.vue'
import UesView from '../views/UesView.vue'
import UeDetailView from '../views/UeDetailView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/recherche', name: 'search', component: SearchView },
  { path: '/consultation', name: 'consultation', component: SelectionAnnee },
  { path: '/filieres', name: 'filieres', component: SelectionFiliere },
  { path: '/niveaux', name: 'niveaux', component: SelectionNiveau },
  { path: '/specialites', name: 'specialites', component: SelectionSpecialite },
  { path: '/semestres', name: 'semestres', component: SelectionSemestre },
  { path: '/ues', name: 'ues', component: UesView },
  { path: '/ues/documents', name: 'ue-detail', component: UeDetailView },
  { path: '/admin', name: 'admin', component: AdminView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
