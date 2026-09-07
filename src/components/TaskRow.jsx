import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react'
import { deadlineLabel, isOverdue } from '../utils/date.js'
import { priorityBarColor, priorityBadgeClass, priorityLabel } from '../utils/priority.js'

export default function TaskRow({
  task,
  mkNama,
  selectMode,
  isChecked,
  onToggleCheck,
  onOpenDetail,
  onToggleSelesai,
  onEdit,
  onDelete,
}) {
  const overdue = isOverdue(task.deadline, task.selesai)

  return (
    <div
      className={`group flex items-center gap-3 rounded-lg border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-0 pr-3 py-3 hover:border-stone-300 dark:hover:border-zinc-700 transition-colors overflow-hidden`}
    >
      <span className={`w-1.5 self-stretch shrink-0 ${priorityBarColor(task.prioritas)}`} />

      {selectMode ? (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggleCheck}
          className="w-4 h-4 accent-maroon-600 shrink-0 cursor-pointer"
        />
      ) : (
        <button
           onClick={onToggleSelesai}
           className="shrink-0 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400"
           title={task.selesai ? 'Tandai belum selesai' : 'Tandai selesai'}
         >
           {task.selesai ? (
             <CheckCircle2 className="w-5 h-5 text-emerald-600" />
           ) : (
             <Circle className="w-5 h-5" />
           )}
         </button>
       )}

      <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpenDetail}>
        <p
          className={`text-sm font-medium text-stone-900 dark:text-zinc-100 truncate ${
            task.selesai ? 'line-through opacity-60' : ''
          }`}
        >
          {task.judul}
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
          <span className="text-xs text-stone-500 dark:text-zinc-500 truncate">{mkNama}</span>
          <span className="text-stone-300 dark:text-zinc-700">·</span>
          <span
            className={`text-xs ${
              overdue ? 'text-maroon-600 dark:text-maroon-400 font-medium' : 'text-stone-500 dark:text-zinc-500'
            }`}
          >
            {deadlineLabel(task.deadline, task.selesai)}
          </span>
          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${priorityBadgeClass(task.prioritas)}`}>
            {priorityLabel(task.prioritas)}
          </span>
        </div>
      </div>

      <div className="hidden md:group-hover:flex items-center gap-0.5 shrink-0">
        <button
          onClick={onEdit}
          className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200"
          title="Ubah"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 text-stone-400 hover:text-maroon-600"
          title="Hapus"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
