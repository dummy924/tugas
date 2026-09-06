import { useState } from 'react'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SemesterModal from './SemesterModal.jsx'
import MataKuliahModal from './MataKuliahModal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

export default function Sidebar({
  semesters,
  mataKuliahDiSemester,
  selectedSemesterId,
  setSelectedSemesterId,
  selectedMkId,
  setSelectedMkId,
}) {
  const {
    addSemester,
    updateSemester,
    deleteSemester,
    addMataKuliah,
    updateMataKuliah,
    deleteMataKuliah,
  } = useData()

  const [showSemesterModal, setShowSemesterModal] = useState(false)
  const [editingSemester, setEditingSemester] = useState(null)
  const [showMkModal, setShowMkModal] = useState(false)
  const [editingMk, setEditingMk] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null) // { type: 'semester'|'mk', id, nama }

  const handleSaveSemester = async (nama) => {
    if (editingSemester) await updateSemester(editingSemester.id, nama)
    else await addSemester(nama)
    setShowSemesterModal(false)
    setEditingSemester(null)
  }

  const handleSaveMk = async (nama) => {
    if (editingMk) await updateMataKuliah(editingMk.id, nama)
    else await addMataKuliah(nama, selectedSemesterId)
    setShowMkModal(false)
    setEditingMk(null)
  }

  const handleConfirmDelete = async () => {
    if (confirmTarget.type === 'semester') {
      await deleteSemester(confirmTarget.id)
      if (selectedSemesterId === confirmTarget.id) setSelectedSemesterId(null)
    } else {
      await deleteMataKuliah(confirmTarget.id)
      if (selectedMkId === confirmTarget.id) setSelectedMkId('all')
    }
    setConfirmTarget(null)
  }

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-stone-200 dark:border-zinc-800 bg-stone-50/60 dark:bg-zinc-950/60 md:h-screen md:sticky md:top-0 flex flex-col">
      <div className="p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Semester "binder tabs" */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold tracking-wide text-stone-400 dark:text-zinc-500 uppercase">
              Semester
            </span>
            <button
              onClick={() => {
                setEditingSemester(null)
                setShowSemesterModal(true)
              }}
              className="text-stone-400 hover:text-maroon-600 dark:text-zinc-500 dark:hover:text-maroon-400 transition-colors"
              title="Tambah semester"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {semesters.length === 0 && (
            <p className="text-sm text-stone-400 dark:text-zinc-500 px-1">
              Belum ada semester. Tambahkan dulu.
            </p>
          )}

          <div className="flex flex-col gap-1">
            {semesters.map((s) => {
              const active = s.id === selectedSemesterId
              return (
                <div
                  key={s.id}
                  className={`group flex items-center justify-between rounded-lg pl-3 pr-1.5 py-2 cursor-pointer border-l-4 transition-colors ${
                    active
                      ? 'border-maroon-600 bg-white dark:bg-zinc-900 shadow-sm'
                      : 'border-transparent hover:bg-stone-100 dark:hover:bg-zinc-900/60'
                  }`}
                  onClick={() => {
                    setSelectedSemesterId(s.id)
                    setSelectedMkId('all')
                  }}
                >
                  <span
                    className={`text-sm truncate ${
                      active
                        ? 'text-stone-900 dark:text-zinc-100 font-medium'
                        : 'text-stone-600 dark:text-zinc-400'
                    }`}
                  >
                    {s.nama}
                  </span>
                  <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingSemester(s)
                        setShowSemesterModal(true)
                      }}
                      className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200"
                      title="Ubah"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setConfirmTarget({ type: 'semester', id: s.id, nama: s.nama })
                      }}
                      className="p-1 text-stone-400 hover:text-maroon-600"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mata kuliah untuk semester terpilih */}
        {selectedSemesterId && (
          <div className="border-t border-stone-200 dark:border-zinc-800 pt-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold tracking-wide text-stone-400 dark:text-zinc-500 uppercase">
                Mata Kuliah
              </span>
              <button
                onClick={() => {
                  setEditingMk(null)
                  setShowMkModal(true)
                }}
                className="text-stone-400 hover:text-maroon-600 dark:text-zinc-500 dark:hover:text-maroon-400 transition-colors"
                title="Tambah mata kuliah"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setSelectedMkId('all')}
              className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left mb-1 transition-colors ${
                selectedMkId === 'all'
                  ? 'bg-maroon-600 text-white'
                  : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-900/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Semua Mata Kuliah
            </button>

            {mataKuliahDiSemester.length === 0 && (
              <p className="text-sm text-stone-400 dark:text-zinc-500 px-1 mt-1">
                Belum ada mata kuliah di semester ini.
              </p>
            )}

            <div className="flex flex-col gap-0.5">
              {mataKuliahDiSemester.map((mk) => {
                const active = mk.id === selectedMkId
                return (
                  <div
                    key={mk.id}
                    className={`group flex items-center justify-between rounded-lg pl-3 pr-1.5 py-2 cursor-pointer transition-colors ${
                      active
                        ? 'bg-maroon-50 dark:bg-maroon-800/20 text-maroon-700 dark:text-maroon-300 font-medium'
                        : 'text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-900/60'
                    }`}
                    onClick={() => setSelectedMkId(mk.id)}
                  >
                    <span className="text-sm truncate">{mk.nama}</span>
                    <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingMk(mk)
                          setShowMkModal(true)
                        }}
                        className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200"
                        title="Ubah"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setConfirmTarget({ type: 'mk', id: mk.id, nama: mk.nama })
                        }}
                        className="p-1 text-stone-400 hover:text-maroon-600"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showSemesterModal && (
        <SemesterModal
          initialNama={editingSemester?.nama || ''}
          onSubmit={handleSaveSemester}
          onClose={() => {
            setShowSemesterModal(false)
            setEditingSemester(null)
          }}
        />
      )}

      {showMkModal && (
        <MataKuliahModal
          initialNama={editingMk?.nama || ''}
          onSubmit={handleSaveMk}
          onClose={() => {
            setShowMkModal(false)
            setEditingMk(null)
          }}
        />
      )}

      {confirmTarget && (
        <ConfirmDialog
          title={confirmTarget.type === 'semester' ? 'Hapus semester?' : 'Hapus mata kuliah?'}
          message={`"${confirmTarget.nama}" beserta seluruh tugas di dalamnya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </aside>
  )
}
