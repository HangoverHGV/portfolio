import './App.css';
import React from "react";
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import User from "./pages/User";
import EditPost from "./pages/EditPost";
import UserFromAdmin from "./pages/UserFromAdmin";
import CreatePost from "./pages/CreatePost";

const router = createBrowserRouter([
    {path: "/" , element: <HomePage/>},
    {path: "/blog" , element: <Blog/>},
    {path: "/post/:postId" , element: <Post/>},
    {path: "/signup" , element: <Signup/>},
    {path: "/login" , element: <Login/>},
    {path: "/user" , element: <User/>},
    {path: "/edit/:postId" , element: <EditPost/>},
    {path: "/user/:userId" , element: <UserFromAdmin/>},
    {path: "/create-post" , element: <CreatePost/>},
    ]);

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
