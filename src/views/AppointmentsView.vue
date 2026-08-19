<script setup>
/**
 * MindWell Connect — Appointment Booking (FullCalendar)
 * FIT5032 Assignment 3 — extended feature #1
 *
 * Booking constraints: a new booking is rejected when its time range
 * overlaps an existing appointment (conflict management).
 */
import { ref, computed, onMounted, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/vue3/daygrid'
import timeGridPlugin from '@fullcalendar/vue3/timegrid'
import interactionPlugin from '@fullcalendar/vue3/interaction'
import '@fullcalendar/vue3/skeleton.css'
import '@fullcalendar/vue3/themes/classic/theme.css'
import { getCurrentUser, getUsers, getOfflineQueue, addToOfflineQueue, removeFromOfflineQueue, clearOfflineQueue } from '@/data'
import { fetchAppointments, createAppointment, removeAppointment, hasConflict } from '@/data/firestore'
import { useOnline } from '@/composables/useOnline'

const { isOnline } = useOnline()

const user = computed(() => getCurrentUser())
const appointments = ref([])
const offlineQueue = ref([])
const loading = ref(true)
const toastMsg = ref('')
const toastType = ref('info')
const toastVisible = ref(false)

const counsellors = computed(() => getUsers().filter(u => u.role === 'counsellor'))

const form = ref({
  date: '',
  startTime: '10:00',
  duration: 50,
  counsellorId: null,
  note: ''
})

function toast(text, type = 'info') {
  toastMsg.value = text; toastType.value = type; toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 3500)
}

const statusColor = s => (s === 'confirmed' ? '#34a853' : s === 'pending' ? '#f9ab00' : '#ea4335')

const calendarEvents = computed(() => {
  const merged = [...appointments.value, ...offlineQueue.value]
  return merged.map(a => ({
    id: a.id,
    title: a.title,
    start: a.start,
    end: a.end,
    backgroundColor: statusColor(a.status),
    borderColor: statusColor(a.status),
    textColor: '#fff',
    extendedProps: { status: a.status, clientName: a.clientName }
  }))
})

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  },
  height: 'auto',
  selectable: true,
  selectMirror: true,
  editable: true,
  dayMaxEvents: true,
  eventOverlap: false,
  events: calendarEvents.value,
  dateClick: info => { form.value.date = info.dateStr },
  select: info => {
    form.value.date = info.startStr.slice(0, 10)
    form.value.startTime = info.startStr.slice(11, 16) || '10:00'
  },
  eventClick: info => handleCancel(info.event)
}))

async function load() {
  loading.value = true
  const remote = await fetchAppointments()
  // Cache the last successful fetch so the calendar still renders offline.
  if (remote.length > 0 || isOnline.value) {
    localStorage.setItem('mindwell_appointments_cache', JSON.stringify(remote))
  }
  const cached = JSON.parse(localStorage.getItem('mindwell_appointments_cache') || '[]')
  appointments.value = remote.length > 0 ? remote : cached
  offlineQueue.value = getOfflineQueue()
  loading.value = false
}

async function syncOfflineQueue() {
  const queue = getOfflineQueue()
  for (const a of queue) {
    try { await createAppointment(a) } catch (e) { return }
  }
  clearOfflineQueue()
  offlineQueue.value = []
}

async function book() {
  if (!user.value) { toast('Please login to book an appointment.', 'error'); return }
  if (!form.value.date) { toast('Please pick a date from the calendar.', 'error'); return }
  if (!form.value.counsellorId) { toast('Please select a counsellor.', 'error'); return }

  const start = new Date(`${form.value.date}T${form.value.startTime}`)
  if (Number.isNaN(start.getTime())) { toast('Invalid date or time.', 'error'); return }
  const end = new Date(start.getTime() + form.value.duration * 60000)

  // BR booking constraint: conflict management
  const counsellor = counsellors.value.find(c => c.id === form.value.counsellorId)
  const relevant = [...appointments.value, ...offlineQueue.value]
    .filter(a => a.counsellorId === form.value.counsellorId)
  if (hasConflict(relevant, start, end)) {
    toast(`Time slot conflicts with an existing booking for ${counsellor.name}.`, 'error')
    return
  }

  const appt = {
    id: 'apt-' + Date.now(),
    clientId: user.value.id,
    clientName: user.value.name,
    counsellorId: form.value.counsellorId,
    counsellorName: counsellor.name,
    title: `${user.value.name} — ${form.value.note || 'Appointment'}`,
    start: start.toISOString(),
    end: end.toISOString(),
    status: 'pending'
  }

  if (isOnline.value) {
    try {
      await createAppointment(appt)
      await syncOfflineQueue()
      toast('Appointment booked successfully!', 'success')
    } catch (e) {
      toast('Could not reach the server. Saved offline.', 'info')
      addToOfflineQueue(appt)
    }
  } else {
    addToOfflineQueue(appt)
    toast('You are offline — booking queued and will sync when back online.', 'info')
  }
  form.value.note = ''
  await load()
}

