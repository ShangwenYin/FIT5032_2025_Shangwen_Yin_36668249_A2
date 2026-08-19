<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCurrentUser, setCurrentUser } from '@/data'
import { useOnline } from '@/composables/useOnline'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'

const router = useRouter()
const route = useRoute()
const currentUser = ref(getCurrentUser())
const { isOnline } = useOnline()

watch(() => route.fullPath, () => {
  currentUser.value = getCurrentUser()
})

async function logout() {
  await signOut(auth).catch(() => {})
  setCurrentUser(null)
  currentUser.value = null
  router.push('/')
}
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Skip link (BR E.3 accessibility) -->
    <a
      href="#main-content"
      class="skip-link"
    >Skip to main content</a>

    <!-- Crisis Banner -->
    <div class="crisis-banner">
      If you're in crisis, help is available &mdash;
      <a href="tel:131114">Lifeline 13 11 14</a> |
      <a href="tel:000">Emergency 000</a> |
      <a
        href="https://www.lifeline.org.au/crisis-chat"
        target="_blank"
        rel="noopener"
      >Crisis Chat</a>
    </div>

    <!-- Offline Banner (BR: online/offline detection) -->
    <div
      v-if="!isOnline"
      class="offline-banner"
    >
      <i class="bi bi-wifi-off" aria-hidden="true" /> You are offline &mdash; bookings will be queued and synced when you reconnect.
    </div>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
      <div class="container">
        <router-link
          class="navbar-brand"
          to="/"
        >
          <span class="brand-icon">MW</span>MindWell Connect
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div
          id="mainNav"
          class="collapse navbar-collapse"
        >
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/"
              >
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/resources"
              >
                Resources
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link"
                to="/map"
              >
                Find Support
              </router-link>
            </li>
            <li
              v-if="currentUser"
              class="nav-item"
            >
              <router-link
                class="nav-link"
                to="/dashboard"
              >
                Dashboard
              </router-link>
            </li>
            <li
              v-if="currentUser"
              class="nav-item"
            >
              <router-link
                class="nav-link"
                to="/appointments"
              >
                Appointments
              </router-link>
            </li>
            <li
              v-if="currentUser"
              class="nav-item"
            >
              <router-link
                class="nav-link"
                to="/insights"
              >
                Insights
              </router-link>
            </li>
            <li
              v-if="currentUser"
              class="nav-item"
            >
              <router-link
                class="nav-link"
                to="/email"
              >
                Send Email
              </router-link>
            </li>
            <li
              v-if="currentUser && currentUser.role === 'admin'"
              class="nav-item"
            >
              <router-link
                class="nav-link"
                to="/admin"
              >
                Admin
              </router-link>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto">
            <li class="nav-item me-2">
              <a
                class="btn btn-danger btn-sm rounded-pill fw-bold"
                href="tel:131114"
              >
                <i class="bi bi-exclamation-triangle-fill" aria-hidden="true" /> Crisis Help
              </a>
            </li>
            <template v-if="!currentUser">
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  to="/login"
                >
                  Login
                </router-link>
              </li>
              <li class="nav-item ms-2">
                <router-link
                  class="btn btn-mw btn-sm"
                  to="/register"
                >
                  Register
                </router-link>
              </li>
            </template>
            <template v-else>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="bi bi-person-circle" aria-hidden="true" /> {{ currentUser.name }}
                  <span
                    class="badge ms-1"
                    :class="currentUser.role === 'counsellor' ? 'bg-success' : 'bg-primary'"
                  >
                    {{ currentUser.role }}
                  </span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <router-link
                      class="dropdown-item"
                      to="/dashboard"
                    >
                      Dashboard
                    </router-link>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a
                      class="dropdown-item text-danger"
                      href="#"
                      @click.prevent="logout"
                    >Logout</a>
                  </li>
                </ul>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main -->
    <main
      id="main-content"
      class="flex-grow-1"
      tabindex="-1"
    >
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="container text-center">
        <p class="mb-1">
          &copy; 2026 MindWell Connect. A health charity dedicated to mental wellbeing.
        </p>
        <p class="mb-0 small">
          Student project for FIT5032. Not a real medical service.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.nav-link { font-weight: 500; }
</style>
