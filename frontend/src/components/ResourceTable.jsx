import React, {useState, useEffect} from "react";

export default function ResourceTable({data}) {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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

    return (
        <div>
            <div>
                <button onClick={() => handleMonthChange("prev")}>Previous Month</button>
                <span>{new Date(currentYear, currentMonth).toLocaleString('default', {month: 'long'})} {currentYear}</span>
                <button onClick={() => handleMonthChange("next")}>Next Month</button>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Employee Name</th>
                    {daysArray.map(day => (
                        <th key={day}>{day}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map(employ => (
                    <tr key={employ.id}>
                        <td>{employ.name}</td>
                        {daysArray.map(day => (
                            <td key={day}>
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
    );
}