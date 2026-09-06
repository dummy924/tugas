import TaskRow from './TaskRow.jsx'

export default function TaskSection({
  title,
  tasks,
  mataKuliah,
  selectMode,
  selectedIds,
  onToggleCheck,
  onOpenDetail,
  onToggleSelesai,
  onEdit,
  onDelete,
  emptyText,
}) {
  const mkNamaById = (mkId) => mataKuliah.find((m) => m.id === mkId)?.nama || 'Tanpa mata kuliah'

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-display text-lg text-stone-900 dark:text-zinc-100">{title}</h2>
        <span className="text-xs text-stone-400 dark:text-zinc-500">({tasks.length})</span>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-stone-400 dark:text-zinc-500 py-4">{emptyText}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              mkNama={mkNamaById(task.mkId)}
              selectMode={selectMode}
              isChecked={selectedIds.has(task.id)}
              onToggleCheck={() => onToggleCheck(task.id)}
              onOpenDetail={() => onOpenDetail(task)}
              onToggleSelesai={() => onToggleSelesai(task)}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
