import { useState } from 'react'
import { Plus, Pencil, Trash2, BookOpen, X } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import SemesterModal from './SemesterModal.jsx'
import MataKuliahModal from './MataKuliahModal.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'

export default function Sidebar({
  open,
  onClose,
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

  // Di layar kecil, memilih semester/mata kuliah otomatis menutup menu hamburger
  const handleSelectSemester = (id) => {
    setSelectedSemesterId(id)
    setSelectedMkId('all')
    onClose?.()
  }

  const handleSelectMk = (id) => {
    setSelectedMkId(id)
    onClose?.()
  }

  return (
    <>
      {/* Overlay gelap di belakang drawer - hanya tampil di layar kecil saat menu dibuka */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] flex flex-col
          border-r border-stone-200 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-950
          transform transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto md:w-64 md:h-screen md:sticky md:top-0
        `}
      >
        {/* Header drawer, cuma tampil di layar kecil */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-zinc-800 md:hidden">
          <span className="font-display text-lg text-stone-900 dark:text-zinc-100">Menu</span>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200"
            title="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Kartu Semester - kotak terpisah sendiri */}
          <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-3">
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
                    onClick={() => handleSelectSemester(s.id)}
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

          {/* Kartu Mata Kuliah - kotak terpisah sendiri, TIDAK digabung dengan kartu Semester */}
          {selectedSemesterId && (
            <div className="rounded-xl border border-stone-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-3">
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
                onClick={() => handleSelectMk('all')}
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
                      onClick={() => handleSelectMk(mk.id)}
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
    </>
  )
}
