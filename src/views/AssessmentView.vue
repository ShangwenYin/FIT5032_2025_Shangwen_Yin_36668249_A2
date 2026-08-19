<script setup>
/**
 * MindWell Connect — Self-Assessment (GAD-7)
 * FIT5032 Assignment 3 — BR (E.1) Cloud Functions
 *
 * Submits the 7 GAD-7 answers to our Cloudflare Worker, which scores the
 * assessment server-side and returns the severity level + recommendation.
 */
import { ref, reactive, computed } from 'vue'

const questions = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen'
]

const options = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' }
]

const answers = reactive(Array(7).fill(0))
const loading = ref(false)
const result = ref(null)
const errorMsg = ref('')

const answered = computed(() => answers.every(a => a !== null))

const resultClass = computed(() => {
  if (!result.value) return ''
  const s = result.value.score
  if (s <= 4) return 'alert-success'
  if (s <= 9) return 'alert-info'
  if (s <= 14) return 'alert-warning'
  return 'alert-danger'
})

async function submit() {
  loading.value = true
  result.value = null
  errorMsg.value = ''
  try {
    const url = import.meta.env.VITE_ASSESSMENT_API_URL + '/api/assess'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: [...answers] })
    })
    const data = await res.json()
    if (!res.ok) {
      errorMsg.value = data.error || 'Assessment failed.'
    } else {
      result.value = data
    }
  } catch (e) {
    errorMsg.value = 'Could not reach the assessment service. Please try again.'
  }
  loading.value = false
}

function reset() {
  answers.fill(0)
  result.value = null
  errorMsg.value = ''
}
</script>

<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-1">
      Anxiety Self-Assessment
    </h2>
    <p class="text-muted mb-4">
      Answer the 7 GAD-7 questions below. Your responses are scored by our
      serverless function (Cloudflare Worker).
    </p>

    <div class="card shadow-sm">
      <div class="card-body">
        <div
          v-for="(q, i) in questions"
          :key="i"
          class="mb-4 pb-3 border-bottom"
        >
          <p class="fw-medium mb-2">
            {{ i + 1 }}. {{ q }}
          </p>
          <div class="d-flex flex-wrap gap-3">
            <div
              v-for="opt in options"
              :key="opt.value"
              class="form-check"
            >
              <input
                :id="'q' + i + 'o' + opt.value"
                v-model="answers[i]"
                :value="opt.value"
                type="radio"
                class="form-check-input"
              >
              <label
                :for="'q' + i + 'o' + opt.value"
                class="form-check-label small"
              >{{ opt.label }}</label>
            </div>
          </div>
        </div>

        <div class="d-flex gap-2">
          <button
            class="btn btn-mw"
            :disabled="loading"
            @click="submit"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            />
            {{ loading ? 'Scoring...' : 'Submit Assessment' }}
          </button>
          <button
            class="btn btn-mw-outline"
            @click="reset"
          >
            Reset
          </button>
        </div>

        <div
          v-if="errorMsg"
          class="alert alert-danger mt-4 mb-0"
          role="alert"
        >
          {{ errorMsg }}
        </div>

        <div
          v-if="result"
          class="alert mt-4 mb-0"
          :class="resultClass"
          role="status"
        >
          <h5 class="fw-bold mb-1">
            Score: {{ result.score }} / 21 — {{ result.level }}
          </h5>
          <p class="mb-0">
            {{ result.recommendation }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
