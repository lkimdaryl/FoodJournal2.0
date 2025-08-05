import './NewPost.css';
import DynamicStars from '../../components/stars/DynamicStars';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ImageInput from "../../components/imagesource/imgsrc";

export default function EditPost() {
    const navigate = useNavigate();
    const isSignedin = Cookies.get('signedIn') === 'true';
    useEffect(() => {
        if (!isSignedin) {
            console.warn("User is not signed in, redirecting to login.");
            navigate('/login');
        }   
    }, []);

    const [imageData, setImageData] = useState<string | null>(null);
    const location = useLocation();
    const post = location.state?.post;
    console.log(post);

    const [rating, setRating] = useState(0);

    useEffect(() => {
        if (post?.rating) {
            setRating(post.rating);
            Cookies.set('rating', post.rating.toString());
        }
    }, [post]);

    function handleCancel(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        window.history.back();
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        const form = event.currentTarget.form;
        if (!form || !post) return;

        if (Cookies.get('user') === 'demo_guest') {
            const user = Cookies.get('user');
            const raw = localStorage.getItem('myPosts');

            let allPosts: { [key: string]: any[] } = {};
            try {
                allPosts = raw ? JSON.parse(raw) : {};
            } catch (e) {
                console.warn("Corrupted localStorage. Resetting.");
                allPosts = {};
            }

            if (!Array.isArray(allPosts[user!])) {
                allPosts[user!] = [];
            }

            const updatedPost = {
                ...post,
                food_name: form.mealName.value,
                image: imageData || "noImage.png",
                rating: rating,
                restaurant_name: form.restaurant.value,
                review: form.comments.value,
                tags: form.tags.value,
            };

            // Find and update the post by unique_id
            const index = allPosts[user!].findIndex(p => p.id === post.id);
            if (index !== -1) {
                allPosts[user!][index] = updatedPost;
                localStorage.setItem('myPosts', JSON.stringify(allPosts));
            } else {
                console.warn("Post not found in localStorage.");
            }
            navigate('/demouserpage'); // Redirect to the demo user page
        } else {
            const updatedPost = {
                ...post,
                user_id: Cookies.get('userId'),
                food_name: form.mealName.value,
                image: imageData || "noImage.png",
                rating: rating,
                restaurant_name: form.restaurant.value,
                review: form.comments.value,
                tags: form.tags.value,
            };
            //not needed in the backend
            delete updatedPost.id;
            delete updatedPost.profile_pic;
            delete updatedPost.username;

            console.log("Updated Post Data:", updatedPost);
            const baseUrl = import.meta.env.VITE_APP_BASE_URL;
            const fetchUrl = `${baseUrl}/api/v1/post_review/update_post_review?access_token=${Cookies.get('accessToken')}&id=${post.id}`;

            fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPost)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Post updated successfully:', data);
                navigate('/mypage'); // Redirect to My Page after successful edit
            })
            .catch(error => {
                console.error('Error updating post:', error);
            });
        }
    }

    return (
        <form className='new-entry-form'>
            <h1>Edit Entry</h1>

            <label className="entry-label" htmlFor="mealPics">Picture</label>
            <ImageInput onImageChange={setImageData} initialImage={post?.image}/>

            <label className="entry-label" htmlFor="mealName">Meal Name</label>
            <input
                className="entry-input"
                type="text"
                id="mealName"
                name="mealName"
                defaultValue={post?.food_name}
                required
            />

            <label className="entry-label" htmlFor="restaurant">Restaurant</label>
            <input
                className="entry-input"
                type="text"
                id="restaurant"
                name="restaurant"
                defaultValue={post?.restaurant_name}
                required
            />

            <label className="entry-label" htmlFor='rating'>Rating</label>
            <DynamicStars onRatingChange={setRating} initialRating={post?.rating} />

            <label className="entry-label" htmlFor="comments">Comments</label>
            <textarea
                className="entry-input"
                id="comments"
                name="comments"
                defaultValue={post?.review}
                required
                rows={4}
                cols={50}
            />

            <label className="entry-label" htmlFor="tags">Tags</label>
            <input
                className="entry-input"
                type="text"
                id="tags"
                name="tags"
                defaultValue={post?.tags}
                required
            />

            <div className='form-bttn-container'>
                <button className="form-bttn" type="button" onClick={handleCancel}>Cancel</button>
                <button className="form-bttn" type="submit" onClick={handleSubmit}>Save Changes</button>
            </div>
        </form>
    );
}
