<script setup>
/**
 * MindWell Connect — Geo Location Map (Leaflet + OpenStreetMap)
 * FIT5032 Assignment 3 — BR (E.2) Geo Location
 *
 * Two non-trivial features:
 *   1. Place search (Nominatim geocoding) — jump to and mark any searched place.
 *   2. Counselling centre markers — preloaded support locations with popup details.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapEl = ref(null)
const searchQuery = ref('')
const searching = ref(false)
const statusMsg = ref('')

let map = null
let markersLayer = null

const supportLocations = [
  { name: 'MindWell Head Office', lat: -37.8136, lng: 144.9631, desc: 'Main counselling centre, Melbourne CBD' },
  { name: 'Clayton Counselling Clinic', lat: -37.9112, lng: 145.1314, desc: 'Monash Clayton campus clinic' },
  { name: 'Caulfield Support Hub', lat: -37.8768, lng: 145.0458, desc: 'Caulfield campus support centre' }
]

function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  })
}

onMounted(() => {
  map = L.map(mapEl.value).setView([-37.8136, 144.9631], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
  markersLayer = L.layerGroup().addTo(map)

  supportLocations.forEach(loc => {
    const m = L.marker([loc.lat, loc.lng], { icon: makeIcon('#1a73e8') }).addTo(markersLayer)
    m.bindPopup(`<strong>${loc.name}</strong><br>${loc.desc}`)
  })
})

async function search() {
  const q = searchQuery.value.trim()
  if (!q || !map) return
  searching.value = true
  statusMsg.value = ''
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const data = await res.json()
    if (data && data.length) {
      const r = data[0]
      const lat = parseFloat(r.lat)
      const lng = parseFloat(r.lon)
      map.setView([lat, lng], 14)
      const m = L.marker([lat, lng], { icon: makeIcon('#ea4335') }).addTo(markersLayer)
      m.bindPopup(`<strong>${r.display_name}</strong>`).openPopup()
      statusMsg.value = `Located: ${r.display_name}`
    } else {
      statusMsg.value = 'No results found for that search.'
    }
  } catch (e) {
    statusMsg.value = 'Search failed — please check your connection.'
  }
  searching.value = false
}

onUnmounted(() => {
  if (map) { map.remove(); map = null }
})
</script>

<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-1">
      Find Support Near You
    </h2>
    <p class="text-muted mb-4">
      Locate counselling centres and search for any place of interest.
    </p>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="input-group mb-3">
          <span class="input-group-text">
            <i class="bi bi-search" aria-hidden="true" />
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Search a place (e.g. Melbourne Central)"
            aria-label="Search for a place"
            @keyup.enter="search"
          >
          <button
            class="btn btn-mw"
            :disabled="searching"
            @click="search"
          >
            {{ searching ? 'Searching...' : 'Search' }}
          </button>
        </div>

        <div
          v-if="statusMsg"
          class="alert alert-info py-2 small mb-3"
          role="status"
        >
          {{ statusMsg }}
        </div>

        <div
          ref="mapEl"
          style="height: 480px; border-radius: 8px;"
          role="application"
          aria-label="Map of counselling centre locations"
        />
      </div>
    </div>
  </div>
</template>
