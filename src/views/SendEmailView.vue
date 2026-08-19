<script setup>
/**
 * MindWell Connect — Send Email (EmailJS)
 * FIT5032 Assignment 3 — BR (D.2) Email with attachment
 */
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

const formRef = ref(null)
const sending = ref(false)
const statusMsg = ref('')
const statusType = ref('info')

function toast(text, type = 'info') {
  statusMsg.value = text
  statusType.value = type
}

async function sendEmail() {
  if (!formRef.value) return

  const toEmail = formRef.value.querySelector('[name="to_email"]').value
  if (!toEmail) {
    toast('Please enter a recipient email address.', 'error')
    return
  }

  sending.value = true
  statusMsg.value = ''
  try {
    await emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formRef.value,
      { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
    )
    toast('Email sent successfully!', 'success')
    formRef.value.reset()
  } catch (e) {
    toast('Send failed: ' + (e.text || e.message || 'unknown error'), 'error')
  }
  sending.value = false
}
</script>

<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-1">
      Send Email
    </h2>
    <p class="text-muted mb-4">
      Send an email with an optional attachment using EmailJS.
    </p>

    <div
      v-if="statusMsg"
      class="alert mb-3"
      :class="statusType === 'success' ? 'alert-success' : statusType === 'error' ? 'alert-danger' : 'alert-info'"
      role="status"
    >
      {{ statusMsg }}
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <form
          ref="formRef"
          @submit.prevent="sendEmail"
        >
          <div class="mb-3">
            <label
              for="emailTo"
              class="form-label"
            >Recipient Email</label>
            <input
              id="emailTo"
              name="to_email"
              type="email"
              class="form-control"
              placeholder="recipient@example.com"
              required
            >
          </div>

          <div class="mb-3">
            <label
              for="emailSubject"
              class="form-label"
            >Subject</label>
            <input
              id="emailSubject"
              name="subject"
              type="text"
              class="form-control"
              placeholder="Email subject"
            >
          </div>

          <div class="mb-3">
            <label
              for="emailMessage"
              class="form-label"
            >Message</label>
            <textarea
              id="emailMessage"
              name="message"
              class="form-control"
              rows="4"
              placeholder="Write your message..."
            />
          </div>

          <div class="mb-3">
            <label
              for="emailAttachment"
              class="form-label"
            >Attachment</label>
            <input
              id="emailAttachment"
              name="attachment"
              type="file"
              class="form-control"
            >
          </div>

          <button
            type="submit"
            class="btn btn-mw"
            :disabled="sending"
          >
            <span
              v-if="sending"
              class="spinner-border spinner-border-sm me-2"
            />
            {{ sending ? 'Sending...' : 'Send Email' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
