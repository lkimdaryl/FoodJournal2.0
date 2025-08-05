import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userNameValid, setUserNameValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const fetchUrl = `${baseUrl}/api/v1/auth/create_user`;

  const navigate = useNavigate();

  const validateUserName = (userName: string) => {
    return userName.length >= 3 && userName.length <= 20;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    setUserNameValid(validateUserName(e.target.value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailValid(validateEmail(e.target.value));
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isUserNameValid = validateUserName(userName);
    const isEmailValid = validateEmail(email);
    const isPasswordMatch = password === confirmPassword;

    setUserNameValid(isUserNameValid);
    setEmailValid(isEmailValid);
    setPasswordMatch(isPasswordMatch);
    setUserNameErrorMessage('');
    setEmailErrorMessage('');

    if (isUserNameValid && isEmailValid && isPasswordMatch) {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        username: userName,
        email: email,
        password: password
      };

        try {
          const response = await fetch(fetchUrl, {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log('Sign up successful:', data);
          alert("Sign up successful! Redirecting to login page...");
          setTimeout(() => {
            navigate('/login');
          }, 2000);

        } catch (error) {
          console.error('Error during sign up:', error);
        }

        alert("Sign up successful! Redirecting to login page...");
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      }
    };

  return (
    <div className='sign-up-container'>
      <div className="sign-up-box">
        <h1>Food Journal</h1>
        <p>Already have an account? Click <a href="/signin">here</a> to login!</p>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <label htmlFor="userName">Username</label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={handleUserNameChange}
            required
          />

          {!userNameValid && <p>Username must be between 3 to 20 characters long.</p>}

          {userNameErrorMessage && <p className="error-message">{userNameErrorMessage}</p>}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          {!emailValid && <p className='error-message'>Invalid email address</p>}
          {emailErrorMessage && <p className="error-message">{emailErrorMessage}</p>}
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {!passwordMatch && <p className='error-message'>Passwords do not match</p>}
          <button className="submit" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
