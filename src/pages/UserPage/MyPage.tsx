import './User.css'
import PostCard from '../../components/postcard/postcard';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultPic from '/blankProfile.png?url';

interface Post {
    id: number;
    user_id: number;
    username: string;
    food_name: string;
    rating: number;
    review: string;
    image: string;
    tags: string;
    restaurant_name: string;
    profile_pic: string;
}

export default function MyPage() {
    const navigate = useNavigate();
    const signedIn = Cookies.get('signedIn') === 'true';
    const baseUrl = import.meta.env.VITE_APP_BASE_URL;
    const fetchUrl = `${baseUrl}/api/v1/post_review/get_posts_by_id?user_id=${Cookies.get('userId')}`;

    const [allMyPosts, setAllMyPosts] = useState<Post[]>([]);
    const [profilePic, setProfilePic] = useState<string>(DefaultPic);

    useEffect(() => {
        if (!signedIn) {
            navigate('/login'); // Redirect to login if user not signed in
            return;
        }
        if (allMyPosts.length > 0) return; // Avoid fetching if posts are already loaded

        // fetchPosts
        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                setAllMyPosts([]);
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                setAllMyPosts(data);
                setProfilePic(data[0].profile_pic || DefaultPic);
                console.log(data);
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
    }, []);

    useEffect(() => {
        const handlePostDeleted = (event: Event) => {
            const customEvent = event as CustomEvent;
            const deletedId = customEvent.detail?.id;
            setAllMyPosts((prevPosts) => prevPosts.filter(p => p.id !== deletedId));
        };
        window.addEventListener('postDeleted', handlePostDeleted);

        return () => {
            window.removeEventListener('postDeleted', handlePostDeleted);
        };
    }, []);

    return (
        <div className='post-container'>
            <div id='profile-section'>
                <img id='profile-pic' src={profilePic} alt="Profile" />
                <span>{Cookies.get('user')}</span>
            </div>
            {allMyPosts.map((post, index) => (
                <PostCard
                    key={index}
                    id={post.id}
                    user_id={post.user_id}
                    username={post.username}
                    profile_pic={profilePic}
                    food_name={post.food_name}
                    rating={post.rating}
                    review={post.review}
                    image={post.image} 
                    tags={post.tags} 
                    restaurant_name={post.restaurant_name} />
            ))}
            <button id='new-post-button' onClick={() => navigate('/newpost')}>+</button>
        </div>
    );
}

