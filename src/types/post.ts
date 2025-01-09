import { useState } from "react";

export type Post = {
    content: string;
    likes: number;
    comments: string[]; // Adjust as necessary for your comment structure
  };
  
  const [posts, setPosts] = useState<Post[]>([]);
   