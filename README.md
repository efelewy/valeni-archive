# Valeni Archive — Premium Landing Page

React + Tailwind CSS + Framer Motion + Supabase ile kurulmuş, tek-ürün
vitrin (showcase) mantığında, gizli bir `/admin` paneliyle yönetilebilen
premium bir landing page.

## Kurulum

```bash
npm install
```

Gerekli tüm paketler `package.json` içinde tanımlı:
`react-router-dom`, `framer-motion`, `lucide-react`, `@supabase/supabase-js`,
`tailwindcss`.

### 1) Supabase projesi kur

1. [supabase.com](https://supabase.com) üzerinde ücretsiz bir proje açın.
2. Proje panelinde **SQL Editor**'ü açın, bu repodaki `supabase/schema.sql`
   dosyasının tamamını yapıştırıp çalıştırın. Bu, `products` tablosunu ve
   `product-images` adında public bir Storage bucket'ını oluşturur.
3. **Project Settings > API** sayfasından `Project URL` ve `anon public` key
   değerlerini kopyalayın.

### 2) Ortam değişkenlerini ayarla

`.env.example` dosyasını `.env` olarak kopyalayın ve doldurun:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ADMIN_PASSWORD=...
VITE_SHOPIER_BASE_URL=...
```

### 3) Geliştirme sunucusunu başlat

```bash
npm run dev
```

- Vitrin: `http://localhost:5173/`
- Gizli admin paneli: `http://localhost:5173/admin`

## Mimari

```
src/
  components/
    Navbar.jsx           — üst bar, marka wordmark'ı
    ProductShowcase.jsx  — ana vitrin modülü (görsel + bilgi paneli)
    ColorPicker.jsx       — renk seçici, sayfa tonunu tetikler
    SizeSelector.jsx      — stok bilinçli beden seçici
    BuyButton.jsx          — Shopier'e yönlendiren CTA
  pages/
    Home.jsx              — Supabase'den ürünleri çeker + realtime dinler
    Admin/
      AdminGate.jsx        — login / dashboard yönlendirmesi
      AdminLogin.jsx        — şifreli giriş ekranı
      AdminDashboard.jsx    — ürün listesi + form
      ProductForm.jsx        — yeni ürün ekleme formu (görsel yükleme dahil)
  lib/supabaseClient.js    — Supabase bağlantısı
  data/sampleProducts.js   — Supabase boşken gösterilen demo veri
```

### Vitrin davranışı

- Sayfa yüklendiğinde ürün görseli `spring` fizikli bir giriş animasyonuyla
  belirir; kart hover edildiğinde hafifçe öne/yukarı doğru yaylanır.
- Başlık, fiyat, beden ve "Shopier ile Öde" butonu staggered (art arda)
  fade-in-up ile sırayla süzülerek gelir.
- Renk butonlarından biri seçildiğinde, ürünün arkasındaki büyük blur'lu
  ambiyans ışığı ve tüm ince detay tonları (fiyat başlığı, arşiv numarası,
  seçili renk halkası) `spring` geçişiyle o rengin tonuna evrilir — sayfa
  düz bir renge boyanmaz, sinematik bir ışık/detay geçişi hissi verir.

### Admin paneli

- `/admin` hiçbir yerden linklenmez, yalnızca URL'i bilen erişebilir.
- Basit şifre koruması `VITE_ADMIN_PASSWORD` ile yapılır; oturum
  `sessionStorage`'da tutulur (sekme kapanınca sıfırlanır).
- Ürün eklendiğinde: görsel Supabase Storage'a yüklenir, satır `products`
  tablosuna yazılır ve `Home.jsx`'teki realtime dinleyici sayesinde vitrin
  sayfayı yenilemeden otomatik güncellenir.

## Netlify'a deploy

Proje `netlify.toml` ve `public/_redirects` ile birlikte geliyor, bu yüzden
`/admin` gibi rotalar Netlify'da 404 vermez.

**En kolay yol — GitHub üzerinden:**

1. Bu klasörü bir GitHub reposuna push edin (`.env` dosyası `.gitignore`
   sayesinde repoya gitmez — anahtarlarınız güvende kalır).
2. [app.netlify.com](https://app.netlify.com) → **Add new site > Import an
   existing project** → GitHub reponuzu seçin.
3. Build settings otomatik gelir (`netlify.toml`'dan): build command
   `npm run build`, publish directory `dist`.
4. **Site settings > Environment variables** kısmına `.env` dosyanızdaki
   dört değişkeni tek tek ekleyin: `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_PASSWORD`, `VITE_SHOPIER_BASE_URL`.
5. **Deploy site**'a basın.

**Alternatif — Netlify CLI ile (GitHub'sız):**

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

CLI size publish directory sorduğunda `dist` yazın. Bu yöntemde de
environment variable'ları Netlify dashboard'undan (adım 4) eklemeniz gerekir
— CLI ile deploy ederken `.env` otomatik taşınmaz.



Buradaki admin koruması demo/tek-kullanıcı senaryosu için basit tutulmuştur
(client-side şifre kontrolü). Gerçek bir prodüksiyon ortamı için:

- Supabase Auth ile gerçek bir kullanıcı girişi kurup `/admin` rotasını
  oturum kontrolüyle korumanız,
- `insert`/`update`/`delete` RLS politikalarını yalnızca doğrulanmış admin
  kullanıcıya izin verecek şekilde sıkılaştırmanız

önerilir. `supabase/schema.sql` içindeki politikalar bu sıkılaştırmayı
kolaylaştıracak şekilde yorumlarla işaretlenmiştir.

## Ürün görseli önerisi

En iyi sonuç için arka planı şeffaf (PNG), yüksek çözünürlüklü, hafif
gölgeli/3D render tarzı ürün fotoğrafları kullanın — `ProductShowcase.jsx`
görseli otomatik olarak yumuşak bir drop-shadow ile sahneler.
