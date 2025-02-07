import React, {useState, useEffect} from "react";
import Navbar from "../components/NavBar";
import styles from "../components/styles/Blog.module.css";

export default function Blog() {
    const [blogPosts, setBlogPosts] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/blogpost/")
            .then(response => response.json())
            .then(data => setBlogPosts(data))
            .catch(error => console.error("Error fetching blog posts:", error));
    }, []);

    return (
        <>
            <Navbar/>
            <div className="container">
                {blogPosts.map((post, index) => (
                    <div key={index}>
                        <h2><a href={`/post/${post.id}`}>{post.title}</a></h2>
                        <h3 className={styles.username}>by {post.user_name}</h3>
                    </div>
                ))}
            </div>
        </>
    );
}