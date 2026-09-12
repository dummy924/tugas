import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase.js'
import { useAuth } from './AuthContext.jsx'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { currentUser } = useAuth()
  const uid = currentUser?.uid || null

  const [semesters, setSemesters] = useState([])
  const [mataKuliah, setMataKuliah] = useState([])
  const [tugas, setTugas] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  // Referensi koleksi per-user: users/{uid}/semesters, mataKuliah, tugas
  const paths = useMemo(() => {
    if (!uid) return null
    return {
      semesters: collection(db, 'users', uid, 'semesters'),
      mataKuliah: collection(db, 'users', uid, 'mataKuliah'),
      tugas: collection(db, 'users', uid, 'tugas'),
    }
  }, [uid])

  useEffect(() => {
    if (!uid || !paths) {
      setSemesters([])
      setMataKuliah([])
      setTugas([])
      setDataLoading(false)
      return
    }
    setDataLoading(true)
    let pending = 3
    const done = () => {
      pending -= 1
      if (pending <= 0) setDataLoading(false)
    }

    const unsub1 = onSnapshot(
      query(paths.semesters, orderBy('urutan', 'asc')),
      (snap) => {
        setSemesters(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        done()
      },
      (err) => {
        console.error('Gagal memuat semester:', err)
        done()
      }
    )
    const unsub2 = onSnapshot(
      query(paths.mataKuliah, orderBy('createdAt', 'asc')),
      (snap) => {
        setMataKuliah(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        done()
      },
      (err) => {
        console.error('Gagal memuat mata kuliah:', err)
        done()
      }
    )
    const unsub3 = onSnapshot(
      query(paths.tugas, orderBy('createdAt', 'desc')),
      (snap) => {
        setTugas(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        done()
      },
      (err) => {
        console.error('Gagal memuat tugas:', err)
        done()
      }
    )

    return () => {
      unsub1()
      unsub2()
      unsub3()
    }
  }, [uid, paths])

  // ---------- Semester ----------
  const addSemester = async (nama) => {
    if (!paths) return
    await addDoc(paths.semesters, {
      nama,
      urutan: semesters.length,
      createdAt: serverTimestamp(),
    })
  }

  const updateSemester = async (id, nama) => {
    if (!uid) return
    await updateDoc(doc(db, 'users', uid, 'semesters', id), { nama })
  }

  const deleteSemester = async (id) => {
    if (!uid) return
    const batch = writeBatch(db)
    const mkIds = mataKuliah.filter((m) => m.semesterId === id).map((m) => m.id)
    tugas.filter((t) => mkIds.includes(t.mkId)).forEach((t) => {
      batch.delete(doc(db, 'users', uid, 'tugas', t.id))
    })
    mkIds.forEach((mkId) => {
      batch.delete(doc(db, 'users', uid, 'mataKuliah', mkId))
    })
    batch.delete(doc(db, 'users', uid, 'semesters', id))
    await batch.commit()
  }

  // ---------- Mata Kuliah ----------
  const addMataKuliah = async (nama, semesterId) => {
    if (!paths) return
    await addDoc(paths.mataKuliah, {
      nama,
      semesterId,
      createdAt: serverTimestamp(),
    })
  }

  const updateMataKuliah = async (id, nama) => {
    if (!uid) return
    await updateDoc(doc(db, 'users', uid, 'mataKuliah', id), { nama })
  }

  const deleteMataKuliah = async (id) => {
    if (!uid) return
    const batch = writeBatch(db)
    tugas.filter((t) => t.mkId === id).forEach((t) => {
      batch.delete(doc(db, 'users', uid, 'tugas', t.id))
    })
    batch.delete(doc(db, 'users', uid, 'mataKuliah', id))
    await batch.commit()
  }

  // ---------- Tugas ----------
  const addTugas = async ({ judul, deskripsi, mkId, prioritas, deadline }) => {
    if (!paths) return
    await addDoc(paths.tugas, {
      judul,
      deskripsi: deskripsi || '',
      mkId,
      prioritas: prioritas || 'sedang',
      deadline: deadline || '',
      selesai: false,
      buktiPenyelesaian: '',
      createdAt: serverTimestamp(),
    })
  }

  const updateTugas = async (id, data) => {
    if (!uid) return
    await updateDoc(doc(db, 'users', uid, 'tugas', id), data)
  }

  const markSelesai = async (id, buktiPenyelesaian) => {
     if (!uid) return
     await updateDoc(doc(db, 'users', uid, 'tugas', id), {
       selesai: true,
       buktiPenyelesaian: buktiPenyelesaian || '',
     })
   }

   const markBelumSelesai = async (id) => {
     if (!uid) return
     await updateDoc(doc(db, 'users', uid, 'tugas', id), { selesai: false })
   }

  const deleteTugas = async (id) => {
    if (!uid) return
    await deleteDoc(doc(db, 'users', uid, 'tugas', id))
  }

  const deleteMultipleTugas = async (ids) => {
    if (!uid || ids.length === 0) return
    const batch = writeBatch(db)
    ids.forEach((id) => batch.delete(doc(db, 'users', uid, 'tugas', id)))
    await batch.commit()
  }

  const value = {
    semesters,
    mataKuliah,
    tugas,
    dataLoading,
    addSemester,
    updateSemester,
    deleteSemester,
    addMataKuliah,
    updateMataKuliah,
    deleteMataKuliah,
    addTugas,
    updateTugas,
    markSelesai,
    markBelumSelesai,
    deleteTugas,
    deleteMultipleTugas,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData harus dipakai di dalam DataProvider')
  return ctx
}
