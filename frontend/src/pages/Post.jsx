import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function Post() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/blogpost/${postId}`)
            .then(response => response.json())
            .then(data => setPost(data))
            .catch(error => console.error("Error fetching post:", error));
    }, [postId]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container">
                <h1>{post.title}</h1>
                <h3>by {post.user_name}</h3>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </>
    );
}