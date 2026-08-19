/**
 * MindWell Connect — Firebase / Firestore Initialisation
 * FIT5032 Assignment 3
 *
 * NOTE: The Firebase API key is NOT a secret. It is a public identifier
 * that points at this specific Firebase project. Access control is enforced
 * by Firestore Security Rules, not by hiding the key.
 */
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAq9XuGHHlDeo_xFb_3RjHMTSj5wLnfsCo',
  authDomain: 'mindwell-connect-40b9d.firebaseapp.com',
  projectId: 'mindwell-connect-40b9d',
  storageBucket: 'mindwell-connect-40b9d.firebasestorage.app',
  messagingSenderId: '1095202662316',
  appId: '1:1095202662316:web:5cec8a781a00e3df8d7c09'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { app, db }
