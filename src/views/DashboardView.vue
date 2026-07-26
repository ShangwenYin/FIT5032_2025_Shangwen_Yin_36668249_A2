<script setup>
import { computed } from 'vue'
import { getCurrentUser, getUsers, RESOURCES, getRatings, calculateAverage } from '@/data'

const user = computed(() => getCurrentUser())
</script>

<template>
  <div>
    <template v-if="user && user.role === 'client'">
      <div class="container py-4">
        <h2 class="fw-bold mb-1">
          Welcome back, {{ user.name }}!
        </h2>
        <p class="text-muted mb-4">
          Client Dashboard &middot; Your wellness journey at a glance
        </p>

        <div class="row g-3 mb-4">
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div class="stat-value">
                {{ (user.savedResources || []).length }}
              </div><div class="stat-label">
                Saved Resources
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div
                class="stat-value"
                style="color: var(--mw-secondary);"
              >
                {{ user.ratings ? Object.keys(user.ratings).length : 0 }}
              </div><div class="stat-label">
                Ratings Given
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div
                class="stat-value"
                style="color: var(--mw-warm);"
              >
                2
              </div><div class="stat-label">
                Upcoming Appointments
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div class="stat-value">
                {{ RESOURCES.length }}
              </div><div class="stat-label">
                Total Resources
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- Saved Resources (BR B.2 - localStorage) -->
          <div class="col-lg-6">
            <div class="card shadow-sm h-100">
              <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
                Saved Resources
                <router-link
                  to="/resources"
                  class="btn btn-mw-outline btn-sm"
                >
                  Browse More
                </router-link>
              </div>
              <div class="card-body">
                <div
                  v-if="(user.savedResources || []).length === 0"
                  class="text-center py-4 text-muted"
                >
                  <p class="mb-2">
                    No saved resources yet.
                  </p>
                  <router-link
                    to="/resources"
                    class="btn btn-mw btn-sm"
                  >
                    Explore Resources
                  </router-link>
                </div>
                <div
                  v-else
                  class="list-group list-group-flush"
                >
                  <div
                    v-for="rid in user.savedResources"
                    :key="rid"
                    class="list-group-item px-0 d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <template
                        v-for="r in RESOURCES.filter(x => x.id === rid)"
                        :key="r.id"
                      >
                        <span
                          class="resource-type-badge me-2"
                          :class="'badge-' + r.type"
                        >{{ r.type }}</span>
                        <router-link
                          :to="'/resources/' + r.id"
                          class="text-decoration-none"
                        >
                          {{ r.title }}
                        </router-link>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="col-lg-6">
            <div class="card shadow-sm h-100">
              <div class="card-header bg-white fw-bold">
                Recommended Next Steps
              </div>
              <div class="card-body">
                <div class="mb-3 p-3 bg-light rounded-3">
                  <h6>Complete a Self-Assessment</h6>
                  <p class="text-muted small mb-2">
                    Track your anxiety levels with our GAD-7 based worksheet.
                  </p>
                  <router-link
                    to="/resources/5"
                    class="btn btn-mw-outline btn-sm"
                  >
                    Start Assessment
                  </router-link>
                </div>
                <div class="mb-3 p-3 bg-light rounded-3">
                  <h6>Try Guided Breathing</h6>
                  <p class="text-muted small mb-2">
                    A 10-minute exercise to reduce stress and centre your mind.
                  </p>
                  <router-link
                    to="/resources/3"
                    class="btn btn-mw-outline btn-sm"
                  >
                    Start Exercise
                  </router-link>
                </div>
                <div class="p-3 bg-light rounded-3">
                  <h6>Join a Support Group</h6>
                  <p class="text-muted small mb-0">
                    Connect with others who understand. Groups meet weekly online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="user && user.role === 'counsellor'">
      <div class="container py-4">
        <h2 class="fw-bold mb-1">
          Counsellor Dashboard
        </h2>
        <p class="text-muted mb-4">
          Welcome, Dr. {{ user.name }} &middot; {{ new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
        </p>

        <div class="row g-3 mb-4">
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div class="stat-value">
                {{ (user.clients || []).length }}
              </div><div class="stat-label">
                Total Clients
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div
                class="stat-value"
                style="color: var(--mw-secondary);"
              >
                {{ (user.clients || []).length }}
              </div><div class="stat-label">
                Active This Week
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div
                class="stat-value"
                style="color: var(--mw-warm);"
              >
                {{ Object.values(getRatings()).reduce((s, a) => s + a.length, 0) }}
              </div><div class="stat-label">
                Total Ratings
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card">
              <div class="stat-value">
                {{ RESOURCES.length }}
              </div><div class="stat-label">
                Resources
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- Client List (BR C.2 - assigned only) -->
          <div class="col-lg-7">
            <div class="card shadow-sm">
              <div class="card-header bg-white fw-bold">
                Client Management
              </div>
              <div class="card-body p-0">
                <div class="table-responsive">
                  <table class="table table-hover mb-0">
                    <thead class="table-light">
                      <tr><th>Name</th><th>Email</th><th>Saved</th><th>Ratings</th></tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="c in getUsers().filter(u => u.role === 'client' && (user.clients || []).includes(u.id))"
                        :key="c.id"
                      >
                        <td class="fw-medium">
                          {{ c.name }}
                        </td>
                        <td class="text-muted small">
                          {{ c.email }}
                        </td>
                        <td>{{ (c.savedResources || []).length }}</td>
                        <td>{{ c.ratings ? Object.keys(c.ratings).length : 0 }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Resource Ratings -->
          <div class="col-lg-5">
            <div class="card shadow-sm h-100">
              <div class="card-header bg-white fw-bold">
                Resource Ratings Overview
              </div>
              <div class="card-body">
                <div class="list-group list-group-flush">
                  <div
                    v-for="r in RESOURCES.map(r => ({ ...r, avg: calculateAverage((getRatings()[r.id] || [])), count: (getRatings()[r.id] || []).length })).filter(r => r.count > 0).sort((a, b) => b.avg - a.avg).slice(0, 6)"
                    :key="r.id"
                    class="list-group-item px-0 d-flex justify-content-between align-items-center"
                  >
                    <div style="max-width: 65%;">
                      <small class="text-muted">{{ r.type }}</small><br>
                      <span class="fw-medium small">{{ r.title }}</span>
                    </div>
                    <div class="text-end">
                      <strong>{{ r.avg }}</strong> <small class="text-muted">({{ r.count }})</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div
      v-else
      class="container py-5 text-center"
    >
      <div class="spinner-border text-primary" />
      <p class="mt-2">
        Loading dashboard...
      </p>
    </div>
  </div>
</template>
