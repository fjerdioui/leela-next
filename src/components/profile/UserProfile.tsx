import React from 'react';
import { Profile as UserProfileType } from '@/types/profile';
import Gallery from './Gallery';
import FollowStats from './FollowStats';

interface UserProfileProps {
  profile: UserProfileType;
  onChat: () => void; // Chat button handler
}

const UserProfile: React.FC<UserProfileProps> = ({ profile, onChat }) => {
  console.log('Profile Picture URL:', profile.profilePicture);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div className="flex items-center space-x-6">profile.profilePicture
        <img
          src={'/icons/default-avatar.png'}
          alt={`${profile.name}'s Avatar`}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold">{profile.name}</h1>
          <p className="text-gray-600">{profile.bio || "No bio available"}</p>
        </div>
      </div>

      {/* Gallery Section */}
      {profile.gallery && profile.gallery.length > 0 && (
        <Gallery images={profile.gallery} />
      )}

      {/* Follow Stats */}
      <FollowStats
        followers={profile.followers}
        following={profile.following}
        eventsParticipated={profile.eventsParticipated}
      />

      {/* Actions */}
      <div className="flex justify-end mt-4 space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          onClick={onChat}
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
