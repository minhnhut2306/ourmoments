import { useState, useEffect } from 'react';
import { Heart, Grid } from 'lucide-react';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [days, setDays] = useState(1083);
  const [timeMode, setTimeMode] = useState(0); // 0: days, 1: years, 2: months, 3: weeks, 4: hours
  
  const memories = [
    { id: 1, image: 'https://vn1.vdrive.vn/alohamedia.vn/2025/02/dc0ef9f664914981865e0d114a39632f.jpg' },
    { id: 2, image: 'https://images2.thanhnien.vn/528068263637045248/2024/1/25/428059e47aeafb68640f168d615371dc-65a11b038315c880-1706156293087602824781.jpg' },
    { id: 3, image: 'https://cdn-images.vtv.vn/2018/11/22/photo-3-15428716111551636354706.jpg' },
    { id: 4, image: 'https://i.pinimg.com/236x/f5/36/f4/f536f417b1e901255f572d9fa8f255d8.jpg' },
    { id: 5, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYCgcygUmH6Bfb5W2i00HumEUsew78uChI6A&s' }
  ];

  const musicImage = 'https://cdn-media.sforum.vn/storage/app/media/Van%20Pham/hinh-nen-anime-83.jpg';

  // Calculate different time units
  const totalYears = Math.floor(days / 365);
  const remainingDaysAfterYears = days % 365;
  const monthsAfterYears = Math.floor(remainingDaysAfterYears / 30);
  
  const totalMonths = Math.floor(days / 30);
  const daysAfterMonths = days % 30;
  
  const totalWeeks = Math.floor(days / 7);
  const daysAfterWeeks = days % 7;
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      <div className="w-full min-h-screen bg-gradient-to-b from-white via-pink-50 to-purple-50 overflow-y-auto">
        
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
          
          <div className="bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 rounded-2xl p-4 shadow-xl">
            <div className="relative h-80 mb-4" style={{ perspective: '1500px' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {memories.map((memory, index) => (
                  <div
                    key={memory.id}
                    className="absolute w-56 h-72 transition-all duration-700 ease-out cursor-pointer"
                    style={getSlideStyle(index)}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <div className="w-full h-full rounded-2xl shadow-xl overflow-hidden relative">
                      <img 
                        src={memory.image} 
                        alt={`Memory ${memory.id}`}
                        className="w-full h-full object-cover"
                      />
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

          <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition text-base">
            <Grid size={22} />
            Xem tất cả ảnh & video
          </button>
        </div>
      </div>
    </div>
  );
}