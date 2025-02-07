import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditUser() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        fetch(`http://127.0.0.1:8000/user/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setUser(data);
                setName(data.name);
                setEmail(data.email);
            })
            .catch(error => console.error("Error fetching user:", error));
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(`http://127.0.0.1:8000/user/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, email })
            });

            if (response.ok) {
                navigate("/user");
            } else {
                const error = await response.json();
                setError("Update failed: " + error.detail);
            }
        } catch (error) {
            setError("Error updating user: " + error.message);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Update</button>
            </form>
        </div>
    );
}