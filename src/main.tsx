import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './pages/HomePage/Home.tsx'
import ErrorPage from './pages/ErrorPage/PageNotFound.tsx'
import Recipes from './pages/RecipePage/Recipes.tsx'
import Login from './pages/LoginPage/Login.tsx'
import SignUp from './pages/SignUpPage/SignUp.tsx'
import UserPage from './pages/UserPage/User.tsx'
import NewPost from './pages/PostPage/NewPost.tsx';
import EditPost from './pages/PostPage/EditPost.tsx';
import MyPage from './pages/UserPage/MyPage.tsx';
import DemoUserPage from './pages/UserPage/DemoUserPage.tsx';
import Settings from './pages/SettingsPage/settings.tsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {path: '/', element: <Home />},
      {path: '/recipes', element: <Recipes />},
      {path: '/settings', element: <Settings />},
      {path: '/login', element: <Login />},
      {path: '/signup', element: <SignUp />},
      {path: '/mypage', element: <MyPage />},
      {path: '/demouserpage', element: <DemoUserPage />},
      {path: '/userpage', element: <UserPage />},
      {path: '/newpost', element: <NewPost />},
      {path: '/editpost', element: <EditPost />}
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
