import './postcard.css'
import { useState } from 'react';
import StarRating from '../stars/StarRating';
import PostDetail from '../postdetail/postdetail';
import PostProfile from '../postprofile/postprofile';
import defaultPic from '/blankProfile.png?url';
import Cookies from 'js-cookie';

interface PostCardProps {
    id : number | string;
    user_id: number;
    username: string;
    profile_pic?: string;
    food_name?: string;
    restaurant_name?: string;
    rating: number;
    review?: string;
    image?: string;
    tags?: string | undefined;
}

export default function PostCard({ 
    id, 
    user_id,
    username, 
    profile_pic, 
    food_name, 
    restaurant_name,
    rating, 
    review, 
    image, 
    tags, 
    } : PostCardProps) {

    const [showPostDetail, setPostDetail] = useState<boolean>(false);

    function handleContentClick() {
        setPostDetail(true);
    }
    
    return (
        <>
        {showPostDetail? 
            <PostDetail
                post = {{
                    id,
                    user_id,
                    username,
                    profile_pic,
                    food_name,
                    rating,
                    review,
                    image,
                    restaurant_name,
                    tags,
                }}
                onClose={() => setPostDetail(false)}         
            />
            :
            <div className='min-post-container' >
                <PostProfile 
                    profilePic={profile_pic || defaultPic} 
                    username={username} 
                    postUserId = {user_id}
                    currentUserId = {Cookies.get('userId')}
                />
                <div className='content-section' onClick={handleContentClick}>
                    <img className='min-post-image' src={image} alt={food_name} />
                    <p className='meal-name'>{food_name}</p>
                    <StarRating rating={rating} />
                    <p className='review'>{review}</p>
                </div>
            </div>
        }
        </>
    );
}