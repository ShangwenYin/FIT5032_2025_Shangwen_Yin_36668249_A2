<script setup>
/**
 * MindWell Connect — DataTable (reusable interactive table)
 * FIT5032 Assignment 3 — BR (D.3) Interactive Table Data
 *
 * Features: click-to-sort columns, per-column search, and pagination
 * limited to 10 rows per page. Cells can be customised via scoped slots.
 */
import { ref, computed } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true }, // [{ key, label }]
  data: { type: Array, required: true }
})

const sortKey = ref('')
const sortDir = ref('asc')
const searchTerms = ref({})
const currentPage = ref(1)
const perPage = 10

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function resetPage() {
  currentPage.value = 1
}

const filtered = computed(() => {
  let rows = props.data || []
  // per-column search
  for (const col of props.columns) {
    const q = (searchTerms.value[col.key] || '').toString().toLowerCase().trim()
    if (q) {
      rows = rows.filter(r => String(r[col.key] ?? '').toLowerCase().includes(q))
    }
  }
  // sort
  if (sortKey.value) {
    const k = sortKey.value
    rows = [...rows].sort((a, b) => {
      const av = a[k]
      const bv = b[k]
      if (av == null) return 1
      if (bv == null) return -1
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
      return sortDir.value === 'asc' ? cmp : -cmp
    })
  }
  return rows
})

const totalPages = computed(() => Math.ceil(filtered.value.length / perPage) || 1)

const paginated = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

function sortIndicator(key) {
  if (sortKey.value !== key) return ''
  return sortDir.value === 'asc' ? ' \u25B2' : ' \u25BC'
}
</script>

<template>
  <div>
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              class="sortable"
              :aria-sort="sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined"
              @click="toggleSort(col.key)"
            >
              {{ col.label }}<span class="sort-indicator">{{ sortIndicator(col.key) }}</span>
            </th>
          </tr>
          <tr class="filter-row">
            <th
              v-for="col in columns"
              :key="'f-' + col.key"
              scope="col"
            >
              <input
                v-model="searchTerms[col.key]"
                type="text"
                class="form-control form-control-sm"
                :aria-label="'Search ' + col.label"
                placeholder="Search..."
                @input="resetPage"
              >
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in paginated"
            :key="row.id ?? i"
          >
            <td
              v-for="col in columns"
              :key="col.key"
            >
              <slot
                :name="'cell-' + col.key"
                :row="row"
                :value="row[col.key]"
              >
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="paginated.length === 0">
            <td
              :colspan="columns.length"
              class="text-center text-muted py-3"
            >
              No matching records
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-3">
      <small class="text-muted">
        Showing {{ paginated.length }} of {{ filtered.length }} records
      </small>
      <nav aria-label="Table pagination">
        <ul class="pagination pagination-sm mb-0">
          <li
            class="page-item"
            :class="{ disabled: currentPage === 1 }"
          >
            <a
              class="page-link"
              href="#"
              aria-label="Previous page"
              @click.prevent="currentPage--"
            >&laquo;</a>
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
              aria-label="Next page"
              @click.prevent="currentPage++"
            >&raquo;</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.sortable { cursor: pointer; user-select: none; white-space: nowrap; }
.sortable:hover { background: #f1f3f4; }
.sort-indicator { font-size: 0.7rem; color: var(--mw-primary); }
.filter-row th { padding: 0.4rem 0.5rem; background: #fafafa; }
</style>
