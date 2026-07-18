import { motion } from 'framer-motion'

export default function ColorPicker({ colors, selectedIndex, onSelect }) {
  if (!colors?.length) return null

  return (
    <div>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest2 text-archive-400">
        Renk — {colors[selectedIndex]?.name}
      </p>
      <div className="flex items-center gap-3">
        {colors.map((color, i) => (
          <button
            key={color.hex + i}
            type="button"
            aria-label={`Renk seç: ${color.name}`}
            aria-pressed={selectedIndex === i}
            onClick={() => onSelect(i)}
            className="relative h-9 w-9 rounded-full"
          >
            <span
              className="absolute inset-0 rounded-full ring-1 ring-bone/20"
              style={{ backgroundColor: color.hex }}
            />
            {selectedIndex === i && (
              <motion.span
                layoutId="color-ring"
                className="absolute -inset-1.5 rounded-full border border-bone"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
