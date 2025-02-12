import React, {useState} from "react";
import "./styles/Modal.css";

export default function CreateResourcePopup({
                                                onClose,
                                                onResourceCreated,
                                                scheduleId,
                                                employId,
                                                day,
                                                currentMonth,
                                                currentYear
                                            }) {
    const [name, setName] = useState("");
    const [datetimeStarted, setDatetimeStarted] = useState("");
    const [datetimeEnded, setDatetimeEnded] = useState("");
    const [resourceType, setResourceType] = useState("work");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newResource = {
            name,
            datetime_started: datetimeStarted,
            datetime_ended: datetimeEnded,
            schedule_id: scheduleId,
            employ_id: employId,
            resource_type: resourceType
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/management/resources", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(newResource)
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const result = await response.json();
            onResourceCreated(result);
            onClose();
        } catch (error) {
            console.error("There was an error creating the resource!", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Create Resource</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/>
                    </label>
                    <label>
                        Start Date and Time:
                        <input type="datetime-local" value={datetimeStarted}
                               onChange={(e) => setDatetimeStarted(e.target.value)} required/>
                    </label>
                    <label>
                        End Date and Time:
                        <input type="datetime-local" value={datetimeEnded}
                               onChange={(e) => setDatetimeEnded(e.target.value)} required/>
                    </label>
                    <label>
                        Resource Type:
                        <select value={resourceType} onChange={(e) => setResourceType(e.target.value)} required>
                            <option value="work">Work</option>
                            <option value="holiday">Holiday</option>
                        </select>
                    </label>
                    <button type="submit">Create</button>
                </form>
            </div>
        </div>
    );
}