import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navbar from "../components/NavBar";
import styles from "./styles/RichTextEditor.module.css";

export default function RichTextEditor() {
    const [value, setValue] = useState("");

    return (
        <div>
            <Navbar />
            <div className={styles.editorContainer}>
                <ReactQuill theme="snow" value={value} onChange={setValue} />
            </div>
        </div>
    );
}