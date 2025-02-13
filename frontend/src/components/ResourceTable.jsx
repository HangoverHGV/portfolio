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

    const renderResources = (resourcesForDay, employId, day) => {
        const spanningResources = resourcesForDay.filter(resource => {
            const startDate = new Date(resource.datetime_started);
            return startDate.getDate() === day;
        });

        if (spanningResources.length > 0) {
            const resource = spanningResources[0];
            const startDate = new Date(resource.datetime_started);
            const endDate = new Date(resource.datetime_ended);
            const spanDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
            const isSpanning = spanDays > 1;

            return (
                <div key={`${employId}-${day}`} className="grid-cell"
                     style={{gridColumn: isSpanning ? `span ${spanDays}` : 'span 1'}}
                     onClick={() => handleCellClick(employId, day)}>
                    {resourcesForDay.map((resource, index) => {
                        const resourceStartDate = new Date(resource.datetime_started);
                        const resourceEndDate = new Date(resource.datetime_ended);
                        const resourceSpanDays = (resourceEndDate - resourceStartDate) / (1000 * 60 * 60 * 24) + 1;
                        const resourceIsSpanning = resourceSpanDays > 1;

                        return (
                            <div
                                key={resource.id}
                                className={`resource ${resourceIsSpanning && index === 0 ? 'span' : ''}`}
                                style={{gridColumn: resourceIsSpanning ? `span ${resourceSpanDays}` : 'span 1'}}
                                onClick={(e) => handleResourceClick(e, resource)}
                            >
                                {resource.name}
                                <div className="tooltip">
                                    Start: {resource.datetime_started}<br/>
                                    End: {resource.datetime_ended}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return <div key={`${employId}-${day}`} className="grid-cell"
                        onClick={() => handleCellClick(employId, day)}></div>;
        }
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
                <div className="resourceTable"
                     style={{gridTemplateColumns: `auto repeat(${daysInMonth}, minmax(100px, 1fr))`}}>
                    <div className="grid-header">
                        <div className="grid-header-cell">Employee Name</div>
                        {daysArray.map(day => (
                            <div key={day} className={`grid-header-cell ${isWeekend(day) ? 'weekend' : ''}`}>
                                {day}
                                <br/>
                                {getDayName(day)}
                            </div>
                        ))}
                    </div>
                    <div className="grid-body">
                        {data.map(employ => (
                            <React.Fragment key={employ.id}>
                                <div className="employ">{employ.name}</div>
                                {daysArray.map(day => {
                                    const resourcesForDay = getResourceForDay(employ.id, day);
                                    if (resourcesForDay.length > 0) {
                                        return renderResources(resourcesForDay, employ.id, day);
                                    }
                                    return <div key={day} className={`grid-cell ${isWeekend(day) ? 'weekend' : ''}`}
                                                onClick={() => handleCellClick(employ.id, day)}></div>;
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}