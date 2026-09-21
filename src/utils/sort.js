export const SORT_CATEGORIES = [
  {
    category: 'deadline',
    label: 'Deadline',
    options: [
      { value: 'deadline-dekat', label: 'Terdekat' },
      { value: 'deadline-jauh', label: 'Terjauh' },
    ],
  },
  {
    category: 'prioritas',
    label: 'Prioritas',
    options: [
      { value: 'prioritas-tinggi', label: 'Tinggi ke Rendah' },
      { value: 'prioritas-rendah', label: 'Rendah ke Tinggi' },
    ],
  },
  {
    category: 'nama',
    label: 'Nama',
    options: [
      { value: 'nama-az', label: 'A-Z' },
      { value: 'nama-za', label: 'Z-A' },
    ],
  },
  {
    category: 'tanggal',
    label: 'Ditambahkan',
    options: [
      { value: 'tanggal-terlama', label: 'Terlama Dulu' },
      { value: 'tanggal-terbaru', label: 'Terbaru Dulu' },
    ],
  },
]

// Peta value -> kategori, dipakai untuk mendeteksi tabrakan kategori saat toggle.
export const CATEGORY_OF = SORT_CATEGORIES.reduce((acc, cat) => {
  cat.options.forEach((opt) => {
    acc[opt.value] = cat.category
  })
  return acc
}, {})

// Peta value -> label, dipakai untuk menampilkan ringkasan urutan aktif.
export const LABEL_OF = SORT_CATEGORIES.reduce((acc, cat) => {
  cat.options.forEach((opt) => {
    acc[opt.value] = `${cat.label}: ${opt.label}`
  })
  return acc
}, {})

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
  // Sengaja bukan sekadar membalik argumen compareDeadlineAsc(b, a) — itu bikin tugas
  // tanpa deadline malah pindah ke depan, padahal harus tetap di akhir di kedua arah.
  if (!a.deadline && !b.deadline) return 0
  if (!a.deadline) return 1
  if (!b.deadline) return -1
  return b.deadline.localeCompare(a.deadline)
}

const COMPARATORS = {
  'nama-az': (a, b) => a.judul.localeCompare(b.judul, 'id', { sensitivity: 'base' }),
  'nama-za': (a, b) => b.judul.localeCompare(a.judul, 'id', { sensitivity: 'base' }),
  'tanggal-terlama': (a, b) => createdAtMillis(a) - createdAtMillis(b),
  'tanggal-terbaru': (a, b) => createdAtMillis(b) - createdAtMillis(a),
  'deadline-dekat': compareDeadlineAsc,
  'deadline-jauh': compareDeadlineDesc,
  'prioritas-tinggi': (a, b) => (PRIORITY_WEIGHT[b.prioritas] || 2) - (PRIORITY_WEIGHT[a.prioritas] || 2),
  'prioritas-rendah': (a, b) => (PRIORITY_WEIGHT[a.prioritas] || 2) - (PRIORITY_WEIGHT[b.prioritas] || 2),
}

// sortKeys: array berurutan sesuai prioritas, mis. ['deadline-dekat', 'prioritas-tinggi']
// artinya urutkan berdasarkan deadline dulu, kalau deadline-nya sama baru dibedakan lewat prioritas.
export function sortTasksMulti(tasks, sortKeys) {
  const keys = sortKeys && sortKeys.length > 0 ? sortKeys : ['deadline-dekat']
  const arr = [...tasks]
  arr.sort((a, b) => {
    for (const key of keys) {
      const cmp = COMPARATORS[key] ? COMPARATORS[key](a, b) : 0
      if (cmp !== 0) return cmp
    }
    return 0
  })
  return arr
}
