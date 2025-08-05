import './User.css';
import { useLocation } from 'react-router-dom';
import PostList from '../../components/postlists/postlist.tsx'
import PostCard from '../../components/postcard/postcard';
import rawPosts from '../../database/posts.json';
import Cookies from 'js-cookie';
import DefaultPic from '/blankProfile.png?url'

type Post = {
  food_name: string;
  image: string;
  restaurant_name: string;
  rating: number;
  review: string;
  tags: string;
  username: string;
  profile_pic: string;
};

type PostsByUser = {
  [username: string]: Post[];
};

export default function UserPage() {
    const location = useLocation();
    const user = Cookies.get('username'); // for demonstration purposes, using cookie to get username
    const posts = rawPosts as PostsByUser;
    const { username, userId, profilePic } = location.state || {};     
    
    const currentUserId = Cookies.get('userId');
    const baseUrl = import.meta.env.VITE_APP_BASE_URL;
    const fetchUrl = userId ? `${baseUrl}/api/v1/post_review/get_posts_by_id?post_id=${userId}` : undefined;

    return (
        <div className='post-container'>
            <div id='profile-section'>
                <img id='profile-pic' src={profilePic || DefaultPic} alt="Profile" />
                <span>{user}</span>
            </div>
            {user && posts[user]?.map((post: Post, index: number) => (
                <PostCard
                    key={index}
                    id={index}
                    user_id={index}
                    username={post.username}
                    profile_pic={post.profile_pic || DefaultPic}
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
