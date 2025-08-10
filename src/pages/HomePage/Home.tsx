import './Home.css';
import posts from '../../database/posts.json';
import PostCard from '../../components/postcard/postcard';
import PostList from '../../components/postlists/postlist';
import DefaultPic from '/blankProfile.png?url'

export default function Home() {

    const allPosts = Object.values(posts).flat();
    const baseUrl = import.meta.env.VITE_APP_BASE_URL;
    const fetchUrl = `${baseUrl}/api/v1/post_review/get_post_review`;

    return (
        <div className='post-container'>
            {allPosts.map((post, index) => (
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
            <PostList fetchUrl={fetchUrl} />
        </div>
    );
}