import React from 'react';

function ProfileAvatar({ name, image }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full shadow-lg mb-1 overflow-hidden">
        <img 
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-xs font-semibold text-gray-700">{name}</p>
    </div>
  );
}
export default ProfileAvatar;