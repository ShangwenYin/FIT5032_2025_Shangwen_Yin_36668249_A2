<script setup>
/**
 * MindWell Connect — Admin Dashboard
 * FIT5032 Assignment 3 — BR (D.3) interactive tables + BR (E.4) export
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import DataTable from '@/components/DataTable.vue'
import { getUsers, RESOURCES } from '@/data'
import { fetchAppointments, fetchResources } from '@/data/firestore'
import { exportToCSV } from '@/utils/export'

const users = computed(() => getUsers())
const appointments = ref([])
const resources = ref([])
const roleCanvas = ref(null)

let roleChart = null

const roleCounts = computed(() => ({
  client: users.value.filter(u => u.role === 'client').length,
  counsellor: users.value.filter(u => u.role === 'counsellor').length,
  admin: users.value.filter(u => u.role === 'admin').length
}))

const roleBadge = role => (
  role === 'admin' ? 'bg-warning text-dark' :
  role === 'counsellor' ? 'bg-success' : 'bg-primary'
)

// ---- Table data (BR D.3) ----
const userColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'saved', label: 'Saved' },
  { key: 'ratings', label: 'Ratings' }
]

const resourceColumns = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'topic', label: 'Topic' },
  { key: 'type', label: 'Type' },
  { key: 'avgRating', label: 'Avg Rating' },
  { key: 'downloads', label: 'Views' }
]

const userRows = computed(() => users.value.map(u => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  saved: (u.savedResources || []).length,
  ratings: u.ratings ? Object.keys(u.ratings).length : 0
})))

// ---- Export (BR E.4) ----
function exportUsers() {
  exportToCSV(userRows.value, userColumns, 'mindwell-users.csv')
}

function exportResources() {
  exportToCSV(resources.value, resourceColumns, 'mindwell-resources.csv')
}

function renderRoleChart() {
  if (!roleCanvas.value) return
  if (roleChart) roleChart.destroy()
  roleChart = new Chart(roleCanvas.value, {
    type: 'doughnut',
    data: {
      labels: ['Clients', 'Counsellors', 'Admins'],
      datasets: [{
        data: [roleCounts.value.client, roleCounts.value.counsellor, roleCounts.value.admin],
        backgroundColor: ['#1a73e8', '#34a853', '#f9ab00']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '60%' }
  })
}

onMounted(async () => {
  appointments.value = await fetchAppointments()
  resources.value = await fetchResources()
  renderRoleChart()
})

onUnmounted(() => { if (roleChart) roleChart.destroy() })
</script>

<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-1">
      Admin Dashboard
    </h2>
    <p class="text-muted mb-4">
      System overview for the MindWell Connect health charity.
    </p>

    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div class="stat-value">
            {{ users.length }}
          </div>
          <div class="stat-label">
            Total Users
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div
            class="stat-value"
            style="color: var(--mw-secondary);"
          >
            {{ roleCounts.counsellor }}
          </div>
          <div class="stat-label">
            Counsellors
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div
            class="stat-value"
            style="color: var(--mw-warm);"
          >
            {{ appointments.length }}
          </div>
          <div class="stat-label">
            Appointments
          </div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="stat-card">
          <div class="stat-value">
            {{ RESOURCES.length }}
          </div>
          <div class="stat-label">
            Resources
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-4">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-white fw-bold">
            User Composition
          </div>
          <div
            class="card-body"
            style="height: 300px;"
          >
            <canvas ref="roleCanvas" />
          </div>
        </div>
      </div>

      <div class="col-lg-8">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
            <span>All Users</span>
            <button
              class="btn btn-mw-outline btn-sm"
              @click="exportUsers"
            >
              <i class="bi bi-download" aria-hidden="true" /> Export CSV
            </button>
          </div>
          <div class="card-body">
            <DataTable
              :columns="userColumns"
              :data="userRows"
            >
              <template #cell-role="{ value }">
                <span
                  class="badge"
                  :class="roleBadge(value)"
                >{{ value }}</span>
              </template>
            </DataTable>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm mt-4">
      <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
        <span>Resource Library (Firestore)</span>
        <button
          class="btn btn-mw-outline btn-sm"
          @click="exportResources"
        >
          <i class="bi bi-download" aria-hidden="true" /> Export CSV
        </button>
      </div>
      <div class="card-body">
        <DataTable
          :columns="resourceColumns"
          :data="resources"
        />
      </div>
    </div>
  </div>
</template>
