/* eslint-disable no-undef */

import React from 'react';
import { profileImages } from '../data/constants';
import ProfileAvatar from './ProfileAvatar';

function HeaderSection({ timeDisplay, onTimeClick }) {
  const { Heart } = require('lucide-react');
  
  return (
    <div className="bg-gradient-to-br from-pink-100 to-purple-100 px-4 py-6">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent italic">
          Love
        </h1>
        <p className="text-xs text-gray-500 tracking-wider">CERTIFICATE</p>
      </div>
      
      <div className="flex items-center justify-center gap-4 mb-4">
        <ProfileAvatar name="Nhựt" image={profileImages.nhut} />
        
        <div className="relative">
          <button 
            onClick={onTimeClick}
            className="w-28 h-28 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95"
          >
            <div className="text-center px-1">
              <p className="text-2xl font-bold text-purple-600 leading-tight">{timeDisplay.value}</p>
              <p className="text-xs text-purple-500 font-semibold">{timeDisplay.unit}</p>
            </div>
          </button>
          <Heart className="absolute -top-2 -right-2 w-7 h-7 text-pink-500 fill-pink-500 animate-pulse" />
        </div>
        
        <ProfileAvatar name="Thư" image={profileImages.thu} />
      </div>

      <div className="text-center">
        <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-semibold">
          24-01-2023
        </div>
      </div>
    </div>
  );
}
export default HeaderSection;