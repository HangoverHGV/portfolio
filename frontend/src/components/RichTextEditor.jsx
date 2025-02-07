import React, { useEffect, useRef } from "react";
        import ReactQuill from "react-quill";
        import "react-quill/dist/quill.snow.css";
        import ImageResize from "quill-image-resize-module-react";
        import styles from "./styles/RichTextEditor.module.css";
        import Quill from "quill";

        // Register the image resize module
        Quill.register("modules/imageResize", ImageResize);

        export default function RichTextEditor({ value, onChange }) {
            const quillRef = useRef(null);

            useEffect(() => {
                if (quillRef.current) {
                    const editor = quillRef.current.getEditor();
                    if (editor.root.innerHTML !== value) {
                        editor.clipboard.dangerouslyPasteHTML(value);
                    }
                }
            }, [value]);

            const modules = {
                toolbar: [
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['bold', 'italic', 'underline'],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                ],
                imageResize: {
                    parchment: Quill.import('parchment'),
                    modules: ['Resize', 'DisplaySize', 'Toolbar']
                }
            };

            return (
                <div>
                    <div className={styles.editorContainer}>
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={value}
                            onChange={onChange}
                            modules={modules}
                            className={styles.editor}
                        />
                    </div>
                </div>
            );
        }