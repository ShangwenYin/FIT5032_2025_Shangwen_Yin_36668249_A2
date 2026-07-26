<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers, saveUsers, setCurrentUser, isValidEmail, isStrongPassword } from '@/data'

const router = useRouter()

const form = reactive({ name: '', email: '', password: '', confirmPassword: '', role: 'client' })
const errors = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const submitting = ref(false)
const toastMsg = ref('')
const toastType = ref('info')
const toastVisible = ref(false)

function toast(text, type = 'info') {
  toastMsg.value = text; toastType.value = type; toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 3500)
}

function validate() {
  let valid = true
  errors.name = ''; errors.email = ''; errors.password = ''; errors.confirmPassword = ''

  // BR B.1: Required field + length validation
  if (!form.name) { errors.name = 'Full name is required.'; valid = false }
  else if (form.name.length < 2) { errors.name = 'Name must be at least 2 characters.'; valid = false }

  // BR B.1: Email format validation
  if (!form.email) { errors.email = 'Email is required.'; valid = false }
  else if (!isValidEmail(form.email)) { errors.email = 'Please enter a valid email address.'; valid = false }

  // BR B.1: Password strength validation
  if (!form.password) { errors.password = 'Password is required.'; valid = false }
  else if (!isStrongPassword(form.password)) {
    errors.password = 'Password must be at least 8 characters with at least 1 letter and 1 number.'
    valid = false
  }

  if (!form.confirmPassword) { errors.confirmPassword = 'Please confirm your password.'; valid = false }
  else if (form.password !== form.confirmPassword) { errors.confirmPassword = 'Passwords do not match.'; valid = false }

  return valid
}

function handleRegister() {
  if (!validate()) return
  submitting.value = true

  setTimeout(() => {
    const users = getUsers()

    // BR C.4: Check for duplicate email
    if (users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) {
      errors.email = 'An account with this email already exists.'
      toast('Registration failed. Email already in use.', 'error')
      submitting.value = false
      return
    }

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      name: form.name,
      email: form.email.toLowerCase(),
      password: form.password,
      role: form.role,
      savedResources: [],
      ratings: {},
      ...(form.role === 'counsellor' ? { clients: [] } : {})
    }

    users.push(newUser)
    saveUsers(users)

    // eslint-disable-next-line no-unused-vars
    const { password: _pw, ...safeUser } = newUser
    setCurrentUser(safeUser)
    toast('Account created! Welcome, ' + safeUser.name + '.', 'success')
    setTimeout(() => router.push('/dashboard'), 500)
    submitting.value = false
  }, 500)
}
</script>

<template>
  <div class="container auth-container">
    <!-- Toast -->
    <div class="toast-container">
      <div
        v-if="toastVisible"
        class="custom-toast"
        :class="'toast-' + toastType"
      >
        {{ toastMsg }}
      </div>
    </div>

    <div class="auth-card">
      <h2 class="text-center mb-1">
        Create Account
      </h2>
      <p class="text-center text-muted mb-4">
        Join MindWell Connect and start your wellness journey
      </p>

      <form
        novalidate
        @submit.prevent="handleRegister"
      >
        <div class="mb-3">
          <label
            for="regName"
            class="form-label"
          >Full Name</label>
          <input
            id="regName"
            v-model.trim="form.name"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            placeholder="Your full name"
            autocomplete="name"
            @input="errors.name = ''"
          >
          <div
            v-if="errors.name"
            class="invalid-feedback"
          >
            {{ errors.name }}
          </div>
        </div>

        <div class="mb-3">
          <label
            for="regEmail"
            class="form-label"
          >Email address</label>
          <input
            id="regEmail"
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
            for="regPass"
            class="form-label"
          >Password</label>
          <input
            id="regPass"
            v-model="form.password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            placeholder="Min 8 chars, include a number"
            autocomplete="new-password"
            @input="errors.password = ''"
          >
          <div
            v-if="errors.password"
            class="invalid-feedback"
          >
            {{ errors.password }}
          </div>
        </div>

        <div class="mb-3">
          <label
            for="regPass2"
            class="form-label"
          >Confirm Password</label>
          <input
            id="regPass2"
            v-model="form.confirmPassword"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.confirmPassword }"
            placeholder="Re-enter your password"
            autocomplete="new-password"
            @input="errors.confirmPassword = ''"
          >
          <div
            v-if="errors.confirmPassword"
            class="invalid-feedback"
          >
            {{ errors.confirmPassword }}
          </div>
        </div>

        <!-- BR C.2: Role selection -->
        <div class="mb-4">
          <label class="form-label">I am a...</label>
          <div class="d-flex gap-3">
            <div class="form-check">
              <input
                id="roleClient"
                v-model="form.role"
                value="client"
                type="radio"
                class="form-check-input"
              >
              <label
                for="roleClient"
                class="form-check-label"
              >Client / Community Member</label>
            </div>
            <div class="form-check">
              <input
                id="roleCounsellor"
                v-model="form.role"
                value="counsellor"
                type="radio"
                class="form-check-input"
              >
              <label
                for="roleCounsellor"
                class="form-check-label"
              >Counsellor / Professional</label>
            </div>
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
          {{ submitting ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <p class="text-center mb-0">
        Already have an account? <router-link to="/login">
          Login here
        </router-link>
      </p>
    </div>
  </div>
</template>
