import { useState } from 'react'

export default function CompletionProofModal({ taskTitle, initialValue = '', onSubmit, onClose }) {
  const [bukti, setBukti] = useState(initialValue)
  const trimmed = bukti.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-6 shadow-xl"
      >
        <h3 className="font-display text-xl text-stone-900 dark:text-zinc-100 mb-1">Tandai Selesai</h3>
        <p className="text-sm text-stone-500 dark:text-zinc-500 mb-4 truncate">"{taskTitle}"</p>

        <label className="block text-sm font-medium text-stone-600 dark:text-zinc-400 mb-1.5">
          Bukti penyelesaian tugas
        </label>
        <textarea
          autoFocus
          value={bukti}
          onChange={(e) => setBukti(e.target.value)}
          placeholder="Tulis bukti penyelesaian tugas — bisa singkat (mis. &quot;sudah dikumpulkan di e-learning&quot;) atau penjelasan panjang."
          rows={5}
          className="w-full rounded-lg border border-stone-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm text-stone-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
        <p className="text-xs text-stone-400 dark:text-zinc-500 mt-1.5">
          Wajib diisi supaya tugas bisa ditandai selesai.
        </p>

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
            disabled={!trimmed}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Tandai Selesai
          </button>
        </div>
      </form>
    </div>
  )
}
