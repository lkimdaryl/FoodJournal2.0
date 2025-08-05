// UserPage.js
// import '../Home/Home.css';
import './User.css';
// import NavBar from '../../components/navbar';
// import React from 'react';
import { useLocation } from 'react-router-dom';
import PostList from '../../components/postlists/postlist.tsx'
import PostCard from '../../components/postcard/postcard';
import { useState } from 'react';
import posts from '../../database/posts.json';
import Cookies from 'js-cookie';


export default function UserPage() {
    const location = useLocation();
    const user = Cookies.get('username'); // for demonstration purposes, using cookie to get username

    const { username, userId, profilePic } = location.state || {};
    console.log(username, userId, profilePic);
        
    const currentUserId = Cookies.get('userId');
    const baseUrl = import.meta.env.VITE_APP_BASE_URL;
    const fetchUrl = userId ? `${baseUrl}/api/v1/post_review/get_posts_by_id?post_id=${userId}` : undefined;
    console.log(fetchUrl);

    return (
        <div className='post-container'>
            <div id='profile-section'>
                <img id='profile-pic' src="https://placehold.co/100" alt="Profile" />
                <span>{user}</span>
                {/* <span>{userPosts[0].username}</span> */}
            </div>
            {posts[user]?.map((post: any, index: any) => (
                <PostCard
                    key={index}
                    id={index}
                    user_id={index}
                    username={post.username}
                    profile_pic="https://placehold.co/100"
                    food_name={post.food_name}
                    rating={post.rating}
                    review={post.review}
                    image={post.image} 
                    tags={post.tags} 
                    restaurant_name={post.restaurant_name} 
                />
            ))}
           <PostList 
                fetchUrl={fetchUrl} 
                isUserPage={true}
                username={username}
                profilePic={profilePic}
                userId={userId === currentUserId ? userId : null}
            />
        </div>
    );
}
