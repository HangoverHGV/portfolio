import React, {useState} from "react";
import "./styles/CreateSchedulePopup.css";

export default function CreateSchedulePopup({onClose, onScheduleCreated}) {
    const [title, setTitle] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch("http://127.0.0.1:8000/management/schedules", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({title})
            });
            if (response.status === 201) {
                const data = await response.json();
                onScheduleCreated(data);
                onClose();
            } else {
                console.error("Failed to create schedule");
            }
        } catch (error) {
            console.error("Error creating schedule:", error);
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>Create Schedule</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Title:
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                    </label>
                    <button type="submit">Create</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}