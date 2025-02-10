import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import styles from "../components/styles/CreatePost.module.css";
import Navbar from "../components/NavBar";

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch("http://127.0.0.1:8000/blogpost/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({title, content})
            });

            if (response.ok) {
                navigate("/blog");
            } else {
                const error = await response.json();
                setError("Creation failed: " + error.detail);
            }
        } catch (error) {
            setError("Error creating post: " + error.message);
        }
    };

    return (<>
            <Navbar/>
            <div className="container">
                <div className={styles.createPostContainer}>

                <h1 className={styles.glow}>Create Blog Post</h1>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputContainer}>
                            <label>Title:</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.inputContainer}>
                            <label>Content:</label>
                            <RichTextEditor value={content} onChange={setContent}/>
                        </div>
                        {error && <p style={{color: "red"}}>{error}</p>}
                        <button className={styles.submitButton} type="submit">Create</button>
                    </form>
                </div>
            </div>
        </>
    );
}