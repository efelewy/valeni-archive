-- Valeni Archive — Supabase şeması
-- Supabase Dashboard > SQL Editor içine yapıştırıp çalıştırın.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null,
  price numeric not null,
  description text,
  archive_index text,
  shopier_id text,
  image_url text not null,
  colors jsonb not null default '[]',   -- [{ "name": "Lilac Dusk", "hex": "#8E7BA8" }]
  sizes jsonb not null default '[]'     -- [{ "label": "M", "stock": 7 }]
);

-- Herkes ürünleri okuyabilsin (vitrin herkese açık)
alter table public.products enable row level security;

create policy "Public can read products"
  on public.products for select
  using (true);

-- Ekleme/güncelleme/silme yalnızca anon key + admin şifre akışıyla,
-- uygulama tarafında korunuyor. Üretimde bu politikayı kendi auth
-- modelinize göre (ör. Supabase Auth ile giriş yapan admin kullanıcı)
-- sıkılaştırmanız önerilir.
create policy "Public can insert products"
  on public.products for insert
  with check (true);

-- Storage: ürün görselleri için public bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Public can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');
