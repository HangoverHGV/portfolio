import React, { useState, useEffect } from "react";
                import { useNavigate } from "react-router-dom";
                import styles from "./styles/Dashboard.module.css";

                export default function Dashboard() {
                    const [userData, setUserData] = useState(null);
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
                                        setUserData(data);
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

                    if (!userData) {
                        return <div>Loading...</div>;
                    }

                    return (
                        <div className={styles.dashboard}>
                            <h1>Welcome, {userData.name}</h1>
                            <p>Email: {userData.email}</p>
                            <p>Account created at: {new Date(userData.created_at).toLocaleString()}</p>
                        </div>
                    );
                }