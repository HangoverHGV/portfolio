import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./styles/SigupForm.module.css";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://127.0.0.1:8000/user/token";
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log("Login successful:", data);
                localStorage.setItem("access_token", data.access_token);
                navigate("/"); // Redirect to home page after successful login
            } else {
                const error = await response.json();
                setError("Login failed: " + error.detail);
            }
        } catch (error) {
            setError("Error logging in: " + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.signupForm}>
            <h1>Login</h1>
            <div className={styles.formGroup}>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p style={{color: "red"}}>{error}</p>}
            <button type="submit" className={styles.submitButton}>Login</button>
        </form>
    );
}