<template>
  <div class="min-h-screen w-full bg-slate-100 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col overflow-x-hidden">
    
    <!-- ÉCRAN DE CONNEXION ADMIN -->
    <div v-if="!isAuthenticated" class="fixed inset-0 w-full min-h-screen overflow-y-auto bg-transparent flex items-start sm:items-center justify-center p-3 sm:p-6 z-50">
      <div class="max-w-md w-full max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] overflow-y-auto bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl space-y-5 sm:space-y-6 text-center">
        <div class="inline-flex p-2.5 sm:p-3 rounded-2xl bg-emerald-50 text-emerald-800 mb-1">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        </div>
        <div class="space-y-2">
          <h1 class="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight break-words">Administration ENARQUE</h1>
          <p class="text-xs text-slate-500">Connexion sécurisée</p>
        </div>
        <form @submit.prevent="login" class="space-y-4 text-left">
          <div>
            <label class="text-xs font-bold text-slate-700 block mb-1">Adresse email :</label>
            <input type="email" v-model="emailInput" required autocomplete="username" class="w-full min-h-12 p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm sm:text-xs focus:bg-white focus:ring-2 focus:ring-emerald-800 outline-none" placeholder="admin@enarque.local" />
          </div>
          <div>
            <label class="text-xs font-bold text-slate-700 block mb-1">Mot de passe :</label>
            <input type="password" v-model="passwordInput" required autocomplete="current-password" class="w-full min-h-12 p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm sm:text-xs focus:bg-white focus:ring-2 focus:ring-emerald-800 outline-none" placeholder="Mot de passe (ex: ena2026)" />
          </div>
          <button type="submit" class="w-full min-h-12 px-4 py-3 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer">
            Se connecter
          </button>
        </form>
        <p v-if="loginError" class="text-xs font-bold text-rose-600">{{ loginError }}</p>
      </div>
    </div>

    <!-- DASHBOARD ADMINISTRATIF PLEIN ÉCRAN -->
    <template v-else>
      
      <!-- TOPBAR DÉDIÉE ADMIN -->
      <header class="w-full min-h-20 bg-slate-900 text-white px-4 sm:px-6 py-4 flex justify-between items-center border-b border-slate-800 shrink-0 sticky top-0 z-50">
        <div class="min-w-0 flex items-center gap-3">
          <span class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase">
            Admin
          </span>
          <h2 class="truncate text-sm sm:text-base font-extrabold tracking-tight">BUE-ENA</h2>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer" :aria-expanded="mobileMenuOpen" aria-label="Ouvrir le menu">
            <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M6 18L18 6"/></svg>
          </button>
          <button @click="isAuthenticated = false" class="hidden md:inline-flex px-3 sm:px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer">
            Déconnexion
          </button>
        </div>
      </header>

      <!-- LAYOUT PRINCIPAL (Sidebar + Contenu) -->
      <div class="flex-1 flex flex-col md:flex-row w-full overflow-hidden">
        
        <!-- SIDEBAR DE NAVIGATION -->
        <aside :class="['w-full md:w-72 bg-slate-900/95 text-white p-4 sm:p-6 flex-col justify-between border-t md:border-t-0 md:border-r border-slate-800 shrink-0', mobileMenuOpen ? 'flex' : 'hidden md:flex']">
          <div class="space-y-4 w-full">
            <span class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider hidden md:block">Navigation</span>
            <nav class="flex flex-col gap-1.5 w-full">
              <button 
                v-for="tab in adminTabs" 
                :key="tab.id"
                @click="activeTab = tab.id; mobileMenuOpen = false"
                :class="[
                  'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left',
                  activeTab === tab.id ? 'bg-emerald-800 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                ]"
              >
                <span>{{ tab.label }}</span>
              </button>
              <button @click="isAuthenticated = false; mobileMenuOpen = false" class="md:hidden w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold text-left transition-all cursor-pointer">
                <span>Déconnexion</span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- CONTENU DYNAMIQUE DE LA PAGE -->
        <main class="flex-1 min-h-[calc(100vh-73px)] p-4 sm:p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto overflow-y-auto">
          
          <!-- EN-TÊTE DE SECTION -->
          <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 class="text-base sm:text-xl font-extrabold text-slate-900">{{ currentTabTitle }}</h1>
              <p class="text-xs text-slate-500">Gestion complète des structures académiques, des années et des publications.</p>
            </div>
            <span class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              Mode Interactif Actif
            </span>
          </div>
          <p v-if="operationError" class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700">
            {{ operationError }}
          </p>

          <!-- 1. TABLEAU DE BORD -->
          <section v-if="activeTab === 'dashboard'" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span class="text-xs font-bold text-slate-400 uppercase">Années Académiques</span>
                <p class="text-2xl font-extrabold text-slate-900">{{ mockAnneesAcademiques.length }}</p>
              </div>
              <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span class="text-xs font-bold text-slate-400 uppercase">Filières / Spécialités</span>
                <p class="text-2xl font-extrabold text-emerald-800">{{ mockFilieres.length }} Filières</p>
              </div>
              <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span class="text-xs font-bold text-slate-400 uppercase">Total UEs Enregistrées</span>
                <p class="text-2xl font-extrabold text-slate-900">{{ mockUes.length }}</p>
              </div>
              <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span class="text-xs font-bold text-slate-400 uppercase">Publications Actives</span>
                <p class="text-2xl font-extrabold text-teal-800">{{ mockPublications.filter(p => p.actif).length }}</p>
              </div>
            </div>
          </section>

          <!-- 2. GESTION DES ANNÉES ACADÉMIQUES -->
          <section v-if="activeTab === 'sessions'" class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="text-xs font-extrabold text-slate-900 uppercase">Ajouter une Année Académique</h3>
              <p class="text-[11px] text-slate-500">
                Les sessions (Normale / Rattrapage) sont fixes et communes à toutes les années — il n'y a rien à configurer pour elles.
              </p>
              <form @submit.prevent="ajouterAnnee" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                  <label class="text-xs font-bold text-slate-700 block mb-1">Année académique :</label>
                  <input type="text" v-model="anneeForm.libelle" placeholder="ex: 2027-2028" required class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none" />
                </div>
                <div class="flex items-end">
                  <button type="submit" class="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase cursor-pointer transition-all">Ajouter l'Année</button>
                </div>
              </form>
            </div>
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
              <table class="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr class="border-b border-slate-200 text-xs text-slate-400 uppercase">
                    <th class="py-3 px-4">Année Académique</th>
                    <th class="py-3 px-4">Statut</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-xs text-slate-700 divide-y divide-slate-100">
                  <tr v-for="a in mockAnneesAcademiques" :key="a.id">
                    <td class="py-3 px-4 font-extrabold text-slate-900">{{ a.libelle }}</td>
                    <td class="py-3 px-4"><span class="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold">Ouverte</span></td>
                    <td class="py-3 px-4 text-right">
                      <button @click="supprimerAnnee(a.id)" class="text-rose-600 font-bold hover:underline cursor-pointer">Supprimer</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 3. FILIÈRES & SPÉCIALITÉS (Interactif par Niveau) -->
          <section v-if="activeTab === 'filieres'" class="space-y-6">
            <!-- Formulaire d'ajout de spécialité -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="text-xs font-extrabold text-slate-900 uppercase">Ajouter une Spécialité à une Filière</h3>
              <form @submit.prevent="ajouterSpecialite" class="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Filière ciblée :</label>
                  <select v-model="specialiteForm.filiereCode" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                    <option v-for="f in mockFilieres" :key="f.code" :value="f.code">{{ f.nom }} ({{ f.code }})</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Niveau minimal :</label>
                  <select v-model="specialiteForm.niveau" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                    <option value="L2">Licence 2 (L2)</option>
                    <option value="L3">Licence 3 (L3)</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Code :</label>
                  <input type="text" v-model="specialiteForm.code" placeholder="ex: ARCHI" required maxlength="10" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none" />
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Nom complet :</label>
                  <input type="text" v-model="specialiteForm.nom" placeholder="ex: Archivistique" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none" />
                </div>
                <div class="flex items-end">
                  <button type="submit" class="w-full py-2.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold uppercase cursor-pointer">Ajouter</button>
                </div>
              </form>
            </div>

            <!-- Affichage par filière et par niveau -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="f in mockFilieres" :key="f.code" class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div class="flex justify-between items-center border-b pb-3">
                  <h4 class="font-extrabold text-slate-900 text-sm">{{ f.nom }} <span class="text-emerald-800">({{ f.code }})</span></h4>
                </div>
                <div class="space-y-3">
                  <div v-for="niv in ['L1', 'L2', 'L3']" :key="niv" class="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <span class="text-[10px] font-extrabold uppercase text-slate-400">Niveau {{ niv }}</span>
                    <ul class="space-y-1">
                      <template v-if="niv === 'L1'">
                        <li class="text-xs text-slate-500 italic">Tronc commun (Pas de spécialité)</li>
                      </template>
                      <template v-else>
                        <li v-for="s in mockSpecialites.filter(s => s.filiere === f.code && niveauRang(s.niveau) <= niveauRang(niv))" :key="s.code" class="flex justify-between items-center text-xs py-1">
                          <span class="font-bold text-slate-700">{{ s.code }} - {{ s.nom }} <span v-if="s.niveau !== niv" class="text-slate-400 font-normal">(depuis {{ s.niveau }})</span></span>
                          <button v-if="s.niveau === niv" @click="supprimerSpecialite(s.code)" class="text-rose-600 font-bold hover:underline cursor-pointer">Supprimer</button>
                        </li>
                        <li v-if="mockSpecialites.filter(s => s.filiere === f.code && niveauRang(s.niveau) <= niveauRang(niv)).length === 0" class="text-xs text-slate-400 italic">
                          Aucune spécialité configurée pour ce niveau.
                        </li>
                      </template>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 4. GESTION DES UE (catalogue fixe, sans année) -->
          <section v-if="activeTab === 'ues'" class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="text-xs font-extrabold text-slate-900 uppercase">Créer ou Associer une UE</h3>
              <p class="text-[11px] text-slate-500">
                Une UE fait partie du catalogue de matières : elle reste valable pour toutes les années académiques.
              </p>
              <form @submit.prevent="ajouterUE" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Filière :</label>
                  <select v-model="ueForm.filiere" @change="onFiliereChange" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                    <option v-for="f in mockFilieres" :key="f.code" :value="f.code">{{ f.nom }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Spécialité :</label>
                  <select v-model="ueForm.specialite" :disabled="!specialitesDisponibles.length" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs disabled:opacity-50 outline-none">
                    <option value="">Aucune / Tronc Commun</option>
                    <option v-for="s in specialitesDisponibles" :key="s.code" :value="s.code">{{ s.nom }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Niveau :</label>
                  <select v-model="ueForm.niveau" @change="onNiveauChange" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                    <option value="L1">Licence 1 (L1)</option>
                    <option value="L2">Licence 2 (L2)</option>
                    <option value="L3">Licence 3 (L3)</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Semestre :</label>
                  <select v-model="ueForm.semestre" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                    <option v-for="sem in semestresDisponibles" :key="sem" :value="sem">{{ sem }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Code UE :</label>
                  <input type="text" v-model="ueForm.code" placeholder="ex: STID101" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none" />
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Nom de l'UE :</label>
                  <input type="text" v-model="ueForm.nom" placeholder="ex: Introduction aux Archives" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none" />
                </div>
                <div class="sm:col-span-3">
                  <button type="submit" class="w-full py-3.5 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-extrabold uppercase tracking-widest cursor-pointer transition-all">
                    Enregistrer l'UE
                  </button>
                </div>
              </form>
            </div>

            <!-- TABLEAU DES UES -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
              <table class="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr class="border-b border-slate-200 text-xs text-slate-400 uppercase">
                    <th class="py-3 px-4">Code & Nom</th>
                    <th class="py-3 px-4">Contexte (Filière / Spécialité)</th>
                    <th class="py-3 px-4">Niveau / Semestre</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="text-xs text-slate-700 divide-y divide-slate-100">
                  <tr v-for="ue in mockUes" :key="ue.id">
                    <td class="py-3 px-4 font-extrabold text-slate-900">{{ ue.code }} - {{ ue.nom }}</td>
                    <td class="py-3 px-4">{{ ue.filiere }} <span v-if="ue.specialite">/ {{ ue.specialite }}</span></td>
                    <td class="py-3 px-4 text-emerald-800 font-bold">{{ ue.niveau }} - {{ ue.semestre }}</td>
                    <td class="py-3 px-4 text-right">
                      <button @click="supprimerUE(ue.id)" class="text-rose-600 font-bold hover:underline cursor-pointer">Supprimer</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 5. PUBLICATIONS & VERSIONS -->
          <section v-if="activeTab === 'publications'" class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="text-xs font-extrabold text-slate-900 uppercase">Publier ou Versionner un Résultat PDF</h3>
              <form @submit.prevent="publierFichier" class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <!-- Filtres en cascade pour retrouver l'UE facilement (catalogue fixe, pas d'année ici) -->
                <div class="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Filière :</label>
                    <select v-model="pubFiltre.filiereId" @change="onFiliereFiltrePubChange" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                      <option :value="null">-- Choisir --</option>
                      <option v-for="f in mockFilieres" :key="f.id" :value="f.id">{{ f.nom }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Niveau :</label>
                    <select v-model="pubFiltre.niveau" @change="onNiveauFiltrePubChange" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                      <option value="">-- Choisir --</option>
                      <option value="L1">L1</option>
                      <option value="L2">L2</option>
                      <option value="L3">L3</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Spécialité :</label>
                    <select v-model="pubFiltre.specialiteId" :disabled="!specialitesFiltrePub.length" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs disabled:opacity-50 outline-none">
                      <option :value="null">Tronc commun</option>
                      <option v-for="s in specialitesFiltrePub" :key="s.id" :value="s.id">{{ s.nom }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs font-bold text-slate-700 block mb-1">Semestre :</label>
                    <select v-model="pubFiltre.semestreId" :disabled="!pubFiltre.niveau" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs disabled:opacity-50 outline-none">
                      <option :value="null">-- Choisir --</option>
                      <option v-for="sem in semestresFiltrePub" :key="sem.id" :value="sem.id">{{ sem.code }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Sélectionner l'UE :</label>
                  <select v-model="pubForm.ueId" required :disabled="!uesFiltrees.length" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs disabled:opacity-50 outline-none">
                    <option value="" disabled>{{ uesFiltrees.length ? '-- Choisir une UE --' : 'Complétez les filtres ci-dessus' }}</option>
                    <option v-for="ue in uesFiltrees" :key="ue.id" :value="ue.id">{{ ue.code }} - {{ ue.nom }}</option>
                  </select>
                </div>

                <!-- L'année et la session concernent la publication, pas l'UE -->
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Année concernée :</label>
                  <select v-model="pubForm.anneeId" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                    <option value="" disabled>-- Choisir --</option>
                    <option v-for="a in mockAnneesAcademiques" :key="a.id" :value="a.id">{{ a.libelle }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Session :</label>
                  <select v-model="pubForm.sessionId" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                    <option value="" disabled>-- Choisir --</option>
                    <option v-for="s in mockSessions" :key="s.id" :value="s.id">{{ s.libelle }}</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="text-xs font-bold text-slate-700 block mb-1">Fichier PDF des résultats :</label>
                  <input 
                    type="file" 
                    @change="gererSelectionFichier" 
                    accept=".pdf" 
                    required 
                    class="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer outline-none" 
                  />
                  <p class="text-[10px] text-slate-400 mt-1">Fichier sélectionné : <span class="font-bold text-slate-700">{{ pubForm.nomFichier || 'Aucun fichier' }}</span></p>
                </div>
                <div class="sm:col-span-2">
                  <label class="text-xs font-bold text-slate-700 block mb-1">Commentaire / Motif de version :</label>
                  <input type="text" v-model="pubForm.commentaire" placeholder="ex: Version initiale ou Correction de notes" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none" />
                </div>
                <div class="sm:col-span-2">
                  <button type="submit" class="w-full py-3.5 rounded-2xl bg-teal-900 hover:bg-teal-950 text-white text-xs font-extrabold uppercase tracking-widest cursor-pointer transition-all">
                    Publier / Créer une nouvelle version
                  </button>
                </div>
              </form>
            </div>

            <!-- HISTORIQUE DES PUBLICATIONS -->
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="text-xs font-extrabold text-slate-900 uppercase">Historique et Versions des Publications</h3>
              <div class="space-y-3">
                <div v-for="pub in mockPublications" :key="pub.id" class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-[10px]">Version {{ pub.version }}</span>
                      <span v-if="pub.actif" class="px-2 py-0.5 rounded-md bg-teal-600 text-white font-bold text-[10px]">Active</span>
                      <span v-else class="px-2 py-0.5 rounded-md bg-slate-300 text-slate-700 font-bold text-[10px]">Archivée</span>
                    </div>
                    <h4 class="font-extrabold text-slate-900 text-xs">{{ pub.ueCode }} - {{ pub.ueName }}</h4>
                    <p class="text-[11px] font-semibold text-emerald-800">
                      Filière : {{ pub.filiere || 'Non renseignée' }} · Session : {{ pub.session || 'Non renseignée' }} · Année : {{ pub.annee || 'Non renseignée' }}
                    </p>
                    <p class="text-[11px] text-slate-500">Fichier : {{ pub.nomFichier }} | Commentaire : {{ pub.commentaire || 'Aucun' }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="basculerVersionActive(pub.id)" v-if="!pub.actif" class="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer transition-all">
                      Activer cette version
                    </button>
                    <button @click="supprimerPublication(pub.id)" class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer transition-all">
                      Supprimer
                    </button>
                  </div>
                </div>
                <div v-if="mockPublications.length === 0" class="text-xs text-slate-400 italic">
                  Aucune publication enregistrée pour le moment.
                </div>
              </div>
            </div>
          </section>

          <!-- 6. PV DÉFINITIFS DE SEMESTRE -->
          <section v-if="activeTab === 'pv-semestres'" class="space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="text-xs font-extrabold text-slate-900 uppercase">Déposer un PV Définitif de Semestre</h3>
              <p class="text-[11px] text-slate-500">
                Un PV définitif est un seul PDF rattaché à une Filière + un Semestre + une Année (pas de session).
              </p>
              <form @submit.prevent="publierPv" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Filière :</label>
                  <select v-model="pvForm.filiereId" @change="onFiliereChangePv" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                    <option value="" disabled>-- Choisir --</option>
                    <option v-for="f in mockFilieres" :key="f.id" :value="f.id">{{ f.nom }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Niveau :</label>
                  <select v-model="pvForm.niveau" @change="onNiveauPvChange" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                    <option value="" disabled>-- Choisir --</option>
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Spécialité :</label>
                  <select v-model="pvForm.specialiteId" :disabled="!specialitesFiltrePv.length" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs disabled:opacity-50 outline-none">
                    <option :value="null">Tronc commun</option>
                    <option v-for="s in specialitesFiltrePv" :key="s.id" :value="s.id">{{ s.nom }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Semestre :</label>
                  <select v-model="pvForm.semestreId" :disabled="!pvForm.niveau" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs disabled:opacity-50 outline-none">
                    <option value="" disabled>-- Choisir --</option>
                    <option v-for="sem in semestresFiltrePv" :key="sem.id" :value="sem.id">{{ sem.code }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs font-bold text-slate-700 block mb-1">Année concernée :</label>
                  <select v-model="pvForm.anneeId" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none">
                    <option value="" disabled>-- Choisir --</option>
                    <option v-for="a in mockAnneesAcademiques" :key="a.id" :value="a.id">{{ a.libelle }}</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="text-xs font-bold text-slate-700 block mb-1">Fichier PDF du PV définitif :</label>
                  <input
                    type="file"
                    @change="gererSelectionFichierPv"
                    accept=".pdf"
                    required
                    class="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer outline-none"
                  />
                  <p class="text-[10px] text-slate-400 mt-1">Fichier sélectionné : <span class="font-bold text-slate-700">{{ pvForm.nomFichier || 'Aucun fichier' }}</span></p>
                </div>
                <div class="sm:col-span-2">
                  <label class="text-xs font-bold text-slate-700 block mb-1">Commentaire / Motif de version :</label>
                  <input type="text" v-model="pvForm.commentaire" placeholder="ex: Version initiale ou Correction" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none" />
                </div>
                <div class="sm:col-span-2">
                  <button type="submit" class="w-full py-3.5 rounded-2xl bg-teal-900 hover:bg-teal-950 text-white text-xs font-extrabold uppercase tracking-widest cursor-pointer transition-all">
                    Publier / Créer une nouvelle version
                  </button>
                </div>
              </form>
            </div>

            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 class="text-xs font-extrabold text-slate-900 uppercase">Historique des PV Définitifs</h3>
              <div class="space-y-3">
                <div v-for="pv in mockPvSemestres" :key="pv.id" class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-extrabold text-[10px]">Version {{ pv.version }}</span>
                      <span v-if="pv.actif" class="px-2 py-0.5 rounded-md bg-teal-600 text-white font-bold text-[10px]">Active</span>
                      <span v-else class="px-2 py-0.5 rounded-md bg-slate-300 text-slate-700 font-bold text-[10px]">Archivée</span>
                    </div>
                    <h4 class="font-extrabold text-slate-900 text-xs">{{ pv.filiere }}<span v-if="pv.specialite"> - {{ pv.specialite }}</span> - {{ pv.semestre }} ({{ pv.niveau }})</h4>
                    <p class="text-[11px] font-semibold text-emerald-800">Année : {{ pv.annee }}</p>
                    <p class="text-[11px] text-slate-500">Fichier : {{ pv.nomFichier }} | Commentaire : {{ pv.commentaire || 'Aucun' }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button @click="basculerVersionActivePv(pv.id)" v-if="!pv.actif" class="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer transition-all">
                      Activer cette version
                    </button>
                    <button @click="supprimerPvSemestre(pv.id)" class="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold cursor-pointer transition-all">
                      Supprimer
                    </button>
                  </div>
                </div>
                <div v-if="mockPvSemestres.length === 0" class="text-xs text-slate-400 italic">
                  Aucun PV définitif enregistré pour le moment.
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import {
  mockAnneesAcademiques,
  mockSessions,
  mockFilieres,
  mockSpecialites,
  mockUes,
  mockPublications
} from '../data/mockData.js'

const mockPvSemestres = ref([])

const isAuthenticated = ref(false)
const passwordInput = ref('')
const emailInput = ref('admin@enarque.local')
const loginError = ref('')
const operationError = ref('')
import { API_URL as apiUrl } from '../config.js'

const semestres = ref([])

const afficherErreur = (error) => {
  operationError.value = error.response?.data?.error || 'Opération impossible. Vérifiez le backend.'
}

const chargerDonnees = async () => {
  try {
    operationError.value = ''
    const [annees, sessions, filieres, specialites, semestresResponse, ues, publications, pvSemestres] = await Promise.all([
      axios.get(`${apiUrl}/annees`),
      axios.get(`${apiUrl}/sessions`),
      axios.get(`${apiUrl}/filieres`),
      axios.get(`${apiUrl}/specialites`),
      axios.get(`${apiUrl}/semestres`),
      axios.get(`${apiUrl}/ues`),
      axios.get(`${apiUrl}/publications`),
      axios.get(`${apiUrl}/pv-semestres`)
    ])
    mockAnneesAcademiques.value = annees.data
    mockSessions.value = sessions.data
    mockFilieres.value = filieres.data
    mockSpecialites.value = specialites.data.map(specialite => ({
      ...specialite,
      filiere: mockFilieres.value.find(filiere => filiere.id === specialite.filiere_id)?.code || specialite.filiere,
      niveau: specialite.niveau_min
    }))
    semestres.value = semestresResponse.data
    mockUes.value = ues.data
    mockPublications.value = publications.data
    mockPvSemestres.value = pvSemestres.data
  } catch (error) {
    afficherErreur(error)
  }
}

const login = async () => {
  loginError.value = ''
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, {
      email: emailInput.value,
      password: passwordInput.value
    })
    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`
    isAuthenticated.value = true
  } catch (error) {
    loginError.value = error.response?.data?.error || 'Connexion impossible. Vérifiez le serveur backend.'
  }
}

onMounted(chargerDonnees)

const activeTab = ref('dashboard')
const mobileMenuOpen = ref(false)
const adminTabs = ref([
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'sessions', label: 'Années académiques' },
  { id: 'filieres', label: 'Filières & Spécialités' },
  { id: 'ues', label: 'Gestion des UE' },
  { id: 'publications', label: 'Publications & Versions' },
  { id: 'pv-semestres', label: 'PV Définitifs (Semestre)' }
])

const currentTabTitle = computed(() => {
  const t = adminTabs.value.find(tab => tab.id === activeTab.value)
  return t ? t.label : 'Administration'
})

// --- GESTION DES ANNÉES ACADÉMIQUES ---
const anneeForm = ref({ libelle: '' })

const ajouterAnnee = async () => {
  if (anneeForm.value.libelle.trim()) {
    try {
      operationError.value = ''
      const response = await axios.post(`${apiUrl}/annees`, { libelle: anneeForm.value.libelle.trim() })
      mockAnneesAcademiques.value.push(response.data)
      anneeForm.value.libelle = ''
    } catch (error) {
      afficherErreur(error)
    }
  }
}

const supprimerAnnee = async (id) => {
  try {
    await axios.delete(`${apiUrl}/annees/${id}`)
    mockAnneesAcademiques.value = mockAnneesAcademiques.value.filter(a => a.id !== id)
  } catch (error) {
    afficherErreur(error)
  }
}

// --- GESTION DES FILIÈRES ET SPÉCIALITÉS PAR NIVEAU ---
const specialiteForm = ref({
  filiereCode: 'STID',
  niveau: 'L2',
  code: '',
  nom: ''
})

const niveauRang = (niveau) => ({ L1: 1, L2: 2, L3: 3 }[niveau] || 0)

const ajouterSpecialite = async () => {
  if (specialiteForm.value.code.trim() && specialiteForm.value.nom.trim()) {
    const code = specialiteForm.value.code.trim().toUpperCase()
    const nomComplet = specialiteForm.value.nom.trim()

    try {
      const filiere = mockFilieres.value.find(item => item.code === specialiteForm.value.filiereCode)
      const response = await axios.post(`${apiUrl}/specialites`, {
        filiere_id: filiere.id,
        code,
        nom: nomComplet,
        niveau_min: specialiteForm.value.niveau
      })
      mockSpecialites.value.push({ ...response.data, filiere: specialiteForm.value.filiereCode, niveau: specialiteForm.value.niveau })
      specialiteForm.value.code = ''
      specialiteForm.value.nom = ''
    } catch (error) {
      afficherErreur(error)
    }
  }
}

const supprimerSpecialite = async (code) => {
  const specialite = mockSpecialites.value.find(item => item.code === code)
  if (!specialite?.id) return
  try {
    await axios.delete(`${apiUrl}/specialites/${specialite.id}`)
    mockSpecialites.value = mockSpecialites.value.filter(s => s.id !== specialite.id)
  } catch (error) {
    afficherErreur(error)
  }
}

// --- GESTION DES UE (catalogue fixe, sans année) ---
const ueForm = ref({
  filiere: 'STID',
  specialite: '',
  niveau: 'L2',
  semestre: 'S3',
  code: '',
  nom: ''
})

const specialitesDisponibles = computed(() => {
  if (ueForm.value.niveau === 'L1') {
    ueForm.value.specialite = ''
    return []
  }
  const niveaux = { L1: 1, L2: 2, L3: 3 }
  return mockSpecialites.value.filter(s => s.filiere === ueForm.value.filiere && niveaux[s.niveau] <= niveaux[ueForm.value.niveau])
})

const semestresDisponibles = computed(() => {
  const result = semestres.value.filter(semestre => semestre.niveau === ueForm.value.niveau).map(semestre => semestre.code)
  return result.length ? result : ({ L1: ['S1', 'S2'], L2: ['S3', 'S4'], L3: ['S5', 'S6'] }[ueForm.value.niveau] || [])
})

const onFiliereChange = () => {
  const premiereSpecialite = specialitesDisponibles.value[0]
  ueForm.value.specialite = premiereSpecialite ? premiereSpecialite.code : ''
}

const onNiveauChange = () => {
  if (ueForm.value.niveau === 'L1') {
    ueForm.value.specialite = ''
  }
  ueForm.value.semestre = semestresDisponibles.value[0] || 'S1'
}

const ajouterUE = async () => {
  try {
    const filiere = mockFilieres.value.find(item => item.code === ueForm.value.filiere)
    const specialite = mockSpecialites.value.find(item => item.code === ueForm.value.specialite && item.filiere === ueForm.value.filiere)
    const semestre = semestres.value.find(item => item.code === ueForm.value.semestre && item.niveau === ueForm.value.niveau)
    const response = await axios.post(`${apiUrl}/ues`, {
      filiere_id: filiere?.id,
      specialite_id: specialite?.id || null,
      semestre_id: semestre?.id,
      code: ueForm.value.code,
      nom: ueForm.value.nom
    })
    mockUes.value.push({ ...response.data, filiere: ueForm.value.filiere, specialite: ueForm.value.specialite, semestre: ueForm.value.semestre })
    ueForm.value.code = ''
    ueForm.value.nom = ''
  } catch (error) {
    afficherErreur(error)
  }
}

const supprimerUE = async (id) => {
  try {
    await axios.delete(`${apiUrl}/ues/${id}`)
    mockUes.value = mockUes.value.filter(u => u.id !== id)
  } catch (error) {
    afficherErreur(error)
  }
}

// --- PUBLICATIONS & VERSIONS ---

// Filtres en cascade pour retrouver l'UE (catalogue fixe, pas d'année ici)
const pubFiltre = ref({
  filiereId: null,
  specialiteId: null,
  niveau: '',
  semestreId: null
})

const specialitesFiltrePub = computed(() => {
  if (pubFiltre.value.niveau === 'L1' || !pubFiltre.value.filiereId) return []
  const niveaux = { L1: 1, L2: 2, L3: 3 }
  return mockSpecialites.value.filter(s =>
    s.filiere_id === pubFiltre.value.filiereId && niveaux[s.niveau_min] <= niveaux[pubFiltre.value.niveau]
  )
})

const semestresFiltrePub = computed(() => {
  return semestres.value.filter(s => s.niveau === pubFiltre.value.niveau)
})

const uesFiltrees = computed(() => {
  if (!pubFiltre.value.filiereId || !pubFiltre.value.semestreId) {
    return []
  }
  return mockUes.value.filter(ue => {
    const matchBase = ue.filiere_id === pubFiltre.value.filiereId
      && ue.semestre_id === pubFiltre.value.semestreId
    const matchSpecialite = pubFiltre.value.niveau === 'L1'
      ? true
      : ue.specialite_id === (pubFiltre.value.specialiteId || null)
    return matchBase && matchSpecialite
  })
})

const onFiliereFiltrePubChange = () => {
  pubFiltre.value.specialiteId = null
}

const onNiveauFiltrePubChange = () => {
  if (pubFiltre.value.niveau === 'L1') pubFiltre.value.specialiteId = null
  pubFiltre.value.semestreId = null
  pubForm.value.ueId = ''
}

const pubForm = ref({
  ueId: '',
  anneeId: '',
  sessionId: '',
  nomFichier: '',
  fichierBrut: null,
  commentaire: ''
})

const gererSelectionFichier = (event) => {
  const fichier = event.target.files[0]
  if (fichier) {
    pubForm.value.nomFichier = fichier.name
    pubForm.value.fichierBrut = fichier
    operationError.value = ''
  }
}

const publierFichier = async () => {
  try {
    operationError.value = ''
    if (!pubForm.value.ueId) throw new Error('Aucune UE n’est sélectionnée.')
    if (!pubForm.value.anneeId) throw new Error('Aucune année n’est sélectionnée.')
    if (!pubForm.value.sessionId) throw new Error('Aucune session n’est sélectionnée.')
    if (!pubForm.value.fichierBrut) throw new Error('Aucun fichier PDF n’est sélectionné.')
    const formData = new FormData()
    formData.append('ue_id', pubForm.value.ueId)
    formData.append('annee_id', pubForm.value.anneeId)
    formData.append('session_id', pubForm.value.sessionId)
    formData.append('commentaire', pubForm.value.commentaire)
    formData.append('fichier', pubForm.value.fichierBrut)
    const response = await axios.post(`${apiUrl}/publications`, formData)
    mockPublications.value.unshift(response.data)
    operationError.value = ''
    pubForm.value.ueId = ''
    pubForm.value.anneeId = ''
    pubForm.value.sessionId = ''
    pubForm.value.nomFichier = ''
    pubForm.value.fichierBrut = null
    pubForm.value.commentaire = ''
  } catch (error) {
    if (error.response) afficherErreur(error)
    else operationError.value = error.message
  }
}

const basculerVersionActive = (id) => {
  return axios.patch(`${apiUrl}/publications/${id}/activer`)
    .then(() => chargerDonnees())
    .catch(afficherErreur)
}

const supprimerPublication = async (id) => {
  try {
    await axios.delete(`${apiUrl}/publications/${id}`)
    mockPublications.value = mockPublications.value.filter(p => p.id !== id)
    operationError.value = ''
  } catch (error) {
    afficherErreur(error)
  }
}

// --- PV DÉFINITIFS DE SEMESTRE (pas de session, pas de spécialité) ---
const pvForm = ref({
  filiereId: '',
  specialiteId: null,
  niveau: '',
  semestreId: '',
  anneeId: '',
  nomFichier: '',
  fichierBrut: null,
  commentaire: ''
})

const specialitesFiltrePv = computed(() => {
  if (pvForm.value.niveau === 'L1' || !pvForm.value.filiereId) return []
  const niveaux = { L1: 1, L2: 2, L3: 3 }
  const filiere = mockFilieres.value.find(f => f.id === pvForm.value.filiereId)
  return mockSpecialites.value.filter(s =>
    s.filiere === filiere?.code && niveaux[s.niveau] <= niveaux[pvForm.value.niveau]
  )
})

const semestresFiltrePv = computed(() => {
  return semestres.value.filter(s => s.niveau === pvForm.value.niveau)
})

const onFiliereChangePv = () => {
  pvForm.value.specialiteId = null
}

const onNiveauPvChange = () => {
  if (pvForm.value.niveau === 'L1') pvForm.value.specialiteId = null
  pvForm.value.semestreId = ''
}

const gererSelectionFichierPv = (event) => {
  const fichier = event.target.files[0]
  if (fichier) {
    pvForm.value.nomFichier = fichier.name
    pvForm.value.fichierBrut = fichier
    operationError.value = ''
  }
}

const publierPv = async () => {
  try {
    operationError.value = ''
    if (!pvForm.value.filiereId) throw new Error('Aucune filière n’est sélectionnée.')
    if (!pvForm.value.semestreId) throw new Error('Aucun semestre n’est sélectionné.')
    if (!pvForm.value.anneeId) throw new Error('Aucune année n’est sélectionnée.')
    if (!pvForm.value.fichierBrut) throw new Error('Aucun fichier PDF n’est sélectionné.')
    const formData = new FormData()
    formData.append('filiere_id', pvForm.value.filiereId)
    if (pvForm.value.specialiteId) formData.append('specialite_id', pvForm.value.specialiteId)
    formData.append('semestre_id', pvForm.value.semestreId)
    formData.append('annee_id', pvForm.value.anneeId)
    formData.append('commentaire', pvForm.value.commentaire)
    formData.append('fichier', pvForm.value.fichierBrut)
    const response = await axios.post(`${apiUrl}/pv-semestres`, formData)
    mockPvSemestres.value.unshift(response.data)
    operationError.value = ''
    pvForm.value.filiereId = ''
    pvForm.value.specialiteId = null
    pvForm.value.niveau = ''
    pvForm.value.semestreId = ''
    pvForm.value.anneeId = ''
    pvForm.value.nomFichier = ''
    pvForm.value.fichierBrut = null
    pvForm.value.commentaire = ''
  } catch (error) {
    if (error.response) afficherErreur(error)
    else operationError.value = error.message
  }
}

const basculerVersionActivePv = (id) => {
  return axios.patch(`${apiUrl}/pv-semestres/${id}/activer`)
    .then(() => chargerDonnees())
    .catch(afficherErreur)
}

const supprimerPvSemestre = async (id) => {
  try {
    await axios.delete(`${apiUrl}/pv-semestres/${id}`)
    mockPvSemestres.value = mockPvSemestres.value.filter(p => p.id !== id)
    operationError.value = ''
  } catch (error) {
    afficherErreur(error)
  }
}
</script>

<style>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
