import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const SHOPIER_BASE_URL =
  import.meta.env.VITE_SHOPIER_BASE_URL ||
  'https://www.shopier.com/ShowProductNew/products.php?id='

export default function BuyButton({ product, selectedSize, selectedColor }) {
  const disabled = !selectedSize

  const href = product?.shopier_id
    ? `${SHOPIER_BASE_URL}${product.shopier_id}`
    : '#'

  return (
    <motion.a
      href={disabled ? undefined : href}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={[
        'group flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-display text-base font-600 uppercase tracking-wide sm:w-auto sm:px-10',
        disabled
          ? 'pointer-events-none bg-archive-800 text-archive-600'
          : 'bg-bone text-obsidian'
      ].join(' ')}
    >
      {disabled ? 'Önce beden seçin' : 'Shopier ile Öde'}
      {!disabled && (
        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </motion.a>
  )
}
