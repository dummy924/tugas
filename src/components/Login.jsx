import { GraduationCap } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, authError } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-zinc-950 px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-maroon-600 flex items-center justify-center mb-6">
          <GraduationCap className="w-7 h-7 text-white" strokeWidth={1.75} />
        </div>
        <h1 className="font-display text-3xl text-stone-900 dark:text-zinc-100 mb-2">
          Tugas Kuliah
        </h1>
        <p className="text-stone-500 dark:text-zinc-400 mb-8 text-[15px] leading-relaxed">
          Catat tugas per mata kuliah, per semester. Datanya tersimpan aman di akun
          Google kamu sendiri.
        </p>

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 rounded-lg border border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-5 py-3 text-stone-800 dark:text-zinc-100 font-medium hover:border-stone-400 dark:hover:border-zinc-600 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.9 32.9 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 15.9 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5c-2 1.5-4.6 2.4-7.5 2.4-5.4 0-9.9-3.1-11.3-7.9l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.9 2.8-2.9 5.1-5.4 6.5l6.5 5.5C40 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"
            />
          </svg>
          Masuk dengan Google
        </button>

        {authError && (
          <p className="mt-4 text-sm text-maroon-600 dark:text-maroon-300">{authError}</p>
        )}
      </div>
    </div>
  )
}
