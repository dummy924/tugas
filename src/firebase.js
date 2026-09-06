import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// =====================================================================
// GANTI bagian di bawah ini dengan config project Firebase kamu sendiri.
// Cara mendapatkannya ada di README.md (langkah "Ambil Firebase Config").
// =====================================================================
const firebaseConfig = {
apiKey: "AIzaSyDgMm-W5ix_sMuEPBSHrtd-itrPwd4ge38",
  authDomain: "tugas-9ae0f.firebaseapp.com",
  projectId: "tugas-9ae0f",
  storageBucket: "tugas-9ae0f.firebasestorage.app",
  messagingSenderId: "423988894895",
  appId: "1:423988894895:web:917db3ef8f82a9a8d7885a",
  measurementId: "G-48VJWMZN63"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
