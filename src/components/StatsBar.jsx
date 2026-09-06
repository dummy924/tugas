export default function StatsBar({ total, belumSelesai, selesai }) {
  const items = [
    { label: 'Total Tugas', value: total },
    { label: 'Belum Selesai', value: belumSelesai, accent: 'text-maroon-600 dark:text-maroon-400' },
    { label: 'Selesai', value: selesai, accent: 'text-emerald-600 dark:text-emerald-400' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3"
        >
          <p className={`font-display text-2xl ${item.accent || 'text-stone-900 dark:text-zinc-100'}`}>
            {item.value}
          </p>
          <p className="text-xs text-stone-500 dark:text-zinc-500 mt-0.5">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
