import React, {useState, useEffect} from "react";
import Navbar from "../components/NavBar";
import CreateSchedulePopup from "../components/CreateSchedulePopup";
import ScheduleTable from "../components/ScheduleTable";

export default function Planning() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("access_token");
            try {
                const response = await fetch("http://127.0.0.1:8000/user/my/user", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCurrentUser(data);
                } else {
                    console.error("Failed to fetch current user");
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        fetchCurrentUser();
    }, []);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleScheduleCreated = (newSchedule) => {
        console.log("New schedule created:", newSchedule);
        // Handle the new schedule (e.g., update state or fetch schedules)
    };
    const getSchedules = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const response = await fetch(`http://127.0.0.1:8000/management/schedules?user_id=${currentUser.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSchedules(data);
                } else {
                    console.error("Failed to fetch schedules");
                }
            }catch (error) {
                console.error("Error fetching schedules:", error);
            }
        }

            return (
                <>
                    <Navbar/>
                    <div className="container">
                        <button onClick={handleOpenPopup}>Create Schedule</button>
                        {isPopupOpen && (
                            <CreateSchedulePopup onClose={handleClosePopup} onScheduleCreated={handleScheduleCreated}/>
                        )}

                    </div>
                </>
            );
        }