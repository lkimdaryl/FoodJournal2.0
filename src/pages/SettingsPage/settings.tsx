import './settings.css'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Cookies from 'js-cookie';
import PostProfile from '../../components/postprofile/postprofile';
import DefaultPic from '/blankProfile.png?url';

interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  password?: string;
  email: string;
  profile_picture: string;
  detail?: string;
}

export default function EditProfile() {
  const isSignedIn = Cookies.get('signedIn') === 'true';
  if (!isSignedIn) {
    window.location.href = '/login'; // Redirect to login if not signed in
  }

  const [initialState, setInitialState] = useState<Partial<UserData>>({});
  const [profileImage, setProfileImage] = useState<string>(DefaultPic);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setPassword] = useState<string>('');
  const [verifyPassword, comfirmPassword] = useState<string>('');

  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [invalidUsernameMessage, setInvalidUsernameMessage] = useState<string>('');
  const [invalidEmailMessage, setInvalidEmailMessage] = useState<string>('');
  const [invalidPasswordMessage, setInvalidPasswordMessage] = useState<string>('');

  const baseUrl = 'http://localhost:6542';

  useEffect(() => {
    const accesToken = Cookies.get('accessToken');
    if (accesToken) {
      const url = `${baseUrl}/api/v1/auth/get_user?accessToken=${accesToken}`;
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then((data: UserData) => {
          setInitialState({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            username: data.username || '',
            email: data.email || '',
            profile_picture: data.profile_picture || DefaultPic
          });

          setFirstName(data.first_name);
          setLastName(data.last_name);
          setUserName(data.username);
          setEmail(data.email);
          setProfileImage(data.profile_picture);
        });
    }
  }, []);

  const handlePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const pic = event.target.files?.[0];
    if (pic) {
      const reader = new FileReader();
      reader.readAsDataURL(pic);
      reader.onload = function (e) {
        if (e.target?.result) setProfileImage(e.target.result as string);
      };
    }
  };

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value);
  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => setLastName(event.target.value);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    if (!name) {
      setInvalidUsernameMessage('');
    } else if (name.length < 3 || name.length > 20) {
      setInvalidUsernameMessage('Username must be between 3 and 20 characters long');
      setUserName(initialState.username || '');
    } else {
      setUserName(name);
      setInvalidUsernameMessage('');
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const emailInput = event.target.value;
    if (!emailInput) {
      setInvalidEmailMessage('');
      setEmail(initialState.email || '');
    } else if (!validateEmail(emailInput)) {
      setInvalidEmailMessage('Invalid email address');
    } else {
      setEmail(emailInput);
      setInvalidEmailMessage('');
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value);
  const VerifyNewPassword = (event: ChangeEvent<HTMLInputElement>) => comfirmPassword(event.target.value);

  const handleEditButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsReadOnly(false);
  };

  const handleCancelButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInvalidEmailMessage('');
    setInvalidPasswordMessage('');
    setInvalidUsernameMessage('');
    setIsReadOnly(true);
    setFirstName(initialState.first_name || '');
    setLastName(initialState.last_name || '');
    setUserName(initialState.username || '');
    setEmail(initialState.email || '');
    setPassword('');
    (document.querySelector('.form') as HTMLFormElement)?.reset();
  };

  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInvalidEmailMessage('');
    setInvalidPasswordMessage('');
    setInvalidUsernameMessage('');

    if (newPassword !== verifyPassword) {
      setInvalidPasswordMessage('Passwords do not match');
      return;
    }
    if (!validateEmail(email)) {
      setInvalidEmailMessage('Invalid email address');
      return;
    }

    setIsReadOnly(true);
    const accesToken = Cookies.get('accessToken');
    if (accesToken) {
      const updateUrl = `${baseUrl}/api/v1/auth/update_user?accessToken=${accesToken}`;
      const updatedData: Partial<UserData> = {};
      if (firstName !== initialState.first_name) updatedData.first_name = firstName;
      if (lastName !== initialState.last_name) updatedData.last_name = lastName;
      if (userName !== initialState.username) updatedData.username = userName;
      if (newPassword) updatedData.password = newPassword;
      if (email !== initialState.email) updatedData.email = email;
      if (profileImage !== initialState.profile_picture) updatedData.profile_picture = profileImage;

      setInitialState({
        first_name: firstName,
        last_name: lastName,
        username: userName,
        email: email,
        profile_picture: profileImage
      });

      try {
        const response = await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedData)
        });
        const data: UserData = await response.json();

        if (data.detail) {
          alert(`User could not be updated. ${data.detail}. Please try again.`);
          setFirstName(initialState.first_name || '');
          setLastName(initialState.last_name || '');
          setUserName(initialState.username || '');
          setEmail(initialState.email || '');
          setProfileImage(initialState.profile_picture || '');
          setIsReadOnly(true);
          throw new Error('User could not be updated.')
        }

        Cookies.set('user', userName);
        Cookies.set('profilePicture', profileImage)
        window.dispatchEvent(new Event('userInfoUpdated'));
        
      } catch (error) {
        console.error('Error:', error);
      }
    }
    (document.getElementById('registrationForm') as HTMLFormElement)?.reset();
  };

  return (
    <div className="profilePage">
        <div className="profile-settings">
            <PostProfile 
                username={userName} 
                profilePic={profileImage} 
                size='200px'
            />
            {!isReadOnly && 
            <label htmlFor="file-upload" className={"custom-upload-btn action-button"}>
                Change Profile Picture
            </label>}
            {!isReadOnly && <input 
                id="file-upload"
                type="file" 
                className='hidden-file-input'
                onChange={handlePictureChange} 
                accept="image/png, image/jpeg"
                disabled={isReadOnly}
            />}
        </div>

        <form className="form" id="registrationForm" onSubmit={handleSubmit}>
          <div className="input-section">
            <div>
                <label htmlFor="first_name"><h4>First name: </h4></label>
                <input 
                    defaultValue={firstName}
                    onChange={handleFirstNameChange} 
                    type="text" 
                    className="form-control" 
                    name="first_name" 
                    id="first_name" 
                    placeholder="first name" 
                    readOnly={isReadOnly}
                />
                <output className="output">{''}</output>
            </div>
            <div>
                <label htmlFor="last_name"><h4>Last name: </h4></label>
                <input 
                    defaultValue={lastName}
                    onChange={handleLastNameChange} 
                    type="text" 
                    className="form-control" 
                    name="last_name" 
                    id="last_name" 
                    placeholder="last name" 
                    readOnly={isReadOnly}
                />
                <output className="output">{''}</output>
            </div>
            <div>
                <label htmlFor="username"><h4>Username: </h4></label>
                <input 
                    defaultValue={userName}
                    onChange={handleUsernameChange} 
                    type="text" 
                    className="form-control" 
                    name="username" 
                    id="username" 
                    placeholder="your username"
                    maxLength={20}
                    minLength={3} 
                    readOnly={isReadOnly}
                />
                <output>{invalidUsernameMessage}</output>
            </div>

            <div>
                <label htmlFor="email"><h4>Email:</h4></label>
                <input 
                    defaultValue= {email}
                    onChange={handleEmailChange} 
                    type="email" 
                    className="form-control" 
                    name="email" 
                    id="email" 
                    placeholder="you@email.com" 
                    readOnly={isReadOnly}
                />
                <output className="output">{invalidEmailMessage}</output>
            </div>

            <div>
                <label htmlFor="password"><h4>{isReadOnly? "Password" : "New Password"}</h4></label>
                <input 
                    onChange={handlePasswordChange} 
                    type="password" 
                    className="form-control" 
                    name="password" 
                    id="password" 
                    placeholder={isReadOnly? "●●●●●●●" : "new password"} 
                    readOnly={isReadOnly}
                />
                <output className="output">{''}</output>
            </div>
            {!isReadOnly && <div>
                <label htmlFor="password2"><h4>Verify</h4></label>
                <input 
                    onChange={VerifyNewPassword} 
                    type="password" 
                    className="form-control" 
                    name="password2" 
                    id="password2" 
                    placeholder="verify password" 
                    readOnly={isReadOnly}
                />
                <output className="output">{invalidPasswordMessage}</output>
            </div> }
          </div>
          <div className='button-section'>
              <button 
                  className="submit-button action-button" 
                  onClick={isReadOnly? handleEditButton:handleSubmit}
                  disabled={
                      !!invalidUsernameMessage || 
                      !!invalidEmailMessage}> 
                  {isReadOnly? 'Edit':'Save'}
              </button>
              {!isReadOnly && (
                  <button className="action-button" onClick={handleCancelButton}>
                      Cancel
                  </button>
              )}
          </div>
        </form>
    </div>
  );
}
