import React from "react";
import Navbar from "../components/NavBar";
import SignupForm from "../components/SignupForm";

export default function Signup() {
    return (
        <>
            <Navbar />
            <div className="container">
                <SignupForm />
            </div>
        </>
    );
}