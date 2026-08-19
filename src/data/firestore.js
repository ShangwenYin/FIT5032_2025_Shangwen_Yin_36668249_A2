/**
 * MindWell Connect — Firestore Data Layer
 * FIT5032 Assignment 3
 *
 * Handles seeding and CRUD against Firestore for:
 *   - resources   (aggregated stats used by interactive charts)
 *   - appointments (calendar booking + conflict management)
 *
 * All functions degrade gracefully offline by returning [] / logging a warning,
 * so the app keeps working when Firestore is unreachable.
 */
import { db } from '@/firebase'
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore'
import { RESOURCES, calculateAverage } from './index'

// ============================================================
// Seed (idempotent — run on app boot)
// ============================================================

export async function seedResources() {
  try {
    const snapshot = await getDocs(collection(db, 'resources'))
    if (!snapshot.empty) return
    for (const r of RESOURCES) {
      await setDoc(doc(db, 'resources', String(r.id)), {
        id: r.id,
        title: r.title,
        category: r.category,
        topic: r.topic,
        level: r.level,
        type: r.type,
        downloads: r.downloads,
        avgRating: calculateAverage(r.ratings),
        ratingCount: r.ratings.length
      })
    }
  } catch (e) {
    console.warn('[firestore] seedResources skipped:', e.message)
  }
}

export async function seedAppointments() {
  try {
    const snapshot = await getDocs(collection(db, 'appointments'))
    if (!snapshot.empty) return
    const now = new Date()
    const at = (daysAhead, hour, min = 0) => {
      const d = new Date(now)
      d.setDate(d.getDate() + daysAhead)
      d.setHours(hour, min, 0, 0)
      return d.toISOString()
    }
    const samples = [
      {
        id: 'apt-1', clientId: 1, clientName: 'Sarah Chen',
        counsellorId: 3, counsellorName: 'Dr. Priya Sharma',
        title: 'Anxiety Check-in — Sarah Chen',
        start: at(1, 10), end: at(1, 10, 50), status: 'confirmed'
      },
      {
        id: 'apt-2', clientId: 2, clientName: 'Michael Torres',
        counsellorId: 3, counsellorName: 'Dr. Priya Sharma',
        title: 'CBT Progress Review — Michael Torres',
        start: at(2, 14), end: at(2, 14, 50), status: 'confirmed'
      },
      {
        id: 'apt-3', clientId: 4, clientName: 'James Liu',
        counsellorId: 3, counsellorName: 'Dr. Priya Sharma',
        title: 'Initial Consultation — James Liu',
        start: at(4, 11), end: at(4, 11, 50), status: 'pending'
      }
    ]
    for (const a of samples) {
      await setDoc(doc(db, 'appointments', a.id), a)
    }
  } catch (e) {
    console.warn('[firestore] seedAppointments skipped:', e.message)
  }
}

// Fire-and-forget seed, safe to call from main.js without awaiting.
export function seedFirestore() {
  seedResources()
  seedAppointments()
}

// ============================================================
// Reads
// ============================================================

export async function fetchResources() {
  try {
    const snapshot = await getDocs(collection(db, 'resources'))
    return snapshot.docs.map(d => d.data())
  } catch (e) {
    console.warn('[firestore] fetchResources failed:', e.message)
    return []
  }
}

export async function fetchAppointments() {
  try {
    const snapshot = await getDocs(collection(db, 'appointments'))
    return snapshot.docs.map(d => d.data())
  } catch (e) {
    console.warn('[firestore] fetchAppointments failed:', e.message)
    return []
  }
}

// ============================================================
// Writes
// ============================================================

export async function createAppointment(appt) {
  await setDoc(doc(db, 'appointments', appt.id), appt)
}

export async function removeAppointment(id) {
  await deleteDoc(doc(db, 'appointments', id))
}

// ============================================================
// Booking conflict management (BR: booking constraint)
// ============================================================

// Two appointments conflict when their time ranges overlap: startA < endB && endA > startB
export function hasConflict(appointments, start, end, ignoreId = null) {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  return appointments.some(a => {
    if (ignoreId && a.id === ignoreId) return false
    const as = new Date(a.start).getTime()
    const ae = new Date(a.end).getTime()
    return s < ae && e > as
  })
}
