import {Link, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie';
import './NavBar.css'
import DefaultPic from '/blankProfile.png?url';
import { useEffect,useState } from 'react'

export default function NavBar() {
    const location = useLocation();
    const { pathname } = location;

    const isSignedIn = Cookies.get('signedIn') === 'true';
    const accessToken = Cookies.get('accessToken');
    
    const [username, setUserName] = useState<string | undefined>(Cookies.get('user'));
    const [profilePic, setProfilePic] = useState<string | undefined>(Cookies.get('profilePicture') || DefaultPic);
    
    const handleLogout = () => {
        Object.keys(Cookies.get()).forEach(cookie => Cookies.remove(cookie));
        localStorage.clear();
        window.location.href = '/'; // redirect to homepage
    };

    useEffect(() => {
        const handleUserInfoUpdate = () => {
            setUserName(Cookies.get('user'));
            setProfilePic(Cookies.get('profilePicture') || DefaultPic);
        }  

        window.addEventListener('userInfoUpdated', handleUserInfoUpdate);

        return () => {
            window.removeEventListener('userInfoUpdated', handleUserInfoUpdate);
        };
    }, []);

    return (
        <nav>
            <Link to='/' id='logo-container'>
                <img  id='logo' src='logo.png' alt='Food Journal Logo' />
                <p>Food Journal</p>
            </Link>
            <ul>
                <li className={pathname === '/' ? 'selected-page' : ''}>
                    <a href='/'>HOME</a>
                </li>
                <li className={pathname === '/recipes' ? 'selected-page' : ''}>
                    <a href='/recipes'>RECIPES</a>
                </li>
                { accessToken && (
                    <li className={pathname === '/settings' ? 'selected-page' : ''}>
                        <a href='/settings'>SETTINGS</a>
                    </li>
                )}
                
            </ul>
             {!isSignedIn ? (
                <ul>
                    <li id="login-signup">
                        <a href="/login">Login</a>
                        <a href="/signup">Sign Up</a>
                    </li>
                </ul>
            ) : (
                <ul id="profile-container">
                    <li id="profile">
                        <Link to={username === "demo_guest"? "/demouserpage" : "/mypage"}>
                            <img src={profilePic} alt="Profile" />
                            <p>{username}</p>
                        </Link>
                    </li>
                    <li id="logout"><a onClick={handleLogout}>Logout</a></li>
                </ul>
            )}
        </nav>
    )
}
