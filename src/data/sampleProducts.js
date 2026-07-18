// Supabase tablosu boşken (ör. ilk kurulumda) vitrinin boş görünmemesi için
// örnek/demo veri. products state'i Supabase'den veri gelince bunun yerine geçer.
export const sampleProducts = [
  {
    id: 'demo-01',
    name: 'Nocturne Trench',
    archive_index: '001',
    price: 4850,
    description:
      'Ham yünden dökümlü kesim, arşivin ilk parçası. Sınırlı sayıda üretildi.',
    colors: [
      { name: 'Obsidian', hex: '#0A0A0B' },
      { name: 'Bone', hex: '#F3EFE7' },
      { name: 'Lilac Dusk', hex: '#8E7BA8' }
    ],
    sizes: [
      { label: 'S', stock: 4 },
      { label: 'M', stock: 7 },
      { label: 'L', stock: 2 },
      { label: 'XL', stock: 0 }
    ],
    image_url:
      'https://images.unsplash.com/png-transparency-placeholder.png'
  }
]
