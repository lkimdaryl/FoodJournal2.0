import './NewPost.css'
import DynamicStars from '../../components/stars/DynamicStars'
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState } from 'react';
import ImageInput from "../../components/imagesource/imgsrc";


export default function NewPost() {
    const navigate = useNavigate();
    const isSignedin = Cookies.get('signedIn') === 'true';
    useEffect(() => {
        if (!isSignedin) {
            console.warn("User is not signed in, redirecting to login.");
            navigate('/login');
        }   
    }, []);

    const [rating, setRating] = useState(0);
    const [imageData, setImageData] = useState<string | null>(null);

    const baseUrl = 'http://localhost:6542';
    const fetchUrl = `${baseUrl}/api/v1/post_review/create_post_review?access_token=${Cookies.get('accessToken')}`;


    function handleCancel(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        window.history.back();
    }

    function handleSubmit(event: React.MouseEvent<HTMLButtonElement>): void {
        event.preventDefault();
        const form = event.currentTarget.form;
        if (!form) return;

        if (Cookies.get('user') == 'demo_guest') {
            const user = Cookies.get('user');
            const raw = localStorage.getItem('myPosts');

            let allPosts: { [key: string]: any } = {};
            try {
                allPosts = raw ? JSON.parse(raw) : {};
            } catch (e) {
                console.warn("Corrupted localStorage. Resetting.");
                allPosts = {};
            }

            if (typeof user !== 'string') {
                console.warn("User is undefined or not a string, cannot index allPosts.");
                return;
            }
            
            if (!Array.isArray(allPosts[user])) {
                console.warn(`allPosts[${user}] was not an array. Resetting to [].`, allPosts[user]);
                allPosts[user] = [];
            }

            const last_id = allPosts[user][allPosts[user].length - 1]?.id;
            console.log("Last ID:", last_id);
            const newPost = {
                id: last_id? last_id + 1 : 0,
                user_id: -1,
                food_name: form.mealName.value,
                image: imageData || "noImage.png",
                profile_pic: "https://placehold.co/100",
                rating: rating,
                restaurant_name: form.restaurant.value,
                review: form.comments.value,
                tags: form.tags.value,
                username: user,
            };


            allPosts[user].push(newPost);

            // Step 4: Save everything back
            localStorage.setItem('myPosts', JSON.stringify(allPosts));
            navigate('/demouserpage');
        } else {
            const postData = {
                user_id: Cookies.get('userId'),
                food_name: form.mealName.value,
                image: imageData || "noImage.png",
                rating: rating,
                restaurant_name: form.restaurant.value,
                review: form.comments.value,
                tags: form.tags.value,
            };

            fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                },
                body: JSON.stringify(postData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Post created successfully:', data);
                navigate('/mypage');
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });
        }
        
    }

  return (
    <form className='new-entry-form'>
        <h1>New Entry</h1>
        <label className="entry-label"htmlFor="mealPics">Picture</label>
        <ImageInput onImageChange={setImageData} />

        <label className="entry-label" htmlFor="mealName">Meal Name</label>
        <input className="entry-input" type="text" id="mealName" name="mealName" placeholder="Enter meal name" required/>    

        <label className="entry-label" htmlFor="restaurant">Restaurant</label>
        <input className="entry-input" type="text" id="restaurant" name="restaurant" placeholder="Enter restaurant" required/>

        <label className="entry-label" htmlFor='rating'>Rating</label>
        <DynamicStars onRatingChange={setRating}/>

        <label className="entry-label" htmlFor="comments">Comments</label>
        <textarea className="entry-input" id="comments" name="comments" placeholder="Enter comments" required rows={4} cols={50}/>
        
        <label className="entry-label" htmlFor="tags">Tags</label>
        <input className="entry-input" type="text" id="tags" name="tags" placeholder="Enter tags" required/>
        
        <div className='form-bttn-container'>
            <button className="form-bttn" type="button" onClick={handleCancel}>Cancel</button>
            <button className="form-bttn" type="submit" onClick={handleSubmit}>Submit</button>
        </div>
    </form>)
}