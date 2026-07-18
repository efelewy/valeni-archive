import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { LogOut, ExternalLink, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient.js'
import ProductForm from './ProductForm.jsx'

export default function AdminDashboard({ onLogout }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`"${name}" ürününü silmek istediğinize emin misiniz?`)
    if (!confirmed) return

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      loadProducts()
    } else {
      window.alert('Silinemedi: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-700 text-bone">Admin Paneli</p>
            <p className="font-mono text-[11px] uppercase tracking-widest2 text-archive-400">
              Valeni Archive — Ürün Yönetimi
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-full border border-archive-600 px-4 py-2 text-sm text-bone hover:border-bone"
          >
            <LogOut className="h-4 w-4" /> Çıkış
          </button>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 rounded-2xl border border-archive-800 bg-archive-900 p-8"
        >
          <p className="mb-6 font-display text-lg font-700 text-bone">Yeni Ürün Ekle</p>
          <ProductForm onCreated={loadProducts} />
        </motion.section>

        <section>
          <p className="mb-4 font-display text-lg font-700 text-bone">
            Mevcut Ürünler {!loading && `(${products.length})`}
          </p>
          <div className="space-y-3">
            {products.map((p) => {
              const outOfStock =
                (p.sizes?.length ?? 0) > 0 &&
                p.sizes.every((s) => (s.stock ?? 0) <= 0)

              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 rounded-xl border border-archive-800 bg-archive-900 p-4"
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="h-14 w-14 rounded-lg bg-obsidian object-contain p-1"
                  />
                  <div className="flex-1">
                    <p className="font-display text-base font-600 text-bone">{p.name}</p>
                    <p className="font-mono text-xs text-archive-400">
                      {new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                        maximumFractionDigits: 0
                      }).format(p.price ?? 0)}
                    </p>
                    {outOfStock && (
                      <span className="mt-1 inline-block rounded-full bg-red-950 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest2 text-red-400">
                        Stokta Yok
                      </span>
                    )}
                  </div>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-archive-400 hover:text-bone"
                    aria-label="Vitrinde gör"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="text-archive-400 hover:text-red-400"
                    aria-label="Ürünü sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
            {!loading && products.length === 0 && (
              <p className="text-sm text-archive-400">Henüz ürün eklenmedi.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
                      }
