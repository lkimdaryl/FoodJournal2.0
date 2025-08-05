import './postdetail.css';
import { useNavigate } from 'react-router-dom';
import StarRating from '../../components/stars/StarRating';
import PostProfile from '../postprofile/postprofile';
import Cookies from 'js-cookie';

interface Post {
    id : number | string;
    user_id: number;
    username: string;
    profile_pic?: string;
    food_name?: string;
    restaurant_name?: string;
    rating: number;
    review?: string;
    image?: string;
    tags?: string;
    unique_id?: string;
}

interface PostDetailProps {
    post: Post;
    onClose: () => void;
    onDelete?: (id: string) => void;

}

export default function PostDetail({ post, onClose }: PostDetailProps) {
    if (!post) return null;

    const navigate = useNavigate();
    console.log(post);
    console.log(Cookies.get('user'));
    const myPage = Cookies.get('user') === post.username? true : false;

    function handleDelete(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();

        if (post.username === 'demo_guest') {
            if (window.confirm("Are you sure you want to delete this post?")) {
                const stored = localStorage.getItem('myPosts');
                if (!stored) return;

                const parsedPosts: { [username: string]: Post[] } = JSON.parse(stored);
                console.log(parsedPosts);
                for (const user in parsedPosts) {
                    parsedPosts[user] = parsedPosts[user].filter(p => p.id !== post.id);
                }

                localStorage.setItem('myPosts', JSON.stringify(parsedPosts));
                window.dispatchEvent(new Event("postDeleted")); // Trigger re-render

                onClose();
            }
        } else {
            const baseUrl = import.meta.env.VITE_APP_BASE_URL;
            const fetchUrl = `${baseUrl}/api/v1/post_review/delete_post_review?id=${post.id}&access_token=${Cookies.get('accessToken')}`;
            try {
                fetch(fetchUrl, {method: 'POST'})
            } catch (error) {
                console.error('Error deleting post:', error);
            }

            onClose();

            const event = new CustomEvent('postDeleted', { detail: { id: post.id } });
            window.dispatchEvent(event);

        }
    }

    function handleEdit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        navigate('/editpost', { state: { post } });
    }

    return (
        <div className='review-detail-container'>
            <div className='review-detail-header'>
                <PostProfile username={post.username} profilePic={post.profile_pic} />
                <button className='close-button' onClick={onClose}>X</button>
            </div>
            {post.image && post.image.trim() !== '' && <img src={post.image || "noImage.png"} alt={`${post.food_name}`} className='food-pic' />}
            <div className='food-detail-container'>
                <h1 className='food-name'>{post.food_name}</h1>
                <div className='star-rating'>
                    <StarRating rating={post.rating} />
                </div>
                {post.review && post.review.trim() !== '' && <p className='detail-text'>{post.review}</p>}
                {post.restaurant_name && post.restaurant_name.trim() !== '' && <p className='detail-text'><strong>Restaurant:</strong> {post.restaurant_name}</p>}
                {post.tags && post.tags.trim() !== '' && <p className='detail-text'><strong>Tags:</strong> {post.tags}</p>}
                { myPage? 
                    <div className='post-bttn-container'>
                        <button className='post-button'
                            onClick={handleEdit}>Edit</button>
                        <button className='post-button' 
                            onClick={handleDelete}>Delete</button>
                    </div> : <div></div>
                }
            </div>
        </div>
    )
};
