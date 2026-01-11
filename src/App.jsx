import { useState, useEffect } from 'react';
import { Heart, Grid, ArrowLeft, Calendar, Download, X } from 'lucide-react';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [days, setDays] = useState(1083);
  const [timeMode, setTimeMode] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloading, setDownloading] = useState(false);
  
  // Prevent horizontal swipe and overscroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    const preventSwipe = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const startX = touch.clientX;
        
        const handleMove = (moveEvent) => {
          if (moveEvent.touches && moveEvent.touches.length > 0) {
            const moveTouch = moveEvent.touches[0];
            const deltaX = Math.abs(moveTouch.clientX - startX);
            const deltaY = Math.abs(moveTouch.clientY - touch.clientY);
            
            if (deltaX > deltaY) {
              moveEvent.preventDefault();
            }
          }
        };
        
        document.addEventListener('touchmove', handleMove, { passive: false });
        
        const cleanup = () => {
          document.removeEventListener('touchmove', handleMove);
        };
        
        document.addEventListener('touchend', cleanup, { once: true });
      }
    };
    
    document.addEventListener('touchstart', preventSwipe, { passive: false });
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.removeEventListener('touchstart', preventSwipe);
    };
  }, []);
  
  const memories = [
    { id: 1, image: 'https://vn1.vdrive.vn/alohamedia.vn/2025/02/dc0ef9f664914981865e0d114a39632f.jpg' },
    { id: 2, image: 'https://images2.thanhnien.vn/528068263637045248/2024/1/25/428059e47aeafb68640f168d615371dc-65a11b038315c880-1706156293087602824781.jpg' },
    { id: 3, image: 'https://cdn-images.vtv.vn/2018/11/22/photo-3-15428716111551636354706.jpg' },
    { id: 4, image: 'https://i.pinimg.com/236x/f5/36/f4/f536f417b1e901255f572d9fa8f255d8.jpg' },
    { id: 5, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYCgcygUmH6Bfb5W2i00HumEUsew78uChI6A&s' }
  ];

  // Gallery data organized by date
  const galleryData = [
    {
      date: '11-01-2026',
      items: [
        { id: 1, type: 'image', url: 'https://vn1.vdrive.vn/alohamedia.vn/2025/02/dc0ef9f664914981865e0d114a39632f.jpg', name: 'memory_11_01_2026_1.jpg' },
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

  const musicImage = 'https://cdn-media.sforum.vn/storage/app/media/Van%20Pham/hinh-nen-anime-83.jpg';

  const totalYears = Math.floor(days / 365);
  const remainingDaysAfterYears = days % 365;
  const monthsAfterYears = Math.floor(remainingDaysAfterYears / 30);
  
  const totalMonths = Math.floor(days / 30);
  const totalWeeks = Math.floor(days / 7);
  const totalHours = days * 24;

  const handleTimeClick = () => {
    setTimeMode((prev) => (prev + 1) % 5);
  };

  const getTimeDisplay = () => {
    switch(timeMode) {
      case 0: 
        return { value: days, unit: 'ngày' };
      case 1: 
        if (totalYears === 0) {
          return { value: totalMonths, unit: 'tháng' };
        }
        return { value: `${totalYears} năm ${monthsAfterYears}`, unit: 'tháng' };
      case 2: 
        return { value: totalMonths, unit: 'tháng' };
      case 3: 
        return { value: totalWeeks, unit: 'tuần' };
      case 4: 
        return { value: totalHours.toLocaleString(), unit: 'giờ' };
      default: 
        return { value: days, unit: 'ngày' };
    }
  };

  const currentTime = getTimeDisplay();

  // Download function
  const downloadImage = async (url, filename) => {
    try {
      setDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(blobUrl);
      setDownloading(false);
    } catch (error) {
      console.error('Download failed:', error);
      setDownloading(false);
      alert('Không thể tải xuống. Vui lòng thử lại!');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % memories.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [memories.length]);

  const getSlideStyle = (index) => {
    const diff = index - currentSlide;
    const totalSlides = memories.length;
    
    let normalizedDiff = diff;
    if (Math.abs(diff) > totalSlides / 2) {
      normalizedDiff = diff > 0 ? diff - totalSlides : diff + totalSlides;
    }
    
    if (normalizedDiff === 0) {
      return { 
        transform: 'translateX(0%) scale(1) rotateY(0deg)', 
        zIndex: 50, 
        opacity: 1 
      };
    } else if (normalizedDiff === 1) {
      return { 
        transform: 'translateX(85%) scale(0.9) rotateY(-25deg)', 
        zIndex: 40, 
        opacity: 0.8 
      };
    } else if (normalizedDiff === -1) {
      return { 
        transform: 'translateX(-85%) scale(0.9) rotateY(25deg)', 
        zIndex: 40, 
        opacity: 0.8 
      };
    } else {
      return { 
        transform: normalizedDiff > 0 ? 'translateX(200%) scale(0.5)' : 'translateX(-200%) scale(0.5)', 
        zIndex: 10, 
        opacity: 0 
      };
    }
  };

  // Image Modal Component
  const ImageModal = () => {
    if (!selectedImage) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4">
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="max-w-4xl w-full">
          <img
            src={selectedImage.url}
            alt={selectedImage.name}
            className="w-full h-auto rounded-lg shadow-2xl"
          />
          
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={() => downloadImage(selectedImage.url, selectedImage.name)}
              disabled={downloading}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition active:scale-95 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {downloading ? 'Đang tải...' : 'Tải xuống'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Gallery View Component
  if (showGallery) {
    return (
      <>
        <div className="fixed inset-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
          <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" style={{ touchAction: 'pan-y' }}>
            <div className="min-h-full bg-gradient-to-b from-white via-pink-50 to-purple-50">
              
              {/* Header */}
              <div className="sticky top-0 z-50 bg-gradient-to-br from-pink-100 to-purple-100 px-4 py-4 shadow-md">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowGallery(false)}
                    className="p-2 hover:bg-pink-200 rounded-full transition"
                  >
                    <ArrowLeft className="w-6 h-6 text-purple-600" />
                  </button>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                      Kỷ niệm của chúng mình
                    </h2>
                    <p className="text-xs text-gray-500">Nhấn vào ảnh để xem & tải xuống</p>
                  </div>
                </div>
              </div>

              {/* Gallery Content */}
              <div className="p-4 space-y-6 pb-8">
                {galleryData.map((dateGroup) => (
                  <div key={dateGroup.date} className="space-y-3">
                    {/* Date Header */}
                    <div className="flex items-center gap-2 sticky top-16 bg-gradient-to-r from-pink-50 to-purple-50 py-2 px-3 rounded-lg shadow-sm z-40">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold text-purple-700">{dateGroup.date}</span>
                      <span className="text-xs text-gray-500">({dateGroup.items.length} ảnh)</span>
                    </div>

                    {/* Images Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {dateGroup.items.map((item) => (
                        <div 
                          key={item.id}
                          className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
                          onClick={() => setSelectedImage(item)}
                        >
                          <img 
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          
                          {/* Download icon overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <Download className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ImageModal />
      </>
    );
  }

  // Main View Component
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" style={{ touchAction: 'pan-y' }}>
        <div className="min-h-full bg-gradient-to-b from-white via-pink-50 to-purple-50">
          
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 px-4 py-6">
            <div className="text-center mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent italic">
                Love
              </h1>
              <p className="text-xs text-gray-500 tracking-wider">CERTIFICATE</p>
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full shadow-lg mb-1 overflow-hidden">
                  <img 
                    src="https://24hstore.vn/upload_images/images/hinh-nen-anime/hinh-nen-anime-ngau-nam-1.jpg"
                    alt="Nhựt"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-semibold text-gray-700">Nhựt</p>
              </div>
              
              <div className="relative">
                <button 
                  onClick={handleTimeClick}
                  className="w-28 h-28 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95"
                >
                  <div className="text-center px-1">
                    <p className="text-2xl font-bold text-purple-600 leading-tight">{currentTime.value}</p>
                    <p className="text-xs text-purple-500 font-semibold">{currentTime.unit}</p>
                  </div>
                </button>
                <Heart className="absolute -top-2 -right-2 w-7 h-7 text-pink-500 fill-pink-500 animate-pulse" />
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 rounded-full shadow-lg mb-1 overflow-hidden">
                  <img 
                    src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-anh-anime-trang-girl-cute-inkythuatso-04-08-14-34.jpg"
                    alt="Thư"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-semibold text-gray-700">Thư</p>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
                24-01-2023
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4 bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
            
            <div className="bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 rounded-2xl p-4 shadow-xl relative overflow-hidden">
              {/* Decorative hearts */}
              <div className="absolute top-2 left-2 opacity-20">
                <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
              </div>
              <div className="absolute top-2 right-2 opacity-20">
                <Heart className="w-5 h-5 text-purple-400 fill-purple-400" />
              </div>
              <div className="absolute bottom-20 left-4 opacity-15">
                <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
              </div>
              <div className="absolute bottom-20 right-4 opacity-15">
                <Heart className="w-4 h-4 text-purple-300 fill-purple-300" />
              </div>

              {/* Title */}
              <div className="text-center mb-3">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Cùng nhau viết nên câu chuyện
                </h3>
                <p className="text-xs text-gray-500 mt-1">Những trang đẹp nhất</p>
              </div>

              <div className="relative h-80 mb-4" style={{ perspective: '1500px' }}>
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-pink-50/30 to-purple-50/30 rounded-xl"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  {memories.map((memory, index) => (
                    <div
                      key={memory.id}
                      className="absolute w-56 h-72 transition-all duration-700 ease-out cursor-pointer group"
                      style={getSlideStyle(index)}
                      onClick={() => setCurrentSlide(index)}
                    >
                      <div className="w-full h-full rounded-2xl shadow-xl overflow-hidden relative border-4 border-white">
                        <img 
                          src={memory.image} 
                          alt={`Memory ${memory.id}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Overlay gradient on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 justify-between px-2">
                {memories.map((memory, index) => (
                  <button
                    key={memory.id}
                    onClick={() => setCurrentSlide(index)}
                    className={`flex-1 max-w-[60px] h-14 rounded-xl transition-all duration-300 shadow-md overflow-hidden ${index === currentSlide ? 'border-4 border-pink-500' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <img 
                      src={memory.image} 
                      alt={`Memory ${memory.id}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4 shadow-lg">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 font-medium">Lắng nghe lời yêu thương tỏ người ấy</p>
                <p className="text-xs text-gray-400 mt-1">24-01-2023</p>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div 
                    className="w-44 h-44 rounded-full shadow-2xl overflow-hidden animate-spin"
                    style={{ animationDuration: '10s' }}
                  >
                    <img 
                      src={musicImage}
                      alt="Music Cover"
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full shadow-inner"></div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowGallery(true)}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition text-base active:scale-95"
            >
              <Grid size={22} />
              Xem tất cả ảnh & video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}