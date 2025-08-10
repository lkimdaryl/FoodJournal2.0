import './Login.css';
import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import DefaultPic from '/blankProfile.png?url'

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const fetchUrl = `${baseUrl}/api/v1/auth/login`;

  useEffect(() => {
    usernameInputRef.current?.focus();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo credentials
    if (username === "demo_guest" && password === "password123") {
      alert("This is a demo user. No posts will truly be saved or edited.")
      Cookies.set('signedIn', 'true');
      Cookies.set('user', username);
      window.location.href = "/demouserpage";
    } else {
      try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(fetchUrl, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString(),
        });
        
        if (response.ok){
          const data = await response.json();
          Cookies.set('signedIn', 'true');
          Cookies.set('user', username);
          Cookies.set('accessToken', data.access_token);
          Cookies.set('userId', data.user_id);
          Cookies.set('profilePicture', data.profile_picture? data.profile_picture : DefaultPic);
          window.location.href = "/mypage";
        } else {
          setError('Invalid username or password.');
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <h1>Food Journal</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          placeholder='demo username: demo_guest'
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          placeholder="demo password: password123"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="error-message">{error}</div>
        <a className="forgot" href="https://youtu.be/b3rNUhDqciM">Forgot Password?</a>
        <button className="submit" disabled={loading}>{loading ? 'Loggin in...' : 'Login'}</button>
        <p className='notice'>New to Food Journal?</p>
        <a className="sign-up-link" href='/signup'>Sign up for free</a>
      </form>
    </div>
  );
}
