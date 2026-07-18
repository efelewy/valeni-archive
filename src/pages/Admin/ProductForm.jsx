import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, UploadCloud, Loader2 } from 'lucide-react'
import { supabase, PRODUCT_IMAGE_BUCKET } from '../../lib/supabaseClient.js'

const emptyColor = () => ({ name: '', hex: '#0A0A0B' })
const emptySize = () => ({ label: '', stock: 0 })

export default function ProductForm({ onCreated }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [shopierId, setShopierId] = useState('')
  const [colors, setColors] = useState([emptyColor()])
  const [sizes, setSizes] = useState([emptySize()])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const updateColor = (i, patch) =>
    setColors((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)))

  const updateSize = (i, patch) =>
    setSizes((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const resetForm = () => {
    setName('')
    setPrice('')
    setDescription('')
    setShopierId('')
    setColors([emptyColor()])
    setSizes([emptySize()])
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    if (!name || !price || !imageFile) {
      setStatus({ type: 'error', message: 'Ürün adı, fiyat ve görsel zorunludur.' })
      return
    }

    setSubmitting(true)
    try {
      // 1) Görseli Supabase Storage'a yükle
      const fileExt = imageFile.name.split('.').pop()
      const filePath = `${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .upload(filePath, imageFile, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from(PRODUCT_IMAGE_BUCKET)
        .getPublicUrl(filePath)

      // 2) Ürün satırını veri tabanına yaz
      const { error: insertError } = await supabase.from('products').insert({
        name,
        price: Number(price),
        description,
        shopier_id: shopierId || null,
        image_url: publicUrlData.publicUrl,
        colors: colors.filter((c) => c.name && c.hex),
        sizes: sizes
          .filter((s) => s.label)
          .map((s) => ({ label: s.label, stock: Number(s.stock) || 0 }))
      })

      if (insertError) throw insertError

      setStatus({ type: 'success', message: 'Ürün eklendi ve vitrine düştü.' })
      resetForm()
      onCreated?.()
    } catch (err) {
      setStatus({ type: 'error', message: err.message ?? 'Beklenmeyen bir hata oluştu.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Ürün Adı">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Nocturne Trench"
            required
          />
        </Field>

        <Field label="Fiyat (₺)">
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="input"
            placeholder="4850"
            required
          />
        </Field>

        <Field label="Shopier Ürün ID (opsiyonel)">
          <input
            value={shopierId}
            onChange={(e) => setShopierId(e.target.value)}
            className="input"
            placeholder="123456"
          />
        </Field>

        <Field label="Ürün Görseli (PNG, şeffaf zemin)">
          <label className="flex h-[46px] cursor-pointer items-center gap-2 rounded-lg border border-dashed border-archive-600 px-4 text-sm text-archive-200 hover:border-bone">
            <UploadCloud className="h-4 w-4" />
            {imageFile ? imageFile.name : 'Dosya seç'}
            <input type="file" accept="image/png" onChange={handleFile} className="hidden" />
          </label>
        </Field>
      </div>

      <Field label="Açıklama">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="input resize-none"
          placeholder="Kısa arşiv notu..."
        />
      </Field>

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Önizleme"
          className="h-40 w-40 rounded-xl border border-archive-800 bg-archive-900 object-contain p-3"
        />
      )}

      {/* Renk seçenekleri */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest2 text-archive-400">
            Renk Seçenekleri
          </p>
          <button
            type="button"
            onClick={() => setColors((prev) => [...prev, emptyColor()])}
            className="flex items-center gap-1 text-xs text-bone hover:opacity-70"
          >
            <Plus className="h-3.5 w-3.5" /> Renk ekle
          </button>
        </div>
        <div className="space-y-2">
          {colors.map((color, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(i, { hex: e.target.value })}
                className="h-10 w-10 cursor-pointer rounded border border-archive-600 bg-transparent"
              />
              <input
                value={color.name}
                onChange={(e) => updateColor(i, { name: e.target.value })}
                placeholder="Renk adı (ör. Lilac Dusk)"
                className="input flex-1"
              />
              <input
                value={color.hex}
                onChange={(e) => updateColor(i, { hex: e.target.value })}
                className="input w-28 font-mono"
              />
              <button
                type="button"
                onClick={() => setColors((prev) => prev.filter((_, idx) => idx !== i))}
                className="text-archive-400 hover:text-red-400"
                aria-label="Rengi sil"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Beden stokları */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-widest2 text-archive-400">
            Beden Stokları
          </p>
          <button
            type="button"
            onClick={() => setSizes((prev) => [...prev, emptySize()])}
            className="flex items-center gap-1 text-xs text-bone hover:opacity-70"
          >
            <Plus className="h-3.5 w-3.5" /> Beden ekle
          </button>
        </div>
        <div className="space-y-2">
          {sizes.map((size, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={size.label}
                onChange={(e) => updateSize(i, { label: e.target.value })}
                placeholder="S / M / L / XL"
                className="input w-28"
              />
              <input
                type="number"
                min="0"
                value={size.stock}
                onChange={(e) => updateSize(i, { stock: e.target.value })}
                placeholder="Stok adedi"
                className="input flex-1"
              />
              <button
                type="button"
                onClick={() => setSizes((prev) => prev.filter((_, idx) => idx !== i))}
                className="text-archive-400 hover:text-red-400"
                aria-label="Bedeni sil"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {status && (
        <p className={status.type === 'error' ? 'text-sm text-red-400' : 'text-sm text-emerald-400'}>
          {status.message}
        </p>
      )}

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: submitting ? 1 : 1.02 }}
        whileTap={{ scale: submitting ? 1 : 0.97 }}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-bone py-3 font-display font-600 uppercase tracking-wide text-obsidian disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? 'Ekleniyor...' : 'Ürün Ekle'}
      </motion.button>
    </form>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-archive-400">
        {label}
      </span>
      {children}
    </label>
  )
        }
