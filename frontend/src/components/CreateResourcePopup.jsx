import React, {useState, useEffect} from "react";
import "./styles/Modal.css";

export default function CreateResourcePopup({
                                                onClose,
                                                onResourceCreated,
                                                onResourceUpdated,
                                                scheduleId,
                                                resource,
                                                employId,
                                                day,
                                                currentMonth,
                                                currentYear,
                                                defaultStartTime,
                                                defaultEndTime
                                            }) {
    const [name, setName] = useState(resource ? resource.name : "");
    const [datetimeStarted, setDatetimeStarted] = useState(resource ? resource.datetime_started : defaultStartTime);
    const [datetimeEnded, setDatetimeEnded] = useState(resource ? resource.datetime_ended : defaultEndTime);
    const [resourceType, setResourceType] = useState(resource ? resource.resource_type : "work");

    useEffect(() => {
        if (resource) {
            setName(resource.name);
            setDatetimeStarted(resource.datetime_started);
            setDatetimeEnded(resource.datetime_ended);
            setResourceType(resource.resource_type);
        } else {
            setDatetimeStarted(defaultStartTime);
            setDatetimeEnded(defaultEndTime);
        }
    }, [resource, defaultStartTime, defaultEndTime]);

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
            const response = resource
                ? await fetch(`http://127.0.0.1:8000/management/resources/${resource.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                    },
                    body: JSON.stringify(newResource)
                })
                : await fetch("http://127.0.0.1:8000/management/resources", {
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
            resource ? onResourceUpdated(result) : onResourceCreated(result);
            onClose();
        } catch (error) {
            console.error("There was an error creating/updating the resource!", error);
        }
    };

    const onDelete = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/management/resources/${resource.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            onClose();
        } catch (error) {
            console.error("There was an error deleting the resource!", error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>{resource ? "Edit Resource" : "Create Resource"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Resource Type:
                        <select value={resourceType} onChange={(e) => setResourceType(e.target.value)} required>
                            <option value="work">Work</option>
                            <option value="holiday">Holiday</option>
                        </select>
                    </label>
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
                    <button type="submit">{resource ? "Update" : "Create"} Resource</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                    {resource && <button type="button" onClick={onDelete}>Delete</button>}
                </form>
            </div>
        </div>
    );
}