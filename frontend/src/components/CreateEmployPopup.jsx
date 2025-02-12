import React, { useState } from "react";

export default function CreateEmployPopup({ onClose, onEmployCreated, scheduleId }) {
    const [employData, setEmployData] = useState({
        name: "",
        schedule_id: scheduleId
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEmployData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`http://127.0.0.1:8000/management/employ`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(employData)
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const newEmploy = await response.json();
            onEmployCreated(newEmploy);
            onClose();
        } catch (error) {
            setError("There was an error creating the employ!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Create Employ</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={employData.name}
                        onChange={handleChange}
                        placeholder="Employ Name"
                        required
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create"}
                    </button>
                </form>
            </div>
        </div>
    );
}