import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import Navbar from "../components/NavBar";

export default function EditPost() {
    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/blogpost/${postId}`);
                const data = await response.json();
                setPost(data);
                setContent(data.content);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, [postId]);

    const handleSave = async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/blogpost/${postId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({title: post.title, content})
                });
                if (response.status === 200) {
                    alert("Post updated successfully");
                    navigate(`/post/${postId}`);
                } else {
                    alert("Failed to update post");
                }
            } catch (error) {
                console.error("Error updating post:", error);
                alert("Error updating post");
            }
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (<>
            <Navbar/>
        <div className="container">
            <h1>Edit Post</h1>
            <RichTextEditor value={content} onChange={setContent}/>
            <button onClick={handleSave}>Save</button>
        </div>
        </>
    );
}