/**
 * MindWell Connect — Serverless Assessment API (Cloudflare Worker)
 * FIT5032 Assignment 3 — BR (E.1) Cloud Functions
 *
 * A self-designed serverless function that scores a GAD-7 anxiety
 * self-assessment on the server side and returns the severity level
 * plus a tailored recommendation.
 *
 * Endpoints:
 *   GET  /api/health  -> health check
 *   POST /api/assess  -> body: { answers: [7 numbers 0-3] }
 *                      -> { score, level, recommendation }
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
  })
}

function assess(answers) {
  const score = answers.reduce((sum, a) => sum + Number(a), 0)

  if (score <= 4) {
    return {
      score,
      level: 'Minimal anxiety',
      recommendation:
        'Your anxiety levels appear within a normal range. Continue practicing regular self-care, ' +
        'exercise, and healthy sleep habits to maintain your wellbeing.'
    }
  }
  if (score <= 9) {
    return {
      score,
      level: 'Mild anxiety',
      recommendation:
        'You may be experiencing mild anxiety. Consider trying our guided breathing exercise and ' +
        'CBT techniques in the resource library, and monitor how you feel over the next two weeks.'
    }
  }
  if (score <= 14) {
    return {
      score,
      level: 'Moderate anxiety',
      recommendation:
        'You are experiencing moderate anxiety. We recommend scheduling an appointment with one of ' +
        'our counsellors and exploring the self-help resources on MindWell Connect.'
    }
  }
  return {
    score,
    level: 'Severe anxiety',
    recommendation:
      'Your responses suggest significant anxiety. Please reach out to a counsellor promptly. ' +
      'If you are in distress, contact Lifeline on 13 11 14 or Emergency 000.'
  }
}

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    const url = new URL(request.url)

    if (url.pathname === '/api/health' && request.method === 'GET') {
      return json({ status: 'ok', service: 'MindWell Assessment API' })
    }

    if (url.pathname === '/api/assess' && request.method === 'POST') {
      try {
        const body = await request.json()
        const answers = body.answers
        if (!Array.isArray(answers) || answers.length !== 7) {
          return json({ error: 'answers must be an array of 7 numbers (0-3)' }, 400)
        }
        if (answers.some(a => typeof a !== 'number' || a < 0 || a > 3)) {
          return json({ error: 'each answer must be a number between 0 and 3' }, 400)
        }
        return json(assess(answers))
      } catch (e) {
        return json({ error: 'invalid JSON body' }, 400)
      }
    }

    return json({ error: 'not found' }, 404)
  }
}
