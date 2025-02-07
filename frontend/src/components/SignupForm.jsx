import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/SigupForm.module.css";

export default function SignupForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://127.0.0.1:8000/user/";
        const userData = { name, email, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (response.status === 201) {
                const data = await response.json();
                console.log("User created successfully:", data);
                navigate("/login"); // Redirect to login page after successful signup
            } else if (response.status === 400) {
                const error = await response.json();
                setError(error.detail);
            } else if (response.status === 422) {
                const error = await response.json();
                setError("Validation error: " + JSON.stringify(error));
            } else {
                setError("Unexpected error: " + response.status);
            }
        } catch (error) {
            setError("Error creating user: " + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
            <button type="submit" className={styles.submitButton}>Signup</button>
        </form>
    );
}