const db = require('./db')
const bcrypt = require('bcryptjs')

const resourceTables = {
	annees: 'annees',
	sessions: 'sessions',
	specialites: 'specialites',
	semestres: 'semestres',
	ues: 'ues'
}

const listResource = (resource) => async (_req, res, next) => {
	try {
		const [rows] = await db.query(`SELECT * FROM ${resourceTables[resource]} ORDER BY id DESC`)
		res.json(rows)
	} catch (error) {
		next(error)
	}
}

const createResource = (resource, fields) => async (req, res, next) => {
	try {
		const values = fields.map(field => req.body[field] === undefined ? null : req.body[field])
		const requiredFields = resource === 'ues'
			? ['filiere_id', 'semestre_id', 'code', 'nom']
			: fields
		const missingField = requiredFields.find(field => req.body[field] === undefined || req.body[field] === '')

		if (missingField) {
			return res.status(400).json({ error: `Champ requis manquant : ${missingField}` })
		}

		const placeholders = fields.map(() => '?').join(', ')
		const [result] = await db.query(
			`INSERT INTO ${resourceTables[resource]} (${fields.join(', ')}) VALUES (${placeholders})`,
			values
		)
		const [rows] = await db.query(`SELECT * FROM ${resourceTables[resource]} WHERE id = ?`, [result.insertId])
		res.status(201).json(rows[0])
	} catch (error) {
		next(error)
	}
}

const deleteResource = (resource) => async (req, res, next) => {
	try {
		const [result] = await db.query(`DELETE FROM ${resourceTables[resource]} WHERE id = ?`, [req.params.id])
		if (result.affectedRows === 0) return res.status(404).json({ error: 'Élément introuvable.' })
		res.status(204).send()
	} catch (error) {
		next(error)
	}
}

const listFilieres = async (_req, res, next) => {
	try {
		const [rows] = await db.query('SELECT * FROM filieres ORDER BY nom')
		res.json(rows)
	} catch (error) {
		next(error)
	}
}

const listSpecialites = async (req, res, next) => {
	try {
		const { filiere_id: filiereId } = req.query
		const [rows] = await db.query(`
			SELECT s.*, f.code AS filiere
			FROM specialites s
			JOIN filieres f ON f.id = s.filiere_id
			${filiereId ? 'WHERE s.filiere_id = ?' : ''}
			ORDER BY s.nom
		`, filiereId ? [filiereId] : [])
		res.json(rows)
	} catch (error) {
		next(error)
	}
}

const listSemestres = listResource('semestres')

// Les UE forment un catalogue fixe : elles ne dépendent plus de l'année.
const listUes = async (req, res, next) => {
	try {
		const filters = []
		const values = []
		const filterColumns = {
			filiere_id: 'u.filiere_id',
			specialite_id: 'u.specialite_id',
			semestre_id: 'u.semestre_id'
		}

		Object.entries(filterColumns).forEach(([parameter, column]) => {
			if (req.query[parameter] !== undefined) {
				filters.push(`${column} = ?`)
				values.push(req.query[parameter])
			}
		})

		const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
		const [rows] = await db.query(`
			SELECT u.id, u.code, u.nom, u.filiere_id,
				u.specialite_id, u.semestre_id,
				f.code AS filiere, sp.code AS specialite, se.code AS semestre, se.niveau AS niveau
			FROM ues u
			JOIN filieres f ON f.id = u.filiere_id
			LEFT JOIN specialites sp ON sp.id = u.specialite_id
			JOIN semestres se ON se.id = u.semestre_id
			${where}
			ORDER BY u.id ASC
		`, values)
		res.json(rows)
	} catch (error) {
		next(error)
	}
}

// Les publications portent désormais leur propre année (indépendante de l'UE).
const listPublications = async (_req, res, next) => {
	try {
		const [rows] = await db.query(`
			SELECT p.id, p.ue_id, p.annee_id, p.session_id, p.fichier,
				SUBSTRING_INDEX(p.fichier, '/', -1) AS nomFichier,
				CONCAT('/uploads/', SUBSTRING_INDEX(p.fichier, '/', -1)) AS fileUrl,
				p.commentaire,
				p.version, p.actif, p.date_publication,
				u.code AS ueCode, u.nom AS ueName, s.libelle AS session,
				a.libelle AS annee, f.code AS filiere, se.niveau AS niveau
			FROM publications p
			JOIN ues u ON u.id = p.ue_id
			JOIN sessions s ON s.id = p.session_id
			JOIN annees a ON a.id = p.annee_id
			JOIN filieres f ON f.id = u.filiere_id
			JOIN semestres se ON se.id = u.semestre_id
			ORDER BY p.date_publication DESC, p.id DESC
		`)
		res.json(rows)
	} catch (error) {
		next(error)
	}
}

