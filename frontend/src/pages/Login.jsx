import React from "react";
import Navbar from "../components/NavBar";
import LoginForm from "../components/LoginForm";


export default function Signup() {
    return (
        <>
            <Navbar />
            <div className="container">
                <h1>Login</h1>
                <LoginForm />
            </div>
        </>
    );
}