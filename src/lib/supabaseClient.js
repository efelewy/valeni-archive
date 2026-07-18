import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Valeni Archive] Supabase env değişkenleri bulunamadı. .env dosyanızı .env.example üzerinden oluşturun.'
  )
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '')

// Ürün görselleri için kullanılan storage bucket adı.
// Supabase panelinde Storage > New Bucket ile "product-images" adında
// public bir bucket oluşturmanız gerekir.
export const PRODUCT_IMAGE_BUCKET = 'product-images'
