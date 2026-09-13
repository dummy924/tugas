export const SORT_OPTIONS = [
  { value: 'deadline-dekat', label: 'Deadline: Terdekat' },
  { value: 'deadline-jauh', label: 'Deadline: Terjauh' },
  { value: 'nama-az', label: 'Nama: A-Z' },
  { value: 'nama-za', label: 'Nama: Z-A' },
  { value: 'tanggal-terbaru', label: 'Ditambahkan: Terbaru Dulu' },
  { value: 'tanggal-terlama', label: 'Ditambahkan: Terlama Dulu' },
  { value: 'prioritas-tinggi', label: 'Prioritas: Tinggi ke Rendah' },
  { value: 'prioritas-rendah', label: 'Prioritas: Rendah ke Tinggi' },
]

const PRIORITY_WEIGHT = { tinggi: 3, sedang: 2, rendah: 1 }

// Firestore serverTimestamp() bisa sesaat bernilai null (sebelum sinkron ke server).
// Kalau begitu, anggap saja "baru saja" supaya tidak error dan tetap masuk akal di pengurutan.
function createdAtMillis(t) {
  if (t.createdAt && typeof t.createdAt.toMillis === 'function') return t.createdAt.toMillis()
  if (t.createdAt && typeof t.createdAt.seconds === 'number') return t.createdAt.seconds * 1000
  return Date.now()
}

function compareDeadlineAsc(a, b) {
  // Tugas tanpa deadline selalu ditaruh paling akhir, di kedua arah urutan.
  if (!a.deadline && !b.deadline) return 0
  if (!a.deadline) return 1
  if (!b.deadline) return -1
  return a.deadline.localeCompare(b.deadline)
}

function compareDeadlineDesc(a, b) {
  // Sengaja TIDAK sekadar membalik argumen compareDeadlineAsc(b, a) — cara itu
  // ternyata membuat tugas tanpa deadline malah pindah ke paling depan, padahal
  // aturannya harus tetap di paling akhir di kedua arah urutan.
  if (!a.deadline && !b.deadline) return 0
  if (!a.deadline) return 1
  if (!b.deadline) return -1
  return b.deadline.localeCompare(a.deadline)
}

export function sortTasks(tasks, sortBy) {
  const arr = [...tasks]
  switch (sortBy) {
    case 'nama-az':
      return arr.sort((a, b) => a.judul.localeCompare(b.judul, 'id', { sensitivity: 'base' }))
    case 'nama-za':
      return arr.sort((a, b) => b.judul.localeCompare(a.judul, 'id', { sensitivity: 'base' }))
    case 'tanggal-terlama':
      return arr.sort((a, b) => createdAtMillis(a) - createdAtMillis(b))
    case 'tanggal-terbaru':
      return arr.sort((a, b) => createdAtMillis(b) - createdAtMillis(a))
    case 'deadline-jauh':
      return arr.sort(compareDeadlineDesc)
    case 'prioritas-rendah':
      return arr.sort((a, b) => (PRIORITY_WEIGHT[a.prioritas] || 2) - (PRIORITY_WEIGHT[b.prioritas] || 2))
    case 'prioritas-tinggi':
      return arr.sort((a, b) => (PRIORITY_WEIGHT[b.prioritas] || 2) - (PRIORITY_WEIGHT[a.prioritas] || 2))
    case 'deadline-dekat':
    default:
      return arr.sort(compareDeadlineAsc)
  }
}
