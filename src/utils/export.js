/**
 * MindWell Connect — CSV Export Utility
 * FIT5032 Assignment 3 — BR (E.4) Export
 *
 * Generates a UTF-8 CSV file (with BOM so Excel opens it correctly)
 * and triggers a browser download.
 */

export function exportToCSV(rows, columns, filename = 'export.csv') {
  const header = columns.map(c => c.label).join(',')
  const lines = rows.map(r =>
    columns.map(c => {
      const v = r[c.key] ?? ''
      return '"' + String(v).replace(/"/g, '""') + '"'
    }).join(',')
  )
  const csv = '\uFEFF' + [header, ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
