import React, {useState, useEffect} from "react";
import CreateEmployPopup from "./CreateEmployPopup";
import CreateResourcePopup from "./CreateResourcePopup";
import "./styles/Resourcetable.css";

export default function ResourceTable({scheduleId}) {
    const [data, setData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isEmployPopupOpen, setIsEmployPopupOpen] = useState(false);
    const [isResourcePopupOpen, setIsResourcePopupOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/management/employ?schedule_id=${scheduleId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("There was an error fetching the employ data!", error);
            }
        };

        fetchData();
    }, [scheduleId]);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysArray = Array.from({length: daysInMonth}, (_, i) => i + 1);

    const getResourceForDay = (resources, day) => {
        return resources.filter(resource => {
            const resourceDate = new Date(resource.datetime_started);
            return resourceDate.getDate() === day && resourceDate.getMonth() === currentMonth && resourceDate.getFullYear() === currentYear;
        });
    };

    const handleMonthChange = (direction) => {
        if (direction === "prev") {
            setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
            if (currentMonth === 0) setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
            if (currentMonth === 11) setCurrentYear(prev => prev + 1);
        }
    };

    const handleOpenEmployPopup = () => {
        setIsEmployPopupOpen(true);
    };

    const handleCloseEmployPopup = () => {
        setIsEmployPopupOpen(false);
    };

    const handleEmployCreated = (newEmploy) => {
        setData([...data, newEmploy]);
    };

    const handleCellClick = (employId, day) => {
        setSelectedCell({employId, day});
        setIsResourcePopupOpen(true);
    };

    const handleCloseResourcePopup = () => {
        setIsResourcePopupOpen(false);
        setSelectedCell(null);
    };

    const handleResourceCreated = (newResource) => {
        const updatedData = data.map(employ => {
            if (employ.id === newResource.employ_id) {
                return {...employ, resources: [...employ.resources, newResource]};
            }
            return employ;
        });
        setData(updatedData);
    };

    const getDayName = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        return date.toLocaleString('default', {weekday: 'short'});
    };

    const isWeekend = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();
        return dayOfWeek === 0 || dayOfWeek === 6;
    };

    return (
        <>
            <div>
                <button onClick={handleOpenEmployPopup}>Add Employ</button>
                {isEmployPopupOpen && (
                    <CreateEmployPopup
                        onClose={handleCloseEmployPopup}
                        onEmployCreated={handleEmployCreated}
                        scheduleId={scheduleId}
                    />
                )}
                {isResourcePopupOpen && selectedCell && (
                    <CreateResourcePopup
                        onClose={handleCloseResourcePopup}
                        onResourceCreated={handleResourceCreated}
                        scheduleId={scheduleId}
                        employId={selectedCell.employId}
                        day={selectedCell.day}
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                    />
                )}
            </div>
            <div className="content">
                <div className="monthChange">
                    <button onClick={() => handleMonthChange("prev")}>Previous Month</button>
                    <span>{new Date(currentYear, currentMonth).toLocaleString('default', {month: 'long'})} {currentYear}</span>
                    <button onClick={() => handleMonthChange("next")}>Next Month</button>
                </div>
                <div className="resourceTable">
                    <table>
                        <thead>
                        <tr>
                            <th>Employee Name</th>
                            {daysArray.map(day => (
                                <th key={day} className={isWeekend(day) ? 'weekend' : ''}>
                                    {day}
                                    <br/>
                                    {getDayName(day)}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map(employ => (
                            <tr key={employ.id}>
                                <td>{employ.name}</td>
                                {daysArray.map(day => (
                                    <td key={day} className={isWeekend(day) ? 'weekend' : ''}
                                        onClick={() => handleCellClick(employ.id, day)}>
                                        {getResourceForDay(employ.resources, day).map(resource => (
                                            <div key={resource.id}>{resource.name}</div>
                                        ))}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}