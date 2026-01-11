import React, { useRef, useState } from 'react';
import nenNhacSvg from '../assets/nen-nhac.svg';
import tayDiaSvg from '../assets/tay-dia.svg';
import musicImage from '../assets/dianhac.webp';
import musicFile from '../assets/nhac.mp3';

function MusicPlayer() {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <audio ref={audioRef} loop>
                <source src={musicFile} type="audio/mpeg" />
            </audio>

            <img
                src={nenNhacSvg}
                alt="Music Player"
                className="w-full object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    <div 
                        className={`w-64 h-64 rounded-full shadow-2xl overflow-hidden border-2 border-gray-800 bg-black cursor-pointer ${isPlaying ? 'animate-spin' : ''}`} 
                        style={{ animationDuration: '10s' }}
                        onClick={togglePlay}
                    >
                        <img
                            src={musicImage}
                            alt="Vinyl Record"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="absolute -top-12 -right-24 w-52 h-52 pointer-events-none">
                        <img
                            src={tayDiaSvg}
                            alt="Tonearm"
                            className="w-full h-full object-contain drop-shadow-xl"
                        />
                    </div>

                    {/* Nút Play/Pause mờ */}
                    <button
                        onClick={togglePlay}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-black bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-40 transition opacity-50 hover:opacity-80"
                    >
                        {isPlaying ? (
                            // Icon Pause
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/>
                            </svg>
                        ) : (
                            // Icon Play
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;