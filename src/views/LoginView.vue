<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUsers, setCurrentUser, isValidEmail } from '@/data'

const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const submitting = ref(false)
const showToast = ref(false)
const toastMsg = ref('')
const toastType = ref('info')

function toast(text, type = 'info') {
  toastMsg.value = text
  toastType.value = type
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

function validate() {
  let valid = true
  errors.email = ''
  errors.password = ''

  // BR B.1: Required field validation
  if (!form.email) { errors.email = 'Email is required.'; valid = false }
  // BR B.1: Email format validation
  else if (!isValidEmail(form.email)) { errors.email = 'Please enter a valid email address.'; valid = false }

  if (!form.password) { errors.password = 'Password is required.'; valid = false }

  return valid
}

function handleLogin() {
  if (!validate()) return
  submitting.value = true

  setTimeout(() => {
    const users = getUsers()
    const user = users.find(u =>
      u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password
    )

    if (user) {
      // eslint-disable-next-line no-unused-vars
      const { password: _pw, ...safeUser } = user
      setCurrentUser(safeUser)
      toast('Login successful! Welcome back, ' + safeUser.name + '.', 'success')
      const redirect = route.query.redirect || '/dashboard'
      setTimeout(() => router.push(redirect), 500)
    } else {
      errors.email = 'Invalid email or password.'
      toast('Login failed. Please check your credentials.', 'error')
    }
    submitting.value = false
  }, 500)
}
</script>

<template>
  <div class="container auth-container">
    <!-- Toast -->
    <div class="toast-container">
      <div
        v-if="showToast"
        class="custom-toast"
        :class="'toast-' + toastType"
      >
        <span v-if="toastType === 'success'"><i class="bi bi-check-circle-fill text-success" /></span>
        <span v-else-if="toastType === 'error'"><i class="bi bi-x-circle-fill text-danger" /></span>
        <span v-else><i class="bi bi-info-circle-fill text-primary" /></span>
        {{ toastMsg }}
      </div>
    </div>

    <div class="auth-card">
      <h2 class="text-center mb-1">
        Welcome Back
      </h2>
      <p class="text-center text-muted mb-4">
        Login to your MindWell Connect account
      </p>

      <form
        novalidate
        @submit.prevent="handleLogin"
      >
        <div class="mb-3">
          <label
            for="loginEmail"
            class="form-label"
          >Email address</label>
          <input
            id="loginEmail"
            v-model.trim="form.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            placeholder="you@example.com"
            autocomplete="email"
            @input="errors.email = ''"
          >
          <div
            v-if="errors.email"
            class="invalid-feedback"
          >
            {{ errors.email }}
          </div>
        </div>

        <div class="mb-3">
          <label
            for="loginPassword"
            class="form-label"
          >Password</label>
          <input
            id="loginPassword"
            v-model="form.password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            placeholder="Enter your password"
            autocomplete="current-password"
            @input="errors.password = ''"
          >
          <div
            v-if="errors.password"
            class="invalid-feedback"
          >
            {{ errors.password }}
          </div>
        </div>

        <button
          type="submit"
          class="btn btn-mw w-100 py-2 mb-3"
          :disabled="submitting"
        >
          <span
            v-if="submitting"
            class="spinner-border spinner-border-sm me-2"
          />
          {{ submitting ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="text-center mb-0">
        Don't have an account? <router-link to="/register">
          Register here
        </router-link>
      </p>

      <hr class="my-4">
      <p class="text-center text-muted small mb-0">
        <strong>Demo Accounts:</strong><br>
        Client: <code>sarah@example.com</code> / <code>Password1</code><br>
        Counsellor: <code>dr.sharma@mindwell.org</code> / <code>Counsellor1</code>
      </p>
    </div>
  </div>
</template>
