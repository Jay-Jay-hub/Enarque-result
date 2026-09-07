# Enarque Result

Application de gestion et de consultation des résultats universitaires (UE, semestres, publications par session, procès-verbaux définitifs).

🔗 **Site en ligne :** https://enarque-result.vercel.app
🔗 **API backend :** https://enarque-result-production.up.railway.app

## Fonctionnalités

- **Consultation publique** : parcours guidé Année → Filière → Niveau → Spécialité → Semestre → UE, avec accès aux résultats publiés
- **Recherche globale** (`/recherche`) : filtres par année, filière, niveau et session/type de document
- **Publications par UE** : résultats déposés par session (normale, rattrapage), avec gestion de versions
- **PV Définitifs de Semestre** : PDF unique par Filière + Spécialité (optionnelle) + Semestre + Année, déposé manuellement par l'administration
- **Espace Admin** (`/admin`) : gestion des filières, spécialités, UE, publications et PV définitifs, avec authentification

## Stack technique

- **Frontend** : Vue 3 (Vue Router, Composition API), Tailwind CSS, Axios — hébergé sur **Vercel**
- **Backend** : Node.js, Express, MySQL2, Multer (upload de fichiers), JWT (authentification admin) — hébergé sur **Railway**
- **Base de données** : MySQL — hébergée sur **Railway**

## Structure du projet

```
enarque/
├── backend/
│   ├── server.js            # Point d'entrée de l'API
│   ├── db.js                 # Connexion à la base MySQL
│   ├── adminController.js    # Logique métier (UE, publications, PV définitifs...)
│   ├── adminRoutes.js        # Déclaration des routes /api/...
│   └── uploads/               # Fichiers PDF déposés (publications, PV)
├── frontend/
│   ├── src/
│   │   ├── config.js          # Adresse du backend (configurable via variable d'environnement)
│   │   ├── views/              # Pages (Recherche, Admin, UEs, détail UE...)
│   │   └── components/         # Étapes du parcours de sélection
│   └── vercel.json            # Configuration du routage pour Vercel
└── pv_semestres.sql           # Script de création de la table des PV définitifs
```

## Installation en local

### Prérequis
- Node.js 18+
- MySQL / MariaDB (ex: via XAMPP)

### Backend
```bash
cd backend
npm install
```

Crée un fichier `.env` dans `backend/` :
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=enarque_result
JWT_SECRET=une-phrase-secrete-a-toi
PORT=5000
```

Importe la structure de la base (via phpMyAdmin, onglet Importer), puis lance :
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Par défaut, le frontend contacte `http://localhost:5000`. Pour cibler un autre backend, crée un fichier `.env` dans `frontend/` :
```
VITE_API_BASE_URL=http://localhost:5000
```

## Déploiement

### Backend + Base de données (Railway)
1. Créer un service MySQL sur Railway
2. Créer un service à partir du dépôt GitHub, avec **Root Directory** = `backend`
3. Renseigner les variables d'environnement `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` (en référence aux variables du service MySQL) et `JWT_SECRET`
4. Générer un domaine public pour le backend (Settings → Networking → Generate Domain)

### Frontend (Vercel)
1. Importer le dépôt GitHub, avec **Root Directory** = `frontend`
2. Ajouter la variable d'environnement `VITE_API_BASE_URL` pointant vers l'URL du backend Railway
3. Déployer

Le fichier `frontend/vercel.json` est nécessaire pour que les routes internes de l'application (`/admin`, `/recherche`, etc.) fonctionnent correctement sur Vercel (sans lui, elles renvoient une erreur 404).
