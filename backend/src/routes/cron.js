// Called by cron-job.org (or anything that knows the secret).
// Not behind JWT login: a robot has no account, so it sends the secret in the "x-cron-secret" header.
const router = require('express').Router()
const crypto = require('crypto')
const { cronSecret } = require('../config')
const { buildReport, formatReport } = require('../jobs/report')

// constant-time comparison, so the secret can't be guessed by timing responses
const sameSecret = (a = '', b = '') => {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && crypto.timingSafeEqual(x, y)
}

// one check for every cron endpoint; returns true when the request may continue
function allowed(req, res) {
  if (!cronSecret) {
    res.status(503).json({ error: 'CRON_SECRET is not set on the server' })
    return false
  }
  if (!sameSecret(req.get('x-cron-secret'), cronSecret)) {
    res.status(401).json({ error: 'Invalid cron secret' })
    return false
  }
  return true
}

async function report(req, res) {
  if (!allowed(req, res)) return

  const result = await buildReport('cron-job.org')
  console.log(formatReport(result))

  // counts only: cron-job.org keeps response bodies for 2 days, so no names or emails go out
  res.json({ ok: true, newStudents: result.newStudents.length, newCourses: result.newCourses.length })
}

// cron-job.org sends GET by default; POST works too
router.route('/report').get(report).post(report)

module.exports = router