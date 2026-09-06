import { useState } from 'react'

export default function SemesterModal({ initialNama = '', onSubmit, onClose }) {
  const [nama, setNama] = useState(initialNama)
  const isEdit = Boolean(initialNama)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nama.trim()) return
    onSubmit(nama.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-6 shadow-xl"
      >
        <h3 className="font-display text-xl text-stone-900 dark:text-zinc-100 mb-4">
          {isEdit ? 'Ubah Semester' : 'Tambah Semester'}
        </h3>
        <label className="block text-sm font-medium text-stone-600 dark:text-zinc-400 mb-1.5">
          Nama semester
        </label>
        <input
          autoFocus
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Contoh: Semester 5"
          className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-maroon-500 mb-6"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-maroon-600 text-white hover:bg-maroon-700 transition-colors"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  )
}
