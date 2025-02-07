import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import styles from "./styles/AdminTable.module.css";

export default function AdminTable() {
    const [allUsers, setAllUsers] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [token, setToken] = useState("");

    useEffect(() => {
        // Fetch the token from local storage or any other secure place
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        // Fetch all users
        fetch("http://127.0.0.1:8000/user/", {
            headers: {
                "Authorization": `Bearer ${storedToken}`
            }
        })
            .then(response => response.json())
            .then(data => setAllUsers(data))
            .catch(error => console.error("Error fetching users:", error));

        // Fetch all posts
        fetch("http://127.0.0.1:8000/blogpost/", {
            headers: {
                "Authorization": `Bearer ${storedToken}`
            }
        })
            .then(response => response.json())
            .then(data => setAllPosts(data))
            .catch(error => console.error("Error fetching blog posts:", error));
    }, []);

    const handleDeleteUser = (userId) => {
        fetch(`http://127.0.0.1:8000/user/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    setAllUsers(allUsers.filter(user => user.id !== userId));
                } else {
                    console.error("Error deleting user");
                }
            })
            .catch(error => console.error("Error deleting user:", error));
    };

    const handleDeletePost = (postId) => {
        fetch(`http://127.0.0.1:8000/blogpost/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    setAllPosts(allPosts.filter(post => post.id !== postId));
                } else {
                    console.error("Error deleting post");
                }
            })
            .catch(error => console.error("Error deleting post:", error));
    };

    return (
        <div>
            <h2>All Users</h2>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {allUsers.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                            <Link to={`/user/${user.id}`}>{user.name}</Link>
                        </td>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>All Posts</h2>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>User ID</th>
                    <th>User Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {allPosts.map(post => (
                    <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>
                            <Link to={`/post/${post.id}`}>{post.title}</Link>
                        </td>
                        <td>{post.content}</td>
                        <td>{post.user_id}</td>
                        <td>{post.user_name}</td>
                        <td>
                            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}