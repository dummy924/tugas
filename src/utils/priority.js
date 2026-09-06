export const PRIORITAS_OPTIONS = [
  { value: 'tinggi', label: 'Tinggi' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'rendah', label: 'Rendah' },
]

export function priorityBarColor(value) {
  switch (value) {
    case 'tinggi':
      return 'bg-maroon-600'
    case 'sedang':
      return 'bg-gold-500'
    case 'rendah':
      return 'bg-emerald-600'
    default:
      return 'bg-stone-300'
  }
}

export function priorityBadgeClass(value) {
  switch (value) {
    case 'tinggi':
      return 'bg-maroon-50 text-maroon-700 dark:bg-maroon-800/30 dark:text-maroon-300'
    case 'sedang':
      return 'bg-gold-400/20 text-gold-600 dark:text-gold-400'
    case 'rendah':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    default:
      return 'bg-stone-100 text-stone-600'
  }
}

export function priorityLabel(value) {
  const found = PRIORITAS_OPTIONS.find((p) => p.value === value)
  return found ? found.label : 'Sedang'
}