const createPublication = async (req, res, next) => {
	try {
		const { ue_id: ueId, annee_id: anneeId, session_id: sessionId, commentaire = '' } = req.body
		if (!req.file) return res.status(400).json({ error: 'Aucun fichier PDF n’a été reçu.' })
		if (!ueId) return res.status(400).json({ error: 'Aucune UE n’est sélectionnée.' })
		if (!anneeId) return res.status(400).json({ error: 'Aucune année n’est sélectionnée.' })
		if (!sessionId) return res.status(400).json({ error: 'Aucune session n’est sélectionnée.' })

		const [ueRows] = await db.query('SELECT id FROM ues WHERE id = ?', [ueId])
		if (!ueRows[0]) return res.status(400).json({ error: 'UE introuvable.' })
		const [anneeRows] = await db.query('SELECT id FROM annees WHERE id = ?', [anneeId])
		if (!anneeRows[0]) return res.status(400).json({ error: 'Année introuvable.' })
		const [sessionRows] = await db.query('SELECT id FROM sessions WHERE id = ?', [sessionId])
		if (!sessionRows[0]) return res.status(400).json({ error: 'Session introuvable.' })

		// Versionnement et désactivation des anciennes versions, désormais
		// isolés par Année en plus de l'UE et de la Session.
		const [versions] = await db.query(
			'SELECT COUNT(*) AS total FROM publications WHERE ue_id = ? AND annee_id = ? AND session_id = ?',
			[ueId, anneeId, sessionId]
		)
		await db.query(
			'UPDATE publications SET actif = 0 WHERE ue_id = ? AND annee_id = ? AND session_id = ?',
			[ueId, anneeId, sessionId]
		)
		const fichier = `uploads/${req.file.filename}`
		const [result] = await db.query(`
			INSERT INTO publications (ue_id, annee_id, session_id, fichier, commentaire, version, actif)
			VALUES (?, ?, ?, ?, ?, ?, 1)
		`, [ueId, anneeId, sessionId, fichier, commentaire, versions[0].total + 1])

		const [rows] = await db.query(`
			SELECT p.id, p.ue_id, p.annee_id, p.session_id, p.fichier,
				SUBSTRING_INDEX(p.fichier, '/', -1) AS nomFichier,
				CONCAT('/uploads/', SUBSTRING_INDEX(p.fichier, '/', -1)) AS fileUrl,
				p.commentaire,
				p.version, p.actif, p.date_publication,
				u.code AS ueCode, u.nom AS ueName, s.libelle AS session,
				a.libelle AS annee, f.code AS filiere, se.niveau AS niveau
			FROM publications p
			JOIN ues u ON u.id = p.ue_id
			JOIN sessions s ON s.id = p.session_id
			JOIN annees a ON a.id = p.annee_id
			JOIN filieres f ON f.id = u.filiere_id
			JOIN semestres se ON se.id = u.semestre_id
			WHERE p.id = ?
		`, [result.insertId])
		res.status(201).json(rows[0])
	} catch (error) {
		next(error)
	}
}

const deletePublication = async (req, res, next) => {
	try {
		const [rows] = await db.query('SELECT fichier FROM publications WHERE id = ?', [req.params.id])
		if (!rows[0]) return res.status(404).json({ error: 'Publication introuvable.' })
		const [result] = await db.query('DELETE FROM publications WHERE id = ?', [req.params.id])
		if (result.affectedRows) {
			const fs = require('fs')
			const path = require('path')
			const filePath = path.join(__dirname, rows[0].fichier)
			if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
		}
		res.status(204).send()
	} catch (error) {
		next(error)
	}
}

