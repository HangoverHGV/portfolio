import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Navbar from "../components/NavBar";
import styles from "../components/styles/Post.module.css";

export default function Post() {
    const {postId} = useParams();
    const [post, setPost] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/blogpost/${postId}`);
                const data = await response.json();
                setPost(data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("access_token");
            if (token) {
                try {
                    const response = await fetch("http://127.0.0.1:8000/user/my/user", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        const data = await response.json();
                        setCurrentUser(data);
                    }
                } catch (error) {
                    console.error("Error fetching current user:", error);
                }
            }
        };

        fetchPost();
        fetchCurrentUser();
    }, [postId]);

    const handleDelete = async () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/blogpost/${postId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    alert("Post deleted successfully");
                    navigate("/blog");
                } else {
                    alert("Failed to delete post");
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("Error deleting post");
            }
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    const isUserPost = currentUser && post.user_id === currentUser.id;

    return (
        <>
            <Navbar/>
            <div className="container">
                <h1>{post.title}</h1>
                <h3>by {post.user_name}</h3>
                <div className={styles.content} dangerouslySetInnerHTML={{__html: post.content}}/>
                {isUserPost ? (
                    <div className={styles.buttonContainer}>
                        <button onClick={() => navigate(`/edit/${postId}`)}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                ) : (
                    <div>
                        <p></p>
                    </div>
                )}
            </div>
        </>
    );
}