// Mounted at /api and already behind `authenticate` (see server.js)
const router = require('express').Router()
const db = require('../db/repo')
const { authorize } = require('../middleware/auth')
const { reportWindowMinutes } = require('../config')
const { buildReport, getHistory } = require('../jobs/report')

const MAX_WINDOW_MINUTES = 60 * 24 * 30 // never look back more than 30 days

// every logged-in role
router.get('/courses', async (req, res) => res.json({ courses: await db.listCourses() }))

// teacher + admin only
router.post('/courses', authorize('teacher', 'admin'), async (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })
  res.status(201).json({ course: await db.createCourse({ title, teacher_id: req.user.id }) })
})

// admin only
router.get('/users', authorize('admin'), async (req, res) => res.json({ users: await db.listUsers() }))

// reports saved by the scheduled jobs (in memory, lost on restart/sleep)
router.get('/reports', authorize('admin'), (req, res) => res.json({ reports: getHistory() }))

// NEW: report built right now from the database, for the admin dashboard page.
// Works even if the server just woke up, because it does not depend on cron or memory.
// Example: GET /api/reports/live?minutes=60
router.get('/reports/live', authorize('admin'), async (req, res) => {
  const asked = Math.floor(Number(req.query.minutes)) || reportWindowMinutes
  const minutes = Math.min(Math.max(asked, 1), MAX_WINDOW_MINUTES)
  res.json({ report: await buildReport('dashboard', minutes, { remember: false }) })
})

module.exports = router
