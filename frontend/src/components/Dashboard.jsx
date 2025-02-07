import React, { useState, useEffect } from "react";
                                            import { useNavigate } from "react-router-dom";
                                            import styles from "./styles/Dashboard.module.css";

                                            export default function Dashboard() {
                                                const [userData, setUserData] = useState({ name: "", email: "", password: "" });
                                                const [userId, setUserId] = useState(null);
                                                const navigate = useNavigate();

                                                useEffect(() => {
                                                    const fetchUserData = async () => {
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
                                                                    setUserData({ ...data, password: "" });
                                                                    setUserId(data.id);
                                                                } else {
                                                                    navigate("/login");
                                                                }
                                                            } catch (error) {
                                                                console.error("Error fetching user data:", error);
                                                                navigate("/login");
                                                            }
                                                        } else {
                                                            navigate("/login");
                                                        }
                                                    };

                                                    fetchUserData();
                                                }, [navigate]);

                                                const handleChange = (e) => {
                                                    const { name, value } = e.target;
                                                    setUserData((prevData) => ({ ...prevData, [name]: value }));
                                                };

                                                const handleSubmit = async (e) => {
                                                    e.preventDefault();
                                                    const token = localStorage.getItem("access_token");
                                                    if (token && userId) {
                                                        try {
                                                            const response = await fetch(`http://127.0.0.1:8000/user/${userId}`, {
                                                                method: "PUT",
                                                                headers: {
                                                                    "Content-Type": "application/json",
                                                                    "Authorization": `Bearer ${token}`
                                                                },
                                                                body: JSON.stringify(userData)
                                                            });
                                                            if (response.status === 200) {
                                                                const data = await response.json();
                                                                setUserData({ ...data, password: "" });
                                                                alert("User details updated successfully");
                                                            } else {
                                                                alert("Failed to update user details");
                                                            }
                                                        } catch (error) {
                                                            console.error("Error updating user data:", error);
                                                            alert("Error updating user details");
                                                        }
                                                    }
                                                };

                                                if (!userData.name) {
                                                    return <div>Loading...</div>;
                                                }

                                                return (
                                                    <div className={styles.dashboard}>
                                                        <h1>Welcome, {userData.name}</h1>
                                                        <form onSubmit={handleSubmit}>
                                                            <div>
                                                                <label>Name:</label>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={userData.name}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Email:</label>
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    value={userData.email}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label>Password:</label>
                                                                <input
                                                                    type="password"
                                                                    name="password"
                                                                    value={userData.password}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                            <button type="submit">Update</button>
                                                        </form>
                                                    </div>
                                                );
                                            }