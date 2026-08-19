<script setup>
/**
 * MindWell Connect — Admin Dashboard
 * FIT5032 Assignment 3 — extended feature #3
 *
 * Overview for the charity's system admin: number of users, breakdown by
 * role, resources, and booked appointments.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import { getUsers, RESOURCES } from '@/data'
import { fetchAppointments } from '@/data/firestore'

const users = computed(() => getUsers())
const appointments = ref([])
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
      <div class="col-lg-5">
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

      <div class="col-lg-7">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-white fw-bold">
            All Users
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0 align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Saved</th>
                    <th>Ratings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="u in users"
                    :key="u.id"
                  >
                    <td class="fw-medium">
                      {{ u.name }}
                    </td>
                    <td class="text-muted small">
                      {{ u.email }}
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="roleBadge(u.role)"
                      >{{ u.role }}</span>
                    </td>
                    <td>{{ (u.savedResources || []).length }}</td>
                    <td>{{ u.ratings ? Object.keys(u.ratings).length : 0 }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
