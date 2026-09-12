import { CheckCircle2, Circle, Pencil, Trash2, X } from 'lucide-react'
import { formatDeadline, isOverdue } from '../utils/date.js'
import { priorityBadgeClass, priorityLabel } from '../utils/priority.js'

export default function TaskDetailModal({ task, mkNama, onClose, onEdit, onDelete, onToggleSelesai, onEditProof }) {
  const overdue = isOverdue(task.deadline, task.selesai)
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-medium text-stone-400 dark:text-zinc-500 uppercase tracking-wide">
            {mkNama}
          </span>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3
          className={`font-display text-2xl text-stone-900 dark:text-zinc-100 mb-3 ${
            task.selesai ? 'line-through opacity-60' : ''
          }`}
        >
          {task.judul}
        </h3>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityBadgeClass(task.prioritas)}`}>
            Prioritas {priorityLabel(task.prioritas)}
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              overdue
                ? 'bg-maroon-50 text-maroon-700 dark:bg-maroon-800/30 dark:text-maroon-300'
                : 'bg-stone-100 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
          >
            {task.deadline ? formatDeadline(task.deadline) : 'Tanpa deadline'}
          </span>
          {overdue && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-maroon-600 text-white">
              Terlambat
            </span>
          )}
        </div>

        {task.deskripsi ? (
          <p className="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap mb-6">
            {task.deskripsi}
          </p>
        ) : (
          <p className="text-sm text-stone-400 dark:text-zinc-500 italic mb-6">Tidak ada deskripsi.</p>
        )}

        {task.selesai && (
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 p-3 mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                Bukti Penyelesaian
              </span>
              {onEditProof && (
                <button
                  onClick={onEditProof}
                  className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  Ubah Bukti
                </button>
              )}
            </div>
            <p className="text-sm text-stone-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {task.buktiPenyelesaian || <span className="italic text-stone-400">Belum ada bukti.</span>}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToggleSelesai}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              task.selesai
                ? 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {task.selesai ? <Circle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {task.selesai ? 'Tandai belum selesai' : 'Tandai selesai'}
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Ubah
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-maroon-600 hover:bg-maroon-50 dark:hover:bg-maroon-800/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
