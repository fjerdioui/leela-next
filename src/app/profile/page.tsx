"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { UserInfo } from '@/types/user';
import { Post } from '@/types/post';

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'John Doe',
    bio: 'Lorem ipsum dolor sit amet.',
    email: 'john.doe@example.com',
    profilePicture: '/default-avatar.png',
    coverPhoto: '/default-cover.jpg',
  });

  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  const handleEditInfo = () => {
    setEditing(!editing);
  };

  const handleSaveInfo = (updatedInfo: Partial<UserInfo>) => {
    setUserInfo({ ...userInfo, ...updatedInfo });
    setEditing(false);
  };

  const handlePost = () => {
    if (newPost.trim()) {
      setPosts([{ content: newPost, likes: 0, comments: [] }, ...posts]);
      setNewPost('');
    }
  };

  return (
    <main className="p-6">
      {/* Cover Photo */}
      <div className="relative h-64 w-full bg-gray-300">
        <Image
          src={userInfo.coverPhoto}
          alt="Cover Photo"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        <button
          className="absolute top-4 right-4 bg-white p-2 rounded-md shadow"
          onClick={() => alert('Change Cover Photo')}
        >
          Change Cover
        </button>
      </div>

      {/* Profile Picture and Info */}
      <div className="flex items-center mt-4">
        <div className="relative w-32 h-32">
          <Image
            src={userInfo.profilePicture}
            alt="Profile Picture"
            width={128}
            height={128}
            className="rounded-full border-4 border-white shadow-md"
          />
          <button
            className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow"
            onClick={() => alert('Change Profile Picture')}
          >
            Edit
          </button>
        </div>
        <div className="ml-6">
          {editing ? (
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              className="text-xl font-bold border-b-2 focus:outline-none"
            />
          ) : (
            <h1 className="text-2xl font-bold">{userInfo.name}</h1>
          )}
          <p>{userInfo.bio}</p>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleEditInfo}
          >
            {editing ? 'Save' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Post Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Create Post</h2>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full border rounded-md p-2 mt-2"
          placeholder="What's on your mind?"
        ></textarea>
        <button
          onClick={handlePost}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Post
        </button>
      </div>

      {/* Posts Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post, index) => (
            <div key={index} className="border p-4 rounded-md mt-4">
              <p>{post.content}</p>
              <div className="flex items-center mt-2 space-x-4">
                <button className="text-blue-500" onClick={() => {
                  const updatedPosts = [...posts];
                  updatedPosts[index].likes += 1;
                  setPosts(updatedPosts);
                }}>
                  Like ({post.likes})
                </button>
                <button className="text-gray-500">Comment</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Friends Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Friends/Followers</h2>
        <p>No friends yet. Start connecting!</p>
      </div>

      {/* Photos Section */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Photos</h2>
        <p>No photos uploaded yet.</p>
      </div>
    </main>
  );
};

export default ProfilePage;
