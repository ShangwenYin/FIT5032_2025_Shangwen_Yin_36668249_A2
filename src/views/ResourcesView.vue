<script setup>
import { ref, computed, watch } from 'vue'
import { RESOURCES, getRatings, getCurrentUser, getUsers, saveUsers, setCurrentUser, calculateAverage } from '@/data'

const searchQuery = ref('')
const filterCategory = ref('')
const filterTopic = ref('')
const filterLevel = ref('')
const filterType = ref('')
const currentPage = ref(1)
const perPage = 6
const savedResources = ref([])

// Reset page on filter change
watch([searchQuery, filterCategory, filterTopic, filterLevel, filterType], () => { currentPage.value = 1 })

// BR B.2: Dynamic data from JS data structure
const resources = computed(() => {
  const ratings = getRatings()
  return RESOURCES.map(r => ({
    ...r,
    avgRating: calculateAverage(ratings[r.id] || r.ratings),
    ratingCount: (ratings[r.id] || r.ratings).length
  }))
})

const categories = computed(() => [...new Set(RESOURCES.map(r => r.category))].sort())
const topics = computed(() => [...new Set(RESOURCES.map(r => r.topic))].sort())
const levels = ['Beginner', 'Intermediate', 'Advanced', 'All']
const types = computed(() => [...new Set(RESOURCES.map(r => r.type))].sort())

// BR B.2: Dynamic filtering from JS data structures
const filtered = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return resources.value.filter(r => {
    if (q && !r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false
    if (filterCategory.value && r.category !== filterCategory.value) return false
    if (filterTopic.value && r.topic !== filterTopic.value) return false
    if (filterLevel.value && r.level !== filterLevel.value) return false
    if (filterType.value && r.type !== filterType.value) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage) || 1)

const paginated = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

function loadSaved() {
  const user = getCurrentUser()
  savedResources.value = user ? (user.savedResources || []) :
    JSON.parse(localStorage.getItem('mindwell_guest_saved') || '[]')
}
loadSaved()

function isSaved(id) { return savedResources.value.includes(id) }

function toggleSave(id) {
  const idx = savedResources.value.indexOf(id)
  if (idx === -1) savedResources.value.push(id)
  else savedResources.value.splice(idx, 1)

  const user = getCurrentUser()
  if (user) {
    const users = getUsers()
    const u = users.find(u2 => u2.id === user.id)
    if (u) { u.savedResources = savedResources.value; saveUsers(users); setCurrentUser({ ...u, password: undefined }) }
  } else {
    localStorage.setItem('mindwell_guest_saved', JSON.stringify(savedResources.value))
  }
}
</script>

<template>
  <div class="container py-4">
    <h2 class="fw-bold">
      Resources &amp; Self-Help Library
    </h2>
    <p class="text-muted mb-4">
      Explore our collection of evidence-based mental health resources
    </p>

    <!-- Search + Filters (BR B.2) -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Search resources..."
            >
          </div>
          <div class="col-md-2">
            <select
              v-model="filterCategory"
              class="form-select"
            >
              <option value="">
                All Categories
              </option>
              <option
                v-for="c in categories"
                :key="c"
                :value="c"
              >
                {{ c }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <select
              v-model="filterTopic"
              class="form-select"
            >
              <option value="">
                All Topics
              </option>
              <option
                v-for="t in topics"
                :key="t"
                :value="t"
              >
                {{ t }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <select
              v-model="filterLevel"
              class="form-select"
            >
              <option value="">
                All Levels
              </option>
              <option
                v-for="l in levels"
                :key="l"
                :value="l"
              >
                {{ l }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <select
              v-model="filterType"
              class="form-select"
            >
              <option value="">
                All Types
              </option>
              <option
                v-for="t in types"
                :key="t"
                :value="t"
              >
                {{ t }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <p
      v-if="filtered.length !== resources.length"
      class="text-muted mb-3"
    >
      Showing {{ filtered.length }} of {{ resources.length }} resources
    </p>

    <!-- Grid -->
    <div class="row g-4">
      <div
        v-for="r in paginated"
        :key="r.id"
        class="col-md-6 col-lg-4"
      >
        <div class="resource-card h-100">
          <img
            :src="r.image"
            :alt="r.title"
            class="card-img-top"
            loading="lazy"
          >
          <div class="card-body d-flex flex-column">
            <div class="mb-2">
              <span
                class="resource-type-badge me-1"
                :class="'badge-' + r.type"
              >{{ r.type }}</span>
              <span class="badge bg-light text-dark me-1">{{ r.topic }}</span>
              <span class="badge bg-light text-dark">{{ r.level }}</span>
            </div>
            <h5 class="card-title fs-6">
              {{ r.title }}
            </h5>
            <p class="card-text small text-muted">
              {{ r.description }}
            </p>
            <div class="mt-auto">
              <!-- BR C.3: Aggregated rating -->
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="rating-stars readonly">
                  <span
                    v-for="s in 5"
                    :key="s"
                    class="star"
                    :class="{ filled: s <= Math.round(r.avgRating) }"
                  >&#9733;</span>
                  <small class="ms-1 text-muted">{{ r.avgRating }} ({{ r.ratingCount }})</small>
                </span>
                <small class="text-muted">{{ r.downloads }} views</small>
              </div>
              <div class="d-flex gap-2">
                <router-link
                  :to="'/resources/' + r.id"
                  class="btn btn-mw btn-sm flex-grow-1"
                >
                  View Details
                </router-link>
                <button
                  class="btn btn-mw-outline btn-sm"
                  :title="isSaved(r.id) ? 'Remove' : 'Save'"
                  @click="toggleSave(r.id)"
                >
                  {{ isSaved(r.id) ? '&#10084;' : '&#9825;' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="paginated.length === 0"
        class="col-12"
      >
        <div class="text-center py-5 text-muted">
          <p class="display-4 mb-3">
            &#x1F50D;
          </p>
          <h5>No resources found</h5>
          <p>Try adjusting your search or filters.</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <nav
      v-if="totalPages > 1"
      class="mt-4"
    >
      <ul class="pagination justify-content-center">
        <li
          class="page-item"
          :class="{ disabled: currentPage === 1 }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="currentPage--"
          >&laquo; Prev</a>
        </li>
        <li
          v-for="p in totalPages"
          :key="p"
          class="page-item"
          :class="{ active: p === currentPage }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="currentPage = p"
          >{{ p }}</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: currentPage === totalPages }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="currentPage++"
          >Next &raquo;</a>
        </li>
      </ul>
      <p class="text-center text-muted small">
        Page {{ currentPage }} of {{ totalPages }}
      </p>
    </nav>
  </div>
</template>
