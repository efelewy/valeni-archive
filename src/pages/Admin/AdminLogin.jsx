import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ADMIN_PASSWORD) {
      setError('VITE_ADMIN_PASSWORD .env dosyasında tanımlı değil.')
      return
    }
    if (password === ADMIN_PASSWORD) {
      setError('')
      onSuccess()
    } else {
      setError('Şifre hatalı.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian px-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-2xl border border-archive-800 bg-archive-900 p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-archive-800">
            <Lock className="h-4 w-4 text-bone" />
          </span>
          <div>
            <p className="font-display text-lg font-700 text-bone">Admin Girişi</p>
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-archive-400">
              Valeni Archive
            </p>
          </div>
        </div>

        <label htmlFor="password" className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-archive-400">
          Şifre
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-archive-600 bg-obsidian px-4 py-3 text-bone outline-none focus:border-bone"
          placeholder="••••••••"
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-bone py-3 font-display font-600 uppercase tracking-wide text-obsidian"
        >
          Giriş Yap
        </button>
      </motion.form>
    </div>
  )
}
