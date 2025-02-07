import React, {useState, useEffect} from "react";
import Navbar from "../components/NavBar";
import RichTextEditor from "../components/RichTextEditor";


export default function Blog() {
    return (
        <div>
            <Navbar />
            <div className="container">
                <h1>Blog</h1>
                <RichTextEditor />
            </div>
        </div>
    );
}
