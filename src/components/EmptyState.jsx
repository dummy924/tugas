import { NotebookPen } from 'lucide-react'

export default function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <NotebookPen className="w-10 h-10 text-stone-300 dark:text-zinc-700 mb-4" strokeWidth={1.5} />
      <h3 className="font-display text-xl text-stone-800 dark:text-zinc-200 mb-1.5">{title}</h3>
      <p className="text-sm text-stone-500 dark:text-zinc-500 max-w-xs">{description}</p>
    </div>
  )
}
