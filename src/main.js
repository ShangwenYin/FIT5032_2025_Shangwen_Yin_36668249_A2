import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initialiseData } from './data'
import { seedFirestore } from './data/firestore'
import { seedAuthUsers, bindAuthState } from './data/auth'

// Bootstrap CSS + Icons (BR A.2)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Bootstrap JS (for navbar toggler, dropdowns)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Global styles
import './assets/main.css'

// Initialise localStorage seed data
initialiseData()

// Seed Firestore (resources + sample appointments) — fire and forget
seedFirestore()

// Seed demo accounts into Firebase Auth + keep session in sync (BR D.1)
seedAuthUsers()
bindAuthState()

const app = createApp(App)
app.use(router)
app.mount('#app')
