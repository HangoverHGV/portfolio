import React from "react";
import Navbar from "../components/NavBar";
import Dashboard from "../components/Dashboard";


export default function Signup() {
    return (
        <>
            <Navbar />
            <div className="container">
                <Dashboard />
            </div>
        </>
    );
}