import './User.css'
import myPostsData from './myposts.json';
import PostCard from '../../components/postcard/postcard';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultPic from '/blankProfile.png?url';

interface Post {
    id: number;
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


type MyPostsType = {
    [username: string]: Post[];
};

const myPosts: MyPostsType = Object.fromEntries(
    Object.entries(myPostsData).map(([username, posts]) => [
        username,
        posts.map((post, index) => ({
        id: index,
        user_id: -1,
        username: post.username,
        profile_pic: post.profile_pic,
        food_name: post.food_name,
        restaurant_name: post.restaurant_name,
        rating: post.rating,
        review: post.review,
        image: post.image,
        tags: Array.isArray(post.tags)
            ? post.tags.join(', ')
            : typeof post.tags === 'string'
            ? post.tags.trim()
            : '',
        })),
    ])
);


export default function DemoUserPage() {
    const navigate = useNavigate();
    const signedIn = Cookies.get('signedIn') === 'true';

    useEffect(() => {
        if (!signedIn) {
            navigate('/login'); // Redirect to login if user not signed in
            return;
        }

        if (!localStorage.getItem('myPosts')) {
            const postsWithId: Record<string, Post[]> = {};
            
            for (const user in myPosts) {
            postsWithId[user] = myPosts[user].map(post => ({
                ...post,
            }));
        }

        localStorage.setItem('myPosts', JSON.stringify(postsWithId));
            localStorage.setItem('myPosts', JSON.stringify(myPosts));
        }
    }, []);

    const [allMyPosts, setAllMyPosts] = useState<Post[]>([]);

    const loadPosts = () => {
        const storedPosts = localStorage.getItem('myPosts');
        if (storedPosts) {
            const parsedPosts = JSON.parse(storedPosts) as Record<string, Post[]>;; 
            setAllMyPosts(Object.values(parsedPosts).flat());
        }
    };

    useEffect(() => {
        loadPosts();
        
        const handlePostDeleted = () => {
            loadPosts(); // 🔁 Refresh when postDeleted is triggered
        };

        window.addEventListener('postDeleted', handlePostDeleted);
        
        return () => {
            window.removeEventListener('postDeleted', handlePostDeleted);
        };
    }, []);


    return (
        <div className='post-container'>
            <div id='profile-section'>
                <img id='profile-pic' src={DefaultPic} alt="Profile" />
                <span>{myPosts["demo_guest"][0].username}</span>
            </div>
            {allMyPosts.map((food, index) => (
                <PostCard
                    key={index}
                    id={food.id}
                    user_id={food.user_id}
                    username={food.username}
                    profile_pic={DefaultPic}
                    food_name={food.food_name}
                    rating={food.rating}
                    review={food.review}
                    image={food.image} 
                    tags={food.tags} 
                    restaurant_name={food.restaurant_name}
                    />
            ))}
            <button id='new-post-button' onClick={() => navigate('/newpost')}>+</button>
        </div>
    );
}

