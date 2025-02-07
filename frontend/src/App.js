import './App.css';
import React from "react";
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import Blog from "./pages/Blog";
import Post from "./pages/Post";

const router = createBrowserRouter([
    {path: "/" , element: <HomePage/>},
    {path: "/blog" , element: <Blog/>},
    {path: "/post/:postId" , element: <Post/>},
    ]);

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
