import React, { useState, useEffect } from 'react';
import PostCard from '../postcard/postcard.tsx';
import NoImage from '/noImage.png?url';
import BlankProfilePic from '/blankProfile.png?url';

interface Post {
  id : number;
  user_id: number;
  username: string;
  profile_pic?: string;
  food_name?: string;
  restaurant_name?: string;
  rating: number;
  review?: string;
  image?: string;
  tags?: string;
}


interface PostListProps {
  fetchUrl?: string;
  isUserPage?: boolean;
  username?: string;
  profilePic?: string;
  userId?: string | number | null;
}333


const PostList: React.FC<PostListProps> = ({ fetchUrl, isUserPage}) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!fetchUrl) return;

    fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((data: Post[]) => {
        setPosts(data);
        console.log(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [fetchUrl, isUserPage]);

  return (
    <div className='post-container reddit-sans-condensed'>
      {posts.length > 0 ? (
        posts.slice().reverse().map(post => (
          <PostCard
            key={post.id}
            id={post.id}
            user_id={post.user_id}
            username={post.username}
            profile_pic={post.profile_pic || BlankProfilePic}
            food_name={post.food_name}
            restaurant_name={post.restaurant_name || ''}
            rating={post.rating}
            review={post.review}
            image={post.image || NoImage}
            tags={post.tags}
          />
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default PostList;
