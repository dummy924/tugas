import { useEffect, useMemo, useState } from 'react'
import { LogOut, Plus, CheckSquare, Square, X, Trash2 } from 'lucide-react'
import { useAuth } from './context/AuthContext.jsx'
import { useData } from './context/DataContext.jsx'
import Login from './components/Login.jsx'
import Sidebar from './components/Sidebar.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import StatsBar from './components/StatsBar.jsx'
import TaskSection from './components/TaskSection.jsx'
import TaskFormModal from './components/TaskFormModal.jsx'
import TaskDetailModal from './components/TaskDetailModal.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import EmptyState from './components/EmptyState.jsx'

export default function App() {
  const { currentUser, loading, logout } = useAuth()
  const { semesters, mataKuliah, tugas, dataLoading, addTugas, updateTugas, deleteTugas, deleteMultipleTugas, toggleSelesai } =
    useData()

  const [selectedSemesterId, setSelectedSemesterId] = useState(null)
  const [selectedMkId, setSelectedMkId] = useState('all')

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [detailTask, setDetailTask] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)

  // Auto-pilih semester pertama begitu data termuat
  useEffect(() => {
    if (!selectedSemesterId && semesters.length > 0) {
      setSelectedSemesterId(semesters[0].id)
    }
  }, [semesters, selectedSemesterId])

  const mataKuliahDiSemester = useMemo(
    () => mataKuliah.filter((m) => m.semesterId === selectedSemesterId),
    [mataKuliah, selectedSemesterId]
  )

  const tasksFiltered = useMemo(() => {
    return tugas.filter((t) => {
      const mk = mataKuliah.find((m) => m.id === t.mkId)
      if (!mk || mk.semesterId !== selectedSemesterId) return false
      if (selectedMkId !== 'all' && t.mkId !== selectedMkId) return false
      return true
    })
  }, [tugas, mataKuliah, selectedSemesterId, selectedMkId])

  const belumSelesai = useMemo(() => {
    return tasksFiltered
      .filter((t) => !t.selesai)
      .sort((a, b) => {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return a.deadline.localeCompare(b.deadline)
      })
  }, [tasksFiltered])

  const selesai = useMemo(() => tasksFiltered.filter((t) => t.selesai), [tasksFiltered])

  // Reset seleksi saat filter berubah
  useEffect(() => {
    setSelectedIds(new Set())
    setSelectMode(false)
  }, [selectedSemesterId, selectedMkId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-zinc-950">
        <p className="text-stone-400 dark:text-zinc-500 text-sm">Memuat...</p>
      </div>
    )
  }

  if (!currentUser) return <Login />

  const toggleCheck = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allVisibleIds = [...belumSelesai, ...selesai].map((t) => t.id)
  const allSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedIds.has(id))

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(allVisibleIds))
  }

  const handleSubmitTaskForm = async (data) => {
    if (editingTask) await updateTugas(editingTask.id, data)
    else await addTugas(data)
    setShowTaskForm(false)
    setEditingTask(null)
  }

  const handleConfirmDeleteSingle = async () => {
    await deleteTugas(deleteTarget.id)
    if (detailTask?.id === deleteTarget.id) setDetailTask(null)
    setDeleteTarget(null)
  }

  const handleBulkDelete = async () => {
    await deleteMultipleTugas(Array.from(selectedIds))
    setSelectedIds(new Set())
    setSelectMode(false)
    setConfirmBulkDelete(false)
  }

  const mkNamaById = (mkId) => mataKuliah.find((m) => m.id === mkId)?.nama || 'Tanpa mata kuliah'

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 md:flex">
      <Sidebar
        semesters={semesters}
        mataKuliahDiSemester={mataKuliahDiSemester}
        selectedSemesterId={selectedSemesterId}
        setSelectedSemesterId={setSelectedSemesterId}
        selectedMkId={selectedMkId}
        setSelectedMkId={setSelectedMkId}
      />

      <main className="flex-1 min-w-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-zinc-800">
          <h1 className="font-display text-xl text-stone-900 dark:text-zinc-100">Tugas Kuliah</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-3 border-l border-stone-200 dark:border-zinc-800">
              {currentUser.photoURL && (
                <img src={currentUser.photoURL} alt="" className="w-7 h-7 rounded-full" />
              )}
              <span className="hidden sm:block text-sm text-stone-600 dark:text-zinc-400 max-w-[120px] truncate">
                {currentUser.displayName}
              </span>
              <button
                onClick={logout}
                title="Keluar"
                className="text-stone-400 hover:text-maroon-600 dark:hover:text-maroon-400"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-3xl">
          {!selectedSemesterId ? (
            <EmptyState
              title="Belum ada semester"
              description="Tambahkan semester pertamamu lewat panel di samping untuk mulai mencatat tugas."
            />
          ) : (
            <>
              <StatsBar total={tasksFiltered.length} belumSelesai={belumSelesai.length} selesai={selesai.length} />

              <div className="flex flex-wrap items-center gap-2 mb-6">
                <button
                  onClick={() => {
                    setEditingTask(null)
                    setShowTaskForm(true)
                  }}
                  disabled={mataKuliahDiSemester.length === 0}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-maroon-600 text-white hover:bg-maroon-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Tugas
                </button>

                {!selectMode ? (
                  <button
                    onClick={() => setSelectMode(true)}
                    disabled={tasksFiltered.length === 0}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-stone-600 dark:text-zinc-300 border border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckSquare className="w-4 h-4" />
                    Pilih
                  </button>
                ) : (
                  <>
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-stone-600 dark:text-zinc-300 border border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                      {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      Pilih Semua
                    </button>
                    <button
                      onClick={() => setConfirmBulkDelete(true)}
                      disabled={selectedIds.size === 0}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-maroon-600 text-white hover:bg-maroon-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus Terpilih ({selectedIds.size})
                    </button>
                    <button
                      onClick={() => {
                        setSelectMode(false)
                        setSelectedIds(new Set())
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Batal
                    </button>
                  </>
                )}
              </div>

              {mataKuliahDiSemester.length === 0 ? (
                <EmptyState
                  title="Belum ada mata kuliah"
                  description="Tambahkan mata kuliah di semester ini dulu lewat panel di samping, baru kamu bisa menambahkan tugas."
                />
              ) : tasksFiltered.length === 0 ? (
                <EmptyState
                  title="Belum ada tugas"
                  description="Klik tombol Tambah Tugas untuk mencatat tugas pertamamu di sini."
                />
              ) : (
                <>
                  <TaskSection
                    title="Belum Selesai"
                    tasks={belumSelesai}
                    mataKuliah={mataKuliah}
                    selectMode={selectMode}
                    selectedIds={selectedIds}
                    onToggleCheck={toggleCheck}
                    onOpenDetail={setDetailTask}
                    onToggleSelesai={(t) => toggleSelesai(t.id, t.selesai)}
                    onEdit={(t) => {
                      setEditingTask(t)
                      setShowTaskForm(true)
                    }}
                    onDelete={setDeleteTarget}
                    emptyText="Tidak ada tugas yang tersisa di sini. Kerja bagus!"
                  />
                  <TaskSection
                    title="Selesai"
                    tasks={selesai}
                    mataKuliah={mataKuliah}
                    selectMode={selectMode}
                    selectedIds={selectedIds}
                    onToggleCheck={toggleCheck}
                    onOpenDetail={setDetailTask}
                    onToggleSelesai={(t) => toggleSelesai(t.id, t.selesai)}
                    onEdit={(t) => {
                      setEditingTask(t)
                      setShowTaskForm(true)
                    }}
                    onDelete={setDeleteTarget}
                    emptyText="Belum ada tugas yang selesai."
                  />
                </>
              )}
            </>
          )}
        </div>
      </main>

      {showTaskForm && (
        <TaskFormModal
          mataKuliahOptions={mataKuliahDiSemester}
          initialTask={editingTask}
          defaultMkId={selectedMkId !== 'all' ? selectedMkId : undefined}
          onSubmit={handleSubmitTaskForm}
          onClose={() => {
            setShowTaskForm(false)
            setEditingTask(null)
          }}
        />
      )}

      {detailTask && (
        <TaskDetailModal
          task={detailTask}
          mkNama={mkNamaById(detailTask.mkId)}
          onClose={() => setDetailTask(null)}
          onEdit={() => {
            setEditingTask(detailTask)
            setShowTaskForm(true)
            setDetailTask(null)
          }}
          onDelete={() => setDeleteTarget(detailTask)}
          onToggleSelesai={() => {
            toggleSelesai(detailTask.id, detailTask.selesai)
            setDetailTask({ ...detailTask, selesai: !detailTask.selesai })
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Hapus tugas?"
          message={`"${deleteTarget.judul}" akan dihapus permanen.`}
          onConfirm={handleConfirmDeleteSingle}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {confirmBulkDelete && (
        <ConfirmDialog
          title="Hapus tugas terpilih?"
          message={`${selectedIds.size} tugas akan dihapus permanen.`}
          onConfirm={handleBulkDelete}
          onCancel={() => setConfirmBulkDelete(false)}
        />
      )}
    </div>
  )
}
