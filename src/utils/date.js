export function formatDeadline(dateStr) {
  if (!dateStr) return 'Tanpa deadline'
  const d = new Date(dateStr + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function isOverdue(dateStr, selesai) {
  if (!dateStr || selesai) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr + 'T00:00:00')
  return d.getTime() < today.getTime()
}

export function daysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr + 'T00:00:00')
  const diffMs = d.getTime() - today.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export function deadlineLabel(dateStr, selesai) {
  if (!dateStr) return 'Tanpa deadline'
  if (selesai) return formatDeadline(dateStr)
  const days = daysUntil(dateStr)
  if (days < 0) return `Terlambat ${Math.abs(days)} hari`
  if (days === 0) return 'Deadline hari ini'
  if (days === 1) return 'Deadline besok'
  return formatDeadline(dateStr)
}
