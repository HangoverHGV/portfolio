import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/NavBar";
import styles from "../components/styles/Blog.module.css";

export default function Blog() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is logged in
        const token = localStorage.getItem("access_token");
        setIsLoggedIn(!!token);

        // Fetch all users
        fetch("http://127.0.0.1:8000/user/")
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setUsers(data);
                    console.log(data);
                } else {
                    console.error("Error: Users data is not an array");
                }
            })
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    useEffect(() => {
        // Fetch blog posts based on selected user ID
        let url = "http://127.0.0.1:8000/blogpost/";
        if (selectedUserId) {
            url += `?user_id=${selectedUserId}`;
        }
        fetch(url)
            .then(response => response.json())
            .then(data => setBlogPosts(data))
            .catch(error => console.error("Error fetching blog posts:", error));
    }, [selectedUserId]);

    const handleCreatePost = () => {
        navigate("/create-post");
    };

    return (
        <>
            <Navbar/>
            <div className="container">
                {isLoggedIn && (
                    <button onClick={handleCreatePost} className={styles.createPostButton}>
                        Create Blog Post
                    </button>
                )}
                <div className={styles.filterContainer}>
                    <label htmlFor="userDropdown">Filter by User:</label>
                    <select
                        id="userDropdown"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                    >
                        <option value="">All Users</option>
                        {Array.isArray(users) && users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.blogContainer}>
                {blogPosts.map((post, index) => (
                    <div className={styles.blogItem} key={index}>
                        <a href={`/post/${post.id}`}>{post.title}</a>
                        <h3 className={styles.username}>by {post.user_name}</h3>
                    </div>
                ))}
                </div>
            </div>
        </>
    );
}