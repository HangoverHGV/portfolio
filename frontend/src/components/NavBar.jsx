import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import "./styles/NavBar.css";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
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
                        setIsLoggedIn(true);
                        setUsername(data.name);
                    } else {
                        setIsLoggedIn(false);
                    }
                } catch (error) {
                    console.error("Error checking login status:", error);
                    setIsLoggedIn(false);
                }
            }
        };

        checkLoginStatus();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/blog">Blog</a>
                </li>
                {isLoggedIn ? (
                    <>
                        <li>
                            <a href="/user">{username}</a>
                        </li>
                        <li className="logout">
                            <a onClick={handleLogout}>Logout</a>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <a href="/login">Login</a>
                        </li>
                        <li>
                            <a  href="/signup">Sign-up</a>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}