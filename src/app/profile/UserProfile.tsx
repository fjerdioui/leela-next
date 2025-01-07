import React from 'react';

const UserProfile = () => {
  return (
    <div className="flex flex-col items-center">
      <img src="/icons/default-avatar.png" alt="Profile" className="w-24 h-24 rounded-full" />
      <h2 className="text-xl font-semibold mt-4">John Doe</h2>
      <p className="text-gray-600">Welcome to your profile!</p>
    </div>
  );
};

export default UserProfile;
