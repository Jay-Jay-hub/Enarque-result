const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const db = require('./db')
const adminRoutes = require('./adminRoutes')
const path = require('path')

const app = express()
const port = Number(process.env.PORT) || 5000
const jwtSecret = process.env.JWT_SECRET || 'enarque-demo-secret-change-me'

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.post('/api/auth/login', async (req, res, next) => {
	try {
		const { email, password } = req.body
		if (!email || !password) {
			return res.status(400).json({ error: 'Email et mot de passe obligatoires.' })
		}

		const [rows] = await db.query(
			'SELECT id, email, mot_de_passe_hash FROM administrateurs WHERE email = ? AND actif = 1 LIMIT 1',
			[email.trim().toLowerCase()]
		)

		if (!rows[0] || !(await bcrypt.compare(password, rows[0].mot_de_passe_hash))) {
			return res.status(401).json({ error: 'Email ou mot de passe incorrect.' })
		}

		const token = jwt.sign(
			{ id: rows[0].id, email: rows[0].email },
			jwtSecret,
			{ expiresIn: '8h' }
		)

		res.json({
			id: rows[0].id,
			email: rows[0].email,
			token
		})
	} catch (error) {
		next(error)
	}
})

app.get('/api/health', async (_req, res, next) => {
	try {
		await db.query('SELECT 1')
		res.json({
			ok: true,
			database: process.env.DB_NAME
		})
	} catch (error) {
		next(error)
	}
})

app.use('/api', adminRoutes)

app.use((error, _req, res, _next) => {
	console.error(error.message)

	if (error.code === 'ER_DUP_ENTRY') {
		return res.status(409).json({ error: 'Cet élément existe déjà.' })
	}

	if (error.code === 'ER_NO_REFERENCED_ROW_2') {
		return res.status(400).json({
			error: 'Une relation fournie n’existe pas.'
		})
	}

	res.status(500).json({ error: 'Erreur interne du serveur.' })
})

// Diagnostic temporaire des variables Railway
console.log('DB_HOST présent :', !!process.env.DB_HOST)
console.log('DB_USER présent :', !!process.env.DB_USER)
console.log('DB_PASS présent :', !!process.env.DB_PASS)
console.log('DB_NAME :', process.env.DB_NAME)

app.listen(port, () => {
	console.log(`API Enarque Result disponible sur http://localhost:${port}`)
})