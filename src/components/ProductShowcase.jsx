import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ColorPicker from './ColorPicker.jsx'
import SizeSelector from './SizeSelector.jsx'
import BuyButton from './BuyButton.jsx'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.25 }
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
}

export default function ProductShowcase({ product }) {
  const [colorIndex, setColorIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)

  const accent = product.colors?.[colorIndex]?.hex ?? '#8E7BA8'

  const allOutOfStock =
    (product.sizes?.length ?? 0) > 0 &&
    product.sizes.every((s) => (s.stock ?? 0) <= 0)

  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0
      }).format(product.price ?? 0),
    [product.price]
  )

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-4 sm:px-10 lg:pt-10">
      {/* Cinematic ambient glow — the "whole page" tone that evolves with the
          selected colorway, using a spring so the shift feels physical rather
          than a flat CSS transition. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        animate={{ backgroundColor: accent, opacity: 0.35 }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-6">
        {/* Product visual — 3D-feeling transparent PNG on a spring entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 14, mass: 0.9 }}
          whileHover={{ scale: 1.035, rotate: 0.6, y: -6 }}
          className="relative order-1 flex items-center justify-center lg:order-2"
        >
          <span className="pointer-events-none absolute font-display text-[26vw] font-800 leading-none text-archive-800/40 sm:text-[16vw] lg:text-[11vw]">
            {product.archive_index ?? '001'}
          </span>
          <motion.img
            src={product.image_url}
            alt={product.name}
            draggable={false}
            className="relative z-10 w-[70%] max-w-md select-none drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)] sm:w-[75%]"
            style={{ transformStyle: 'preserve-3d', opacity: allOutOfStock ? 0.45 : 1 }}
          />
          {allOutOfStock && (
            <span className="absolute z-20 rounded-full border border-bone/40 bg-obsidian/80 px-4 py-1.5 font-mono text-xs uppercase tracking-widest2 text-bone">
              Stokta Yok
            </span>
          )}
        </motion.div>

        {/* Info panel — staggered fade-in-up on load */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative order-2 flex flex-col gap-8 lg:order-1"
        >
          <motion.p
            variants={fadeUp}
            className="font-mono text-xs uppercase tracking-widest2"
            style={{ color: accent }}
          >
            Valeni Archive — Parça N.{product.archive_index ?? '001'}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl font-700 leading-[0.95] text-bone sm:text-6xl lg:text-7xl"
          >
            {product.name}
          </motion.h1>

          {product.description && (
            <motion.p
              variants={fadeUp}
              className="max-w-md text-sm leading-relaxed text-archive-200"
            >
              {product.description}
            </motion.p>
          )}

          <motion.p
            variants={fadeUp}
            className="font-display text-3xl font-600 text-bone"
          >
            {formattedPrice}
          </motion.p>

          <motion.div variants={fadeUp}>
            <ColorPicker
              colors={product.colors}
              selectedIndex={colorIndex}
              onSelect={setColorIndex}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <SizeSelector
              sizes={product.sizes}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <BuyButton
              product={product}
              selectedSize={selectedSize}
              selectedColor={product.colors?.[colorIndex]}
              outOfStock={allOutOfStock}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
          }
