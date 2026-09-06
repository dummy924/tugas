import { useState } from 'react'
import { PRIORITAS_OPTIONS } from '../utils/priority.js'

export default function TaskFormModal({ mataKuliahOptions, initialTask, defaultMkId, onSubmit, onClose }) {
  const isEdit = Boolean(initialTask)
  const [judul, setJudul] = useState(initialTask?.judul || '')
  const [deskripsi, setDeskripsi] = useState(initialTask?.deskripsi || '')
  const [mkId, setMkId] = useState(initialTask?.mkId || defaultMkId || mataKuliahOptions[0]?.id || '')
  const [prioritas, setPrioritas] = useState(initialTask?.prioritas || 'sedang')
  const [deadline, setDeadline] = useState(initialTask?.deadline || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!judul.trim() || !mkId) return
    onSubmit({ judul: judul.trim(), deskripsi: deskripsi.trim(), mkId, prioritas, deadline })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <h3 className="font-display text-xl text-stone-900 dark:text-zinc-100 mb-4">
          {isEdit ? 'Ubah Tugas' : 'Tambah Tugas'}
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 dark:text-zinc-400 mb-1.5">
              Judul tugas
            </label>
            <input
              autoFocus
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Laporan Praktikum Bab 3"
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-maroon-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 dark:text-zinc-400 mb-1.5">
              Deskripsi
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Detail tambahan tugas (opsional)"
              rows={3}
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-maroon-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 dark:text-zinc-400 mb-1.5">
              Mata kuliah
            </label>
            <select
              value={mkId}
              onChange={(e) => setMkId(e.target.value)}
              className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-maroon-500"
            >
              {mataKuliahOptions.map((mk) => (
                <option key={mk.id} value={mk.id} className="dark:bg-zinc-900">
                  {mk.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-600 dark:text-zinc-400 mb-1.5">
                Prioritas
              </label>
              <select
                value={prioritas}
                onChange={(e) => setPrioritas(e.target.value)}
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-maroon-500"
              >
                {PRIORITAS_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value} className="dark:bg-zinc-900">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 dark:text-zinc-400 mb-1.5">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-maroon-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={!mkId}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-maroon-600 text-white hover:bg-maroon-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  )
}
