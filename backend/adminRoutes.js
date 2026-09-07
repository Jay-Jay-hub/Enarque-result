const express = require('express')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const controller = require('./adminController')

const router = express.Router()
const jwtSecret = process.env.JWT_SECRET || 'enarque-demo-secret-change-me'

const requireAdminForWrites = (req, res, next) => {
	if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next()
	const token = req.headers.authorization?.replace('Bearer ', '')
	if (!token) return res.status(401).json({ error: 'Authentification administrateur requise.' })
	try {
		req.admin = jwt.verify(token, jwtSecret)
		next()
	} catch (_error) {
		res.status(401).json({ error: 'Session administrateur expirée.' })
	}
}

router.use(requireAdminForWrites)
const uploadDirectory = path.join(__dirname, 'uploads')
fs.mkdirSync(uploadDirectory, { recursive: true })
const storage = multer.diskStorage({
	destination: (_req, _file, callback) => callback(null, uploadDirectory),
	filename: (_req, file, callback) => {
		const baseName = path.basename(file.originalname, path.extname(file.originalname))
			.replace(/[^a-zA-Z0-9_-]/g, '-')
		const extension = path.extname(file.originalname).toLowerCase()
		callback(null, `${Date.now()}-${baseName || 'document'}${extension}`)
	}
})
const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter: (_req, file, callback) => {
		const isPdf = file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf'
		if (!isPdf) return callback(new Error('Seuls les fichiers PDF sont acceptés.'))
		callback(null, true)
	}
})
const definitions = {
	annees: ['libelle'],
	specialites: ['filiere_id', 'code', 'nom', 'niveau_min'],
	ues: ['filiere_id', 'specialite_id', 'semestre_id', 'code', 'nom']
}

router.get('/filieres', controller.listFilieres)
router.get('/specialites', controller.listSpecialites)
router.get('/semestres', controller.listSemestres)
router.get('/sessions', controller.listResource('sessions'))
router.get('/ues', controller.listUes)
router.get('/publications', controller.listPublications)
router.post('/publications', (req, res, next) => {
	upload.single('fichier')(req, res, error => {
		if (error) return next(error)
		next()
	})
}, controller.createPublication)
router.delete('/publications/:id', controller.deletePublication)
router.patch('/publications/:id/activer', controller.activatePublication)

router.get('/pv-semestres', controller.listPvSemestres)
router.post('/pv-semestres', (req, res, next) => {
	upload.single('fichier')(req, res, error => {
		if (error) return next(error)
		next()
	})
}, controller.createPvSemestre)
router.delete('/pv-semestres/:id', controller.deletePvSemestre)
router.patch('/pv-semestres/:id/activer', controller.activatePvSemestre)

Object.entries(definitions).forEach(([resource, fields]) => {
	router.get(`/${resource}`, resource === 'ues' ? controller.listUes : controller.listResource(resource))
	router.post(`/${resource}`, controller.createResource(resource, fields))
	router.delete(`/${resource}/:id`, controller.deleteResource(resource))
})

module.exports = router
