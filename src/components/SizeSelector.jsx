export default function SizeSelector({ sizes, selected, onSelect }) {
  if (!sizes?.length) return null

  return (
    <div>
      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest2 text-archive-400">
        Beden
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {sizes.map((size) => {
          const outOfStock = size.stock <= 0
          const isSelected = selected === size.label
          return (
            <button
              key={size.label}
              type="button"
              disabled={outOfStock}
              onClick={() => onSelect(size.label)}
              className={[
                'h-11 min-w-11 rounded-full border px-4 font-mono text-sm transition-colors',
                outOfStock
                  ? 'cursor-not-allowed border-archive-800 text-archive-600 line-through'
                  : isSelected
                  ? 'border-bone bg-bone text-obsidian'
                  : 'border-archive-400/40 text-bone hover:border-bone'
              ].join(' ')}
            >
              {size.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
