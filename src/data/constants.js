import nhutImage from '../assets/avatar1.webp';
import thuImage from '../assets/avatar2.webp';

const memories = [
  { id: 1, image: 'https://i.pinimg.com/564x/77/52/0f/77520f267f58d978053405aea04e4365.jpg' },
  { id: 2, image: 'https://images2.thanhnien.vn/528068263637045248/2024/1/25/428059e47aeafb68640f168d615371dc-65a11b038315c880-1706156293087602824781.jpg' },
  { id: 3, image: 'https://cdn-images.vtv.vn/2018/11/22/photo-3-15428716111551636354706.jpg' },
  { id: 4, image: 'https://i.pinimg.com/236x/f5/36/f4/f536f417b1e901255f572d9fa8f255d8.jpg' },
  { id: 5, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYCgcygUmH6Bfb5W2i00HumEUsew78uChI6A&s' }
];

const galleryData = [
  {
    date: '11-01-2026',
    items: [
      { id: 1, type: 'image', url: 'https://i.pinimg.com/564x/77/52/0f/77520f267f58d978053405aea04e4365.jpg', name: 'memory_11_01_2026_1.jpg' },
      { id: 2, type: 'image', url: 'https://images2.thanhnien.vn/528068263637045248/2024/1/25/428059e47aeafb68640f168d615371dc-65a11b038315c880-1706156293087602824781.jpg', name: 'memory_11_01_2026_2.jpg' },
      { id: 3, type: 'image', url: 'https://cdn-images.vtv.vn/2018/11/22/photo-3-15428716111551636354706.jpg', name: 'memory_11_01_2026_3.jpg' }
    ]
  },
  {
    date: '10-01-2026',
    items: [
      { id: 4, type: 'image', url: 'https://i.pinimg.com/236x/f5/36/f4/f536f417b1e901255f572d9fa8f255d8.jpg', name: 'memory_10_01_2026_1.jpg' },
      { id: 5, type: 'image', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYCgcygUmH6Bfb5W2i00HumEUsew78uChI6A&s', name: 'memory_10_01_2026_2.jpg' }
    ]
  },
  {
    date: '09-01-2026',
    items: [
      { id: 6, type: 'image', url: 'https://24hstore.vn/upload_images/images/hinh-nen-anime/hinh-nen-anime-ngau-nam-1.jpg', name: 'memory_09_01_2026_1.jpg' },
      { id: 7, type: 'image', url: 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-anh-anime-trang-girl-cute-inkythuatso-04-08-14-34.jpg', name: 'memory_09_01_2026_2.jpg' },
      { id: 8, type: 'image', url: 'https://cdn-media.sforum.vn/storage/app/media/Van%20Pham/hinh-nen-anime-83.jpg', name: 'memory_09_01_2026_3.jpg' }
    ]
  }
];

const profileImages = {
  nhut: nhutImage,
  thu: thuImage
};

export { memories, galleryData, profileImages };