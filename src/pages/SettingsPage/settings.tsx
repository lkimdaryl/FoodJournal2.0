import './settings.css'
import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
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
  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = '/login';
    }
  }, [isSignedIn]);
  
  const initialStateRef = useRef<Partial<UserData>>({});
  const [profileImage, setProfileImage] = useState<string>(DefaultPic);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setPassword] = useState<string>(''); 
  const [verifyPassword, comfirmPassword] = useState<string>('');

  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [invalidEmailMessage, setInvalidEmailMessage] = useState<string>('');
  const [invalidPasswordMessage, setInvalidPasswordMessage] = useState<string>('');

  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    if (accessToken) {
      const url = `${baseUrl}/api/v1/auth/get_user?accessToken=${accessToken}`;
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then((data: UserData) => {
          initialStateRef.current = data;
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setUserName(data.username);
          setEmail(data.email);
          setProfileImage(data.profile_picture? data.profile_picture : DefaultPic);
        });
    }
  }, []);

  const resetHooks = () => {
    setFirstName(initialStateRef.current.first_name || '');
    setLastName(initialStateRef.current.last_name || '');
    setUserName(initialStateRef.current.username || '');
    setEmail(initialStateRef.current.email || '');
    setProfileImage(initialStateRef.current.profile_picture || DefaultPic);
    setPassword('');
  }

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

  const validateField = (name: string, value: string): boolean => {
    switch (name) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
          setInvalidEmailMessage('Invalid email address');
          return false;
        } else {
          setInvalidEmailMessage('');
        }
        break;
      case 'verifyPassword':
        if (value !== newPassword){
          setInvalidPasswordMessage('Passwords do not match');
          return false
        } else {
          setInvalidPasswordMessage('')
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value);
  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => setLastName(event.target.value);
  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => setUserName(event.target.value);
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const emailInput = event.target.value;
    setEmail(emailInput);
    validateField('email', emailInput)
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
    setIsReadOnly(true);
    resetHooks();
    (document.querySelector('.form') as HTMLFormElement)?.reset();
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const isValid =
      validateField('email', email) &&
      validateField('verifyPassword', verifyPassword);

    if (!isValid) return;

    setIsReadOnly(true);

    const updateUrl = `${baseUrl}/api/v1/auth/update_user?accessToken=${accessToken}`;
    const updatedData: Partial<UserData> = {};
    if (firstName !== initialStateRef.current.first_name) updatedData.first_name = firstName;
    if (lastName !== initialStateRef.current.last_name) updatedData.last_name = lastName;
    if (userName !== initialStateRef.current.username) updatedData.username = userName;
    if (newPassword) updatedData.password = newPassword;
    if (email !== initialStateRef.current.email) updatedData.email = email;
    if (profileImage !== initialStateRef.current.profile_picture) updatedData.profile_picture = profileImage;
    initialStateRef.current = updatedData;
    delete initialStateRef.current.password;
    

    try {
      const response = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok){
        const errorData = await response.json().catch(() => ({}));
        alert(`User could not be updated. ${errorData.detail || ''} Please try again.`);
        setIsReadOnly(true);
        throw new Error('User could not be updated.')
      }
      Cookies.set('user', userName);
      Cookies.set('profilePicture', profileImage)
      window.dispatchEvent(new Event('userInfoUpdated'));
    } catch (error) {
      console.error('Error:', error);
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

        <form className="form" id="registrationForm">
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
