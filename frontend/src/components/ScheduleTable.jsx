import React, { useState, useEffect } from "react";

            export default function ScheduleTable({ userId }) {
                const [schedules, setSchedules] = useState([]);

                useEffect(() => {
                    const fetchSchedules = async () => {
                        const token = localStorage.getItem("access_token");
                        try {
                            const response = await fetch(`http://127.0.0.1:8000/management/schedules?user_id=${userId}`, {
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
                        } catch (error) {
                            console.error("Error fetching schedules:", error);
                        }
                    };

                    fetchSchedules();
                }, [userId]);

                const handleEdit = (scheduleId) => {
                    console.log("Edit schedule:", scheduleId);
                    // Implement edit functionality
                };

                const handleDelete = (scheduleId) => {
                    console.log("Delete schedule:", scheduleId);
                    // Implement delete functionality
                };

                return (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map(schedule => (
                                    <tr key={schedule.id}>
                                        <td>
                                            <a className="scheduleTitle" href={`/planning/${schedule.id}`}>{schedule.title}</a>
                                        </td>
                                        <td>
                                            <button onClick={() => handleEdit(schedule.id)}>Edit</button>
                                            <button onClick={() => handleDelete(schedule.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }