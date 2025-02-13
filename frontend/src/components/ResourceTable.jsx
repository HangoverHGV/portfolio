import React, {useState, useEffect} from "react";
import CreateEmployPopup from "./CreateEmployPopup";
import CreateResourcePopup from "./CreateResourcePopup";
import "./styles/Resourcetable.css";

export default function ResourceTable({scheduleId}) {
    const [data, setData] = useState([]);
    const [resources, setResources] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isEmployPopupOpen, setIsEmployPopupOpen] = useState(false);
    const [isResourcePopupOpen, setIsResourcePopupOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedCell, setSelectedCell] = useState(null);

    useEffect(() => {
        fetchData();
        fetchResources();
    }, [scheduleId]);

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

    const fetchResources = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/management/resources?schedule_id=${scheduleId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();
            setResources(result);
        } catch (error) {
            console.error("There was an error fetching the resources!", error);
        }
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysArray = Array.from({length: daysInMonth}, (_, i) => i + 1);

    const getResourceForDay = (employId, day) => {
        return resources.filter(resource => {
            const startDate = new Date(resource.datetime_started);
            const endDate = new Date(resource.datetime_ended);
            return resource.employ_id === employId &&
                ((startDate.getDate() <= day && endDate.getDate() >= day) &&
                    (startDate.getMonth() === currentMonth && endDate.getMonth() === currentMonth) &&
                    (startDate.getFullYear() === currentYear && endDate.getFullYear() === currentYear));
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
        const date = new Date(currentYear, currentMonth, day);
        const defaultStartTime = new Date(date);
        defaultStartTime.setHours(8, 0);
        const defaultEndTime = new Date(date);
        defaultEndTime.setHours(16, 30);

        const formatDate = (date) => {
            const pad = (num) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };
        setSelectedCell({
            employId,
            day,
            defaultStartTime: formatDate(defaultStartTime),
            defaultEndTime: formatDate(defaultEndTime)
        });
        setSelectedResource(null);
        setIsResourcePopupOpen(true);
    };

    const handleResourceClick = (e, resource) => {
        e.stopPropagation();
        setSelectedResource(resource);
        setSelectedCell(null);
        setIsResourcePopupOpen(true);
    };

    const handleCloseResourcePopup = () => {
        setIsResourcePopupOpen(false);
        setSelectedResource(null);
        setSelectedCell(null);
        fetchResources();
    };

    const handleResourceCreated = (newResource) => {
        setResources([...resources, newResource]);
    };

    const handleResourceUpdated = (updatedResource) => {
        const updatedResources = resources.map(resource =>
            resource.id === updatedResource.id ? updatedResource : resource
        );
        setResources(updatedResources);

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

const renderResources = (resources, employId, day) => {
    if (resources.length === 0) {
        return <td key={`${employId}-${day}`} onClick={() => handleCellClick(employId, day)}></td>;
    }

    const multiDayResource = resources.find(resource => {
        const startDate = new Date(resource.datetime_started);
        const endDate = new Date(resource.datetime_ended);
        return startDate.getDate() === day && endDate.getDate() > day;
    });

    if (multiDayResource) {
        const startDate = new Date(multiDayResource.datetime_started);
        const endDate = new Date(multiDayResource.datetime_ended);
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        const colspan = endDay - startDay + 1;

        if (colspan > 1) {
            return (
                <td key={`${employId}-${day}`} colSpan={colspan} onClick={() => handleCellClick(employId, day)}>
                    <div key={multiDayResource.id} className={`resource span`} onClick={(e) => handleResourceClick(e, multiDayResource)}>
                        {multiDayResource.name}
                        <div className="tooltip">
                            Start: {multiDayResource.datetime_started}<br/>
                            End: {multiDayResource.datetime_ended}
                        </div>
                    </div>
                </td>
            );
        }
    }

    return <td key={`${employId}-${day}`} onClick={() => handleCellClick(employId, day)}></td>;
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
                {isResourcePopupOpen && (
                    <CreateResourcePopup
                        onClose={handleCloseResourcePopup}
                        onResourceCreated={handleResourceCreated}
                        onResourceUpdated={handleResourceUpdated}
                        scheduleId={scheduleId}
                        resource={selectedResource}
                        employId={selectedCell?.employId}
                        day={selectedCell?.day}
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        defaultStartTime={selectedCell?.defaultStartTime}
                        defaultEndTime={selectedCell?.defaultEndTime}
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
                                {daysArray.map(day => {
                                    const resourcesForDay = getResourceForDay(employ.id, day);
                                    if (resourcesForDay.length > 0) {
                                        return renderResources(resourcesForDay, employ.id, day);
                                    }
                                    return <td key={day} className={isWeekend(day) ? 'weekend' : ''}
                                               onClick={() => handleCellClick(employ.id, day)}></td>;
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}