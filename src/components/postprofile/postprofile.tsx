import './postprofile.css'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface PostProfileProps {
    username: string;
    profilePic?: string;
    size?: string; // Optional size prop for profile picture
    postUserId?: string | number;
    currentUserId?: string | number;
}
export default function PostProfile({profilePic, username, postUserId, currentUserId}: PostProfileProps) {

    const currentPath = useLocation().pathname;
    const navigate = useNavigate();    

    const handleUsernameClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        Cookies.set('username', username);
        if (currentPath === '/settings') {
            return;
        }
        if (Number(postUserId) === Number(currentUserId)) {
            navigate('/mypage', { state: { username, currentUserId, profilePic} });
        }else{
            navigate('/userpage', { state: { username, postUserId, profilePic} });
        }
    };
  
    return (
    <div className='profile-section' onClick={handleUsernameClick} >
        <img className='profile-pic' src={profilePic} alt='Profile' />
        <p className='username'>{username}</p>
    </div>
  )
}