const activatePublication = async (req, res, next) => {
	try {
		const [rows] = await db.query('SELECT ue_id, annee_id, session_id FROM publications WHERE id = ?', [req.params.id])
		if (!rows[0]) return res.status(404).json({ error: 'Publication introuvable.' })
		await db.query('UPDATE publications SET actif = 0 WHERE ue_id = ? AND annee_id = ? AND session_id = ?', [rows[0].ue_id, rows[0].annee_id, rows[0].session_id])
		await db.query('UPDATE publications SET actif = 1 WHERE id = ?', [req.params.id])
		res.json({ ok: true })
	} catch (error) {
		next(error)
	}
}

// --- PV DÉFINITIFS DE SEMESTRE ---
// Un PV définitif est un PDF unique déposé manuellement par l'admin,
// rattaché à une Filière + un Semestre + une Année (pas de Session).
const listPvSemestres = async (_req, res, next) => {
	try {
		const [rows] = await db.query(`
			SELECT pv.id, pv.filiere_id, pv.specialite_id, pv.semestre_id, pv.annee_id, pv.fichier,
				SUBSTRING_INDEX(pv.fichier, '/', -1) AS nomFichier,
				CONCAT('/uploads/', SUBSTRING_INDEX(pv.fichier, '/', -1)) AS fileUrl,
				pv.commentaire, pv.version, pv.actif, pv.date_publication,
				f.code AS filiere, sp.code AS specialite, se.code AS semestre, se.niveau AS niveau,
				a.libelle AS annee
			FROM pv_semestres pv
			JOIN filieres f ON f.id = pv.filiere_id
			LEFT JOIN specialites sp ON sp.id = pv.specialite_id
			JOIN semestres se ON se.id = pv.semestre_id
			JOIN annees a ON a.id = pv.annee_id
			ORDER BY pv.date_publication DESC, pv.id DESC
		`)
		res.json(rows)
	} catch (error) {
		next(error)
	}
}

const createPvSemestre = async (req, res, next) => {
	try {
		const { filiere_id: filiereId, specialite_id: specialiteIdRaw, semestre_id: semestreId, annee_id: anneeId, commentaire = '' } = req.body
		const specialiteId = specialiteIdRaw === undefined || specialiteIdRaw === '' ? null : specialiteIdRaw
		if (!req.file) return res.status(400).json({ error: 'Aucun fichier PDF n’a été reçu.' })
		if (!filiereId) return res.status(400).json({ error: 'Aucune filière n’est sélectionnée.' })
		if (!semestreId) return res.status(400).json({ error: 'Aucun semestre n’est sélectionné.' })
		if (!anneeId) return res.status(400).json({ error: 'Aucune année n’est sélectionnée.' })

		const [filiereRows] = await db.query('SELECT id FROM filieres WHERE id = ?', [filiereId])
		if (!filiereRows[0]) return res.status(400).json({ error: 'Filière introuvable.' })
		if (specialiteId) {
			const [specialiteRows] = await db.query('SELECT id FROM specialites WHERE id = ?', [specialiteId])
			if (!specialiteRows[0]) return res.status(400).json({ error: 'Spécialité introuvable.' })
		}
		const [semestreRows] = await db.query('SELECT id FROM semestres WHERE id = ?', [semestreId])
		if (!semestreRows[0]) return res.status(400).json({ error: 'Semestre introuvable.' })
		const [anneeRows] = await db.query('SELECT id FROM annees WHERE id = ?', [anneeId])
		if (!anneeRows[0]) return res.status(400).json({ error: 'Année introuvable.' })

		// Versionnement isolé par Filière + Spécialité (NULL = tronc commun) + Semestre + Année.
		const [versions] = await db.query(
			'SELECT COUNT(*) AS total FROM pv_semestres WHERE filiere_id = ? AND specialite_id <=> ? AND semestre_id = ? AND annee_id = ?',
			[filiereId, specialiteId, semestreId, anneeId]
		)
		await db.query(
			'UPDATE pv_semestres SET actif = 0 WHERE filiere_id = ? AND specialite_id <=> ? AND semestre_id = ? AND annee_id = ?',
			[filiereId, specialiteId, semestreId, anneeId]
		)
		const fichier = `uploads/${req.file.filename}`
		const [result] = await db.query(`
			INSERT INTO pv_semestres (filiere_id, specialite_id, semestre_id, annee_id, fichier, commentaire, version, actif)
			VALUES (?, ?, ?, ?, ?, ?, ?, 1)
		`, [filiereId, specialiteId, semestreId, anneeId, fichier, commentaire, versions[0].total + 1])

		const [rows] = await db.query(`
			SELECT pv.id, pv.filiere_id, pv.specialite_id, pv.semestre_id, pv.annee_id, pv.fichier,
				SUBSTRING_INDEX(pv.fichier, '/', -1) AS nomFichier,
				CONCAT('/uploads/', SUBSTRING_INDEX(pv.fichier, '/', -1)) AS fileUrl,
				pv.commentaire, pv.version, pv.actif, pv.date_publication,
				f.code AS filiere, sp.code AS specialite, se.code AS semestre, se.niveau AS niveau,
				a.libelle AS annee
			FROM pv_semestres pv
			JOIN filieres f ON f.id = pv.filiere_id
			LEFT JOIN specialites sp ON sp.id = pv.specialite_id
			JOIN semestres se ON se.id = pv.semestre_id
			JOIN annees a ON a.id = pv.annee_id
			WHERE pv.id = ?
		`, [result.insertId])
		res.status(201).json(rows[0])
	} catch (error) {
		next(error)
	}
}

