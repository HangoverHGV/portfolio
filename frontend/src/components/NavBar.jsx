import React from "react";
import {useState, useEffect} from "react";
import "./styles/NavBar.css";


export default function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/blog">Blog</a>
                </li>
                <li>
                    <a href="/login">Login</a>
                </li>
                <li>
                    <a href="/signup">Signup</a>
                </li>
            </ul>
        </nav>
    );
}
