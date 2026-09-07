// Adresse du serveur backend.
// En local (npm run dev), utilise localhost:5000 par défaut.
// En ligne, définis VITE_API_BASE_URL dans les variables d'environnement
// de ton hébergeur (ex: Vercel) avec l'adresse de ton backend déployé
// (ex: https://mon-backend.up.railway.app), SANS slash à la fin.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
export const API_URL = `${BASE_URL}/api`
