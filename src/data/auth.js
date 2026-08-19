/**
 * MindWell Connect — Firebase Auth helpers
 * FIT5032 Assignment 3 — BR (D.1) External Authentication
 *
 * Seeds the demo accounts into Firebase Auth on first run, and keeps the
 * Firebase Auth session in sync with the localStorage user profile.
 */
import {
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '@/firebase'
import { SEED_USERS, setCurrentUser } from './index'

// Create the demo accounts in Firebase Auth (idempotent — runs once).
export async function seedAuthUsers() {
  if (localStorage.getItem('mindwell_auth_seeded')) return
  for (const u of SEED_USERS) {
    try {
      await createUserWithEmailAndPassword(auth, u.email, u.password)
    } catch (e) {
      if (e.code !== 'auth/email-already-in-use') {
        console.warn('[auth] seed skipped for', u.email, e.code)
      }
    }
  }
  // Seeding signs us in as the last user — sign out so the app starts logged out.
  await signOut(auth).catch(() => {})
  localStorage.setItem('mindwell_auth_seeded', 'true')
}

// Keep the localStorage session in sync with the Firebase Auth session.
export function bindAuthState() {
  onAuthStateChanged(auth, (user) => {
    if (!user) setCurrentUser(null)
  })
}
