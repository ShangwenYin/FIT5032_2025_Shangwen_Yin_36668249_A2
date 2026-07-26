<script setup>
import { ref, computed, watch } from 'vue'
import { RESOURCES, getRatings, saveRatings, getCurrentUser, getUsers, saveUsers, setCurrentUser, calculateAverage } from '@/data'

const props = defineProps({ id: { type: [String, Number], default: null } })

const userRating = ref(0)
const avgRating = ref(0)
const ratingCount = ref(0)
const isSaved = ref(false)
const toastMsg = ref('')
const toastVisible = ref(false)

function toast(text) { toastMsg.value = text; toastVisible.value = true; setTimeout(() => { toastVisible.value = false }, 2500) }

const resourceId = computed(() => parseInt(props.id))
const resource = computed(() => RESOURCES.find(r => r.id === resourceId.value) || null)

function loadRatings() {
  if (!resource.value) return
  const ratings = getRatings()
  const all = ratings[resource.value.id] || resource.value.ratings
  avgRating.value = calculateAverage(all)
  ratingCount.value = all.length

  const user = getCurrentUser()
  if (user) {
    userRating.value = (user.ratings && user.ratings[resource.value.id]) || 0
    isSaved.value = (user.savedResources || []).includes(resource.value.id)
  }
}

watch(resource, loadRatings, { immediate: true })

// BR C.3: Rate resource
function rate(stars) {
  const user = getCurrentUser()
  if (!user) { toast('Please login to rate resources.'); return }

  const ratings = getRatings()
  if (!ratings[resource.value.id]) ratings[resource.value.id] = []
  const users = getUsers()
  const u = users.find(u2 => u2.id === user.id)
  if (!u) return
  if (!u.ratings) u.ratings = {}

  // Remove old rating
  if (u.ratings[resource.value.id]) {
    const idx = ratings[resource.value.id].indexOf(u.ratings[resource.value.id])
    if (idx !== -1) ratings[resource.value.id].splice(idx, 1)
  }

  // Add new rating
  ratings[resource.value.id].push(stars)
  u.ratings[resource.value.id] = stars
  saveRatings(ratings)
  saveUsers(users)
  setCurrentUser({ ...u, password: undefined })

  userRating.value = stars
  avgRating.value = calculateAverage(ratings[resource.value.id])
  ratingCount.value = ratings[resource.value.id].length
  toast('Rating submitted! Thank you.')
}

function toggleSave() {
  const user = getCurrentUser()
  if (!user) { toast('Please login to save resources.'); return }
  const users = getUsers()
  const u = users.find(u2 => u2.id === user.id)
  if (!u) return
  if (!u.savedResources) u.savedResources = []

  const idx = u.savedResources.indexOf(resource.value.id)
  if (idx === -1) { u.savedResources.push(resource.value.id); toast('Resource saved!') }
  else { u.savedResources.splice(idx, 1); toast('Removed from saved.') }
  isSaved.value = idx === -1
  saveUsers(users)
  setCurrentUser({ ...u, password: undefined })
}
</script>

<template>
  <div class="container py-4">
    <div
      v-if="toastVisible"
      class="toast-container"
    >
      <div class="custom-toast toast-success">
        {{ toastMsg }}
      </div>
    </div>

    <template v-if="resource">
      <nav
        aria-label="breadcrumb"
        class="mb-3"
      >
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/resources">
              Resources
            </router-link>
          </li>
          <li class="breadcrumb-item active">
            {{ resource.title }}
          </li>
        </ol>
      </nav>

      <div class="card shadow-sm mb-4">
        <div class="row g-0">
          <div class="col-md-5">
            <img
              :src="resource.image"
              :alt="resource.title"
              class="img-fluid rounded-start h-100"
              style="object-fit: cover;"
            >
          </div>
          <div class="col-md-7">
            <div class="card-body">
              <span
                class="resource-type-badge me-2"
                :class="'badge-' + resource.type"
              >{{ resource.type }}</span>
              <span class="badge bg-light text-dark me-2">{{ resource.topic }}</span>
              <span class="badge bg-light text-dark">{{ resource.level }}</span>
              <h2 class="mt-2 mb-3">
                {{ resource.title }}
              </h2>
              <p class="text-muted">
                {{ resource.description }}
              </p>
              <p class="text-muted small">
                {{ resource.downloads }} views &middot; {{ resource.category }}
              </p>

              <!-- Rating (BR C.3) -->
              <div class="card bg-light border-0 p-3">
                <h6 class="mb-2">
                  Rate this resource
                </h6>
                <div class="d-flex align-items-center gap-3">
                  <span
                    class="rating-stars"
                    :class="{ readonly: !getCurrentUser() }"
                  >
                    <span
                      v-for="s in 5"
                      :key="s"
                      class="star"
                      :class="{ filled: s <= userRating }"
                      @click="rate(s)"
                    >&#9733;</span>
                  </span>
                  <span
                    v-if="userRating"
                    class="fw-bold"
                  >Your rating: {{ userRating }}/5</span>
                  <span
                    v-else-if="getCurrentUser()"
                    class="text-muted"
                  >Click to rate</span>
                  <span
                    v-else
                    class="text-muted"
                  >Login to rate</span>
                </div>
                <div class="mt-2">
                  <strong>Average:</strong>
                  <span class="rating-stars readonly ms-1">
                    <span
                      v-for="s in 5"
                      :key="s"
                      class="star"
                      :class="{ filled: s <= Math.round(avgRating) }"
                    >&#9733;</span>
                  </span>
                  <span class="ms-1 fw-bold">{{ avgRating }}/5</span>
                  <small class="text-muted ms-1">({{ ratingCount }} ratings)</small>
                </div>
              </div>

              <div class="d-flex gap-2 mt-3">
                <button
                  class="btn btn-mw"
                  @click="toggleSave"
                >
                  {{ isSaved ? '&#10084; Saved' : '&#9825; Save' }}
                </button>
                <router-link
                  to="/resources"
                  class="btn btn-mw-outline"
                >
                  Back to Resources
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm p-4">
        <h4>About this resource</h4>
        <p style="white-space: pre-line;">
          {{ resource.content }}
        </p>
      </div>
    </template>

    <div
      v-else
      class="text-center py-5"
    >
      <div class="display-4 mb-3">
        &#x1F50D;
      </div>
      <h4>Resource not found</h4>
      <router-link
        to="/resources"
        class="btn btn-mw mt-3"
      >
        Browse Resources
      </router-link>
    </div>
  </div>
</template>
