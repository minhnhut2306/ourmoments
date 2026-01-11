import React from 'react';
import { Heart, Sparkles, Star } from 'lucide-react';
import { profileImages } from '../data/constants';
import ProfileAvatar from './ProfileAvatar';
import traiTimSvg from '../assets/trai-tim.svg';

function HeaderSection({ timeDisplay, onTimeClick }) {
  return (
    <div className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 px-4 py-10 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-20 right-20 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-20" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-rose-400 rounded-full animate-ping opacity-20" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Large decorative blur circles */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-300 to-blue-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Floating decorative elements */}
      <div className="absolute top-8 left-12 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}>
        <Heart className="w-3 h-3 text-pink-300 fill-pink-300 opacity-50" />
      </div>
      <div className="absolute top-16 right-16 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
        <Sparkles className="w-3 h-3 text-yellow-300 opacity-50" />
      </div>
      <div className="absolute bottom-24 left-16 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}>
        <Star className="w-3 h-3 text-blue-300 fill-blue-300 opacity-50" />
      </div>
      <div className="absolute bottom-16 right-12 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>
        <Heart className="w-3 h-3 text-purple-300 fill-purple-300 opacity-50" />
      </div>

      <div className="relative z-10">
        {/* Enhanced Title with Forever Us */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            {/* Decorative stars around title */}
            <Sparkles className="absolute -top-4 -left-4 w-5 h-5 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute -top-4 -right-4 w-4 h-4 text-pink-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
            
            <h1 className="text-5xl md:text-6xl font-black select-none bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent" style={{ WebkitFontSmoothing: 'antialiased', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Forever Us
            </h1>
            
            {/* Bouncing heart on title */}
            <div className="absolute -top-3 -right-6">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-bounce drop-shadow-md" />
            </div>
          </div>
          
          {/* Subtitle with animation */}
          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-500 tracking-[0.3em] uppercase font-light animate-pulse">
              Minh Nhựt & Minh Thư
            </p>
            
            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-pink-400 rounded-full"></div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
                <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <Heart className="w-3 h-3 text-purple-400 fill-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <div className="w-12 h-[2px] bg-gradient-to-l from-transparent via-purple-400 to-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Profiles and counter section */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {/* Left Avatar */}
          <div className="relative">
            <ProfileAvatar name="Minh Nhựt" image={profileImages.nhut} />
          </div>

          {/* Center Heart Counter - Enhanced */}
          <div className="relative">
            {/* Multiple glow layers for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse scale-150"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full blur-xl opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            
            <button
              onClick={onTimeClick}
              className="relative w-36 h-36 flex items-center justify-center hover:scale-110 transition-all duration-500 active:scale-95 group"
            >
              {/* Heart background with pulse animation */}
              <img
                src={traiTimSvg}
                alt="trái tim"
                className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl group-hover:drop-shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 animate-pulse"
              />

              {/* Counter text with better styling */}
              <div className="text-center px-3 relative z-10">
                <p className="text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] leading-tight tracking-tight">
                  {timeDisplay.value}
                </p>
                <p className="text-xs text-white font-bold mt-1 drop-shadow-md uppercase tracking-wider">
                  {timeDisplay.unit}
                </p>
              </div>

              {/* Orbiting hearts */}
              <Heart className="absolute -top-4 -right-4 w-8 h-8 text-rose-500 fill-rose-500 animate-bounce drop-shadow-xl" />
              <Heart className="absolute -bottom-3 -left-3 w-6 h-6 text-pink-400 fill-pink-400 animate-pulse drop-shadow-lg" style={{ animationDelay: '0.3s' }} />
              <Heart className="absolute top-2 -left-5 w-5 h-5 text-purple-400 fill-purple-400 animate-bounce drop-shadow-md" style={{ animationDelay: '0.6s', animationDuration: '2s' }} />
              <Heart className="absolute -top-2 right-4 w-4 h-4 text-rose-300 fill-rose-300 animate-pulse drop-shadow-md" style={{ animationDelay: '0.9s' }} />
            </button>

            {/* Sparkles around counter */}
            <Sparkles className="absolute -top-2 left-3 w-5 h-5 text-yellow-400 animate-ping" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="absolute -bottom-2 right-3 w-4 h-4 text-blue-400 animate-ping" style={{ animationDelay: '1s' }} />
            <Star className="absolute top-6 -right-6 w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
            <Star className="absolute bottom-6 -left-6 w-3 h-3 text-purple-400 fill-purple-400 animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Right Avatar */}
          <div className="relative">
            <ProfileAvatar name="Minh Thư" image={profileImages.thu} />
          </div>
        </div>

        {/* Enhanced Date Badge */}
        <div className="text-center space-y-3">
          <div className="inline-block relative group">
            {/* Glow effect behind badge */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity"></div>
            
            <div className="relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-8 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Heart className="w-5 h-5 text-blue-500 fill-blue-500 animate-pulse" />
              <span className="text-base font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wider">
                24 • 01 • 2023
              </span>
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-[1px] bg-gradient-to-r from-transparent to-pink-300"></div>
            <p className="text-xs text-gray-500 font-medium tracking-wider">
              Our Beginning
            </p>
            <div className="w-6 h-[1px] bg-gradient-to-l from-transparent to-purple-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderSection;