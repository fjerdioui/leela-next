export interface Profile {
    id: string;
    name: string;
    profilePicture?: string; // URL of the profile picture
    bio?: string; // Optional biography
    gallery?: string[]; // Array of image URLs (max 3)
    followers: number; // Number of followers
    following: number; // Number of users this profile is following
    eventsParticipated: number; // Number of events the user has participated in
  }
  