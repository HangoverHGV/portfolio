import React, {useState, useEffect} from "react";
import RichTextEditor from "../components/RichTextEditor";


export default function Blog() {
    return (
        <div>
            <div className="container">
                <RichTextEditor />
            </div>
        </div>
    );
}
