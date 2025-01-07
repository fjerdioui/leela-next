import React from 'react';

interface FollowStatsProps {
  followers: number;
  following: number;
  eventsParticipated: number;
}

const FollowStats: React.FC<FollowStatsProps> = ({
  followers,
  following,
  eventsParticipated,
}) => {
  return (
    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
      <div>
        <h3 className="text-xl font-semibold">{followers}</h3>
        <p className="text-gray-600">Followers</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold">{following}</h3>
        <p className="text-gray-600">Following</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold">{eventsParticipated}</h3>
        <p className="text-gray-600">Events Participated</p>
      </div>
    </div>
  );
};

export default FollowStats;
