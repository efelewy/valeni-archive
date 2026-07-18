import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar.jsx'
import ProductShowcase from '../components/ProductShowcase.jsx'
import { supabase } from '../lib/supabaseClient.js'
import { sampleProducts } from '../data/sampleProducts.js'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) {
      setProducts(sampleProducts)
    } else {
      setProducts(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProducts()

    // Admin panelinden yeni ürün eklendiği an, sayfayı yenilemeden
    // vitrine otomatik düşmesi için realtime dinleyici.
    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'products' },
        () => loadProducts()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadProducts])

  const featured = products[0]

  return (
    <div className="relative min-h-screen">
      <Navbar archiveCount={products.length || 1} />

      <AnimatePresence mode="wait">
        {!loading && featured && (
          <motion.div
            key={featured.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductShowcase product={featured} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
