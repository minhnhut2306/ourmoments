
/* eslint-disable no-undef */
import React from 'react';
import { galleryData } from '../data/constants';

function Gallery({ onBack, onImageClick }) {
  const { ArrowLeft, Calendar, Download } = require('lucide-react');
  
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" style={{ touchAction: 'pan-y' }}>
        <div className="min-h-full bg-gradient-to-b from-white via-pink-50 to-purple-50">
          
          <div className="sticky top-0 z-50 bg-gradient-to-br from-pink-100 to-purple-100 px-4 py-4 shadow-md">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
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

          <div className="p-4 space-y-6 pb-8">
            {galleryData.map((dateGroup) => (
              <div key={dateGroup.date} className="space-y-3">
                <div className="flex items-center gap-2 sticky top-16 bg-gradient-to-r from-pink-50 to-purple-50 py-2 px-3 rounded-lg shadow-sm z-40">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-semibold text-purple-700">{dateGroup.date}</span>
                  <span className="text-xs text-gray-500">({dateGroup.items.length} ảnh)</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {dateGroup.items.map((item) => (
                    <div 
                      key={item.id}
                      className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
                      onClick={() => onImageClick(item)}
                    >
                      <img 
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      
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
  );
}
export default Gallery;