const deletePvSemestre = async (req, res, next) => {
	try {
		const [rows] = await db.query('SELECT fichier FROM pv_semestres WHERE id = ?', [req.params.id])
		if (!rows[0]) return res.status(404).json({ error: 'PV introuvable.' })
		const [result] = await db.query('DELETE FROM pv_semestres WHERE id = ?', [req.params.id])
		if (result.affectedRows) {
			const fs = require('fs')
			const path = require('path')
			const filePath = path.join(__dirname, rows[0].fichier)
			if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
		}
		res.status(204).send()
	} catch (error) {
		next(error)
	}
}

const activatePvSemestre = async (req, res, next) => {
	try {
		const [rows] = await db.query('SELECT filiere_id, specialite_id, semestre_id, annee_id FROM pv_semestres WHERE id = ?', [req.params.id])
		if (!rows[0]) return res.status(404).json({ error: 'PV introuvable.' })
		await db.query(
			'UPDATE pv_semestres SET actif = 0 WHERE filiere_id = ? AND specialite_id <=> ? AND semestre_id = ? AND annee_id = ?',
			[rows[0].filiere_id, rows[0].specialite_id, rows[0].semestre_id, rows[0].annee_id]
		)
		await db.query('UPDATE pv_semestres SET actif = 1 WHERE id = ?', [req.params.id])
		res.json({ ok: true })
	} catch (error) {
		next(error)
	}
}

const updateCompte = async (req, res, next) => {
	try {
		const { motDePasseActuel, nouvelEmail, nouveauMotDePasse } = req.body
		if (!motDePasseActuel) {
			return res.status(400).json({ error: 'Le mot de passe actuel est requis pour confirmer les changements.' })
		}
		const [rows] = await db.query(
			'SELECT id, email, mot_de_passe_hash FROM administrateurs WHERE id = ? LIMIT 1',
			[req.admin.id]
		)
		if (!rows[0] || !(await bcrypt.compare(motDePasseActuel, rows[0].mot_de_passe_hash))) {
			return res.status(401).json({ error: 'Mot de passe actuel incorrect.' })
		}

		const updates = []
		const values = []
		if (nouvelEmail && nouvelEmail.trim().toLowerCase() !== rows[0].email) {
			updates.push('email = ?')
			values.push(nouvelEmail.trim().toLowerCase())
		}
		if (nouveauMotDePasse) {
			if (nouveauMotDePasse.length < 8) {
				return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' })
			}
			const hash = await bcrypt.hash(nouveauMotDePasse, 10)
			updates.push('mot_de_passe_hash = ?')
			values.push(hash)
		}
		if (!updates.length) {
			return res.status(400).json({ error: 'Aucune modification à enregistrer.' })
		}

		values.push(req.admin.id)
		await db.query(`UPDATE administrateurs SET ${updates.join(', ')} WHERE id = ?`, values)

		const [updatedRows] = await db.query('SELECT id, email FROM administrateurs WHERE id = ?', [req.admin.id])
		res.json(updatedRows[0])
	} catch (error) {
		next(error)
	}
}

module.exports = {
	listResource,
	createResource,
	deleteResource,
	listFilieres,
	listSpecialites,
	listSemestres,
	listUes,
	listPublications,
	createPublication,
	deletePublication,
	activatePublication,
	listPvSemestres,
	createPvSemestre,
	deletePvSemestre,
	activatePvSemestre,
	updateCompte
}
