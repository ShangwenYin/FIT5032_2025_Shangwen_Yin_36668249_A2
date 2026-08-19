<script setup>
/**
 * MindWell Connect — Interactive Charts (Firestore + Chart.js)
 * FIT5032 Assignment 3 — extended feature #2
 *
 * Charts are rendered from data read live from Firestore (`resources` collection).
 */
import { ref, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import { fetchResources } from '@/data/firestore'

const categoryCanvas = ref(null)
const topicCanvas = ref(null)
const downloadsCanvas = ref(null)
const ratingCanvas = ref(null)

const loading = ref(true)
const empty = ref(false)

const COLORS = ['#1a73e8', '#34a853', '#f9ab00', '#ea4335', '#8ab4f8', '#c5221f', '#137333', '#fbbc04']

let charts = []

function destroyCharts() {
  charts.forEach(c => c.destroy())
  charts = []
}

function makeChart(canvas, config) {
  if (!canvas) return
  charts.push(new Chart(canvas, config))
}

async function load() {
  loading.value = true
  empty.value = false
  destroyCharts()

  const resources = await fetchResources()

  if (!resources || resources.length === 0) {
    loading.value = false
    empty.value = true
    return
  }

  // 1. Resources per category (bar)
  const categories = [...new Set(resources.map(r => r.category))].sort()
  const categoryCounts = categories.map(c => resources.filter(r => r.category === c).length)
  makeChart(categoryCanvas.value, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Resources',
        data: categoryCounts,
        backgroundColor: COLORS[0],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  })

  // 2. Resources per topic (doughnut)
  const topics = [...new Set(resources.map(r => r.topic))].sort()
  const topicCounts = topics.map(t => resources.filter(r => r.topic === t).length)
  makeChart(topicCanvas.value, {
    type: 'doughnut',
    data: {
      labels: topics,
      datasets: [{ data: topicCounts, backgroundColor: COLORS }]
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '55%' }
  })

  // 3. Top downloads (horizontal bar)
  const top = [...resources].sort((a, b) => b.downloads - a.downloads).slice(0, 6)
  makeChart(downloadsCanvas.value, {
    type: 'bar',
    data: {
      labels: top.map(r => r.title.length > 28 ? r.title.slice(0, 28) + '…' : r.title),
      datasets: [{
        label: 'Views',
        data: top.map(r => r.downloads),
        backgroundColor: COLORS[2],
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true } }
    }
  })

  // 4. Average rating by resource type (bar)
  const types = [...new Set(resources.map(r => r.type))].sort()
  const typeAvgs = types.map(t => {
    const group = resources.filter(r => r.type === t)
    const avg = group.reduce((s, r) => s + (r.avgRating || 0), 0) / group.length
    return Math.round(avg * 10) / 10
  })
  makeChart(ratingCanvas.value, {
    type: 'bar',
    data: {
      labels: types,
      datasets: [{
        label: 'Avg Rating',
        data: typeAvgs,
        backgroundColor: COLORS[1],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 5 } }
    }
  })

  loading.value = false
}

onMounted(load)
onUnmounted(destroyCharts)
</script>

<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-1">
      Data Insights
    </h2>
    <p class="text-muted mb-4">
      Interactive charts generated live from Firestore data.
    </p>

    <div
      v-if="loading"
      class="text-center py-5"
    >
      <div class="spinner-border text-primary" />
      <p class="text-muted mt-2">
        Loading Firestore data...
      </p>
    </div>

    <div
      v-else-if="empty"
      class="text-center py-5"
    >
      <div class="display-4 mb-3">
        &#x1F4CA;
      </div>
      <h5>No data yet</h5>
      <p class="text-muted">
        Firestore may still be seeding, or you are offline.
      </p>
      <button
        class="btn btn-mw"
        @click="load"
      >
        Retry
      </button>
    </div>

    <div
      v-else
      class="row g-4"
    >
      <div class="col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-white fw-bold">
            Resources by Category
          </div>
          <div
            class="card-body"
            style="height: 280px;"
          >
            <canvas ref="categoryCanvas" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-white fw-bold">
            Resources by Topic
          </div>
          <div
            class="card-body"
            style="height: 280px;"
          >
            <canvas ref="topicCanvas" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-white fw-bold">
            Most Viewed Resources
          </div>
          <div
            class="card-body"
            style="height: 280px;"
          >
            <canvas ref="downloadsCanvas" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-header bg-white fw-bold">
            Average Rating by Type
          </div>
          <div
            class="card-body"
            style="height: 280px;"
          >
            <canvas ref="ratingCanvas" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
