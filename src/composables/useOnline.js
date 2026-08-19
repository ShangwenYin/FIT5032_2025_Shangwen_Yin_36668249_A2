/**
 * MindWell Connect — Online/Offline Detection
 * FIT5032 Assignment 3 (offline feature #1)
 *
 * Tracks `navigator.onLine` plus the `online` / `offline` window events and
 * exposes a reactive `isOnline` ref for use in any component.
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useOnline() {
  const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

  const update = () => { isOnline.value = navigator.onLine }

  onMounted(() => {
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
  })

  onUnmounted(() => {
    window.removeEventListener('online', update)
    window.removeEventListener('offline', update)
  })

  return { isOnline }
}