async function handleCancel(info) {
  const status = info.event.extendedProps.status
  const isOwner = user.value && (
    user.value.role === 'admin' ||
    (user.value.role === 'counsellor' && info.event.extendedProps.clientName !== user.value.name)
  )
  if (!isOwner) { toast('Only counsellors or admins can cancel appointments.', 'info'); return }
  if (!window.confirm(`Cancel "${info.event.title}"?`)) return

  const id = info.event.id
  if (isOnline.value) {
    try { await removeAppointment(id) } catch (e) { /* ignore */ }
  }
  removeFromOfflineQueue(id)
  toast('Appointment cancelled.', 'info')
  await load()
}

watch(isOnline, async (online) => {
  if (online) {
    await syncOfflineQueue()
    await load()
  }
})

onMounted(async () => {
  await load()
  if (!form.value.counsellorId && counsellors.value.length) {
    form.value.counsellorId = counsellors.value[0].id
  }
})
</script>

<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-1">
      Appointment Booking
    </h2>
    <p class="text-muted mb-4">
      Book a session with a counsellor. Overlapping slots are automatically blocked.
    </p>

    <div
      v-if="toastVisible"
      class="toast-container"
    >
      <div
        class="custom-toast"
        :class="'toast-' + toastType"
      >
        {{ toastMsg }}
      </div>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
            <span>Counsellor Calendar</span>
            <span
              class="badge"
              :class="isOnline ? 'bg-success' : 'bg-danger'"
            >
              {{ isOnline ? 'Online' : 'Offline' }}
            </span>
          </div>
          <div class="card-body">
            <div
              v-if="loading"
              class="text-center py-5"
            >
              <div class="spinner-border text-primary" />
            </div>
            <FullCalendar
              v-else
              :options="calendarOptions"
            />
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-header bg-white fw-bold">
            New Booking
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label">Counsellor</label>
              <select
                v-model.number="form.counsellorId"
                class="form-select"
              >
                <option
                  v-for="c in counsellors"
                  :key="c.id"
                  :value="c.id"
                >
                  {{ c.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Date</label>
              <input
                v-model="form.date"
                type="date"
                class="form-control"
              >
              <small class="text-muted">Tip: click a day on the calendar to fill this in.</small>
            </div>
            <div class="mb-3">
              <label class="form-label">Start Time</label>
              <input
                v-model="form.startTime"
                type="time"
                class="form-control"
              >
            </div>
            <div class="mb-3">
              <label class="form-label">Duration (minutes)</label>
              <select
                v-model.number="form.duration"
                class="form-select"
              >
                <option :value="30">
                  30 minutes
                </option>
                <option :value="50">
                  50 minutes (default)
                </option>
                <option :value="90">
                  90 minutes
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Note</label>
              <input
                v-model="form.note"
                type="text"
                class="form-control"
                placeholder="e.g. Anxiety check-in"
              >
            </div>
            <button
              class="btn btn-mw w-100"
              :disabled="!user"
              @click="book"
            >
              <span v-if="!user">Login to book</span>
              <span v-else-if="!isOnline">Save Offline &amp; Sync Later</span>
              <span v-else>Book Appointment</span>
            </button>
            <p
              v-if="!user"
              class="text-muted small mt-2 mb-0 text-center"
            >
              <router-link to="/login">Login</router-link> to book an appointment.
            </p>
            <div
              v-if="offlineQueue.length"
              class="alert alert-warning mt-3 mb-0 py-2 small"
            >
              <i class="bi bi-cloud-arrow-down" /> {{ offlineQueue.length }} booking(s) queued offline.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
