import { motion } from 'framer-motion'

export default function Navbar({ archiveCount = 1 }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8"
    >
      <span className="font-display text-xl sm:text-2xl font-700 tracking-tight text-bone">
        VALENI <span className="text-archive-400">ARCHIVE</span>
      </span>
      <span className="hidden sm:block font-mono text-[11px] uppercase tracking-widest2 text-archive-400">
        Koleksiyon — N.{String(archiveCount).padStart(3, '0')}
      </span>
    </motion.header>
  )
}
