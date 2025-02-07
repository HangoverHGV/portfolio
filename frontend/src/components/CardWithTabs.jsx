import React, {useState, useEffect} from "react";
import styles from "./styles/Card.module.css";



export default function CardWithTabs({data}) {
    const [activeTab, setActiveTab] = useState("workexperience");
    const [activeSubTab, setActiveSubTab] = useState(1);

    const renderContent = () => {
        switch (activeTab) {
            case "workexperience":
                return <>
                    <h1 className={styles.aboutmeTitle}>Work Experience </h1>
                    <div>
                        {data.workexperience.map((item, index) => (
                            <div key={index} className={styles.container}>
                                <h2 className={styles.title}>{item.title}</h2>
                                <h3 className={styles.subTitle}>{item.startdate} - {item.enddate} in {item.location}</h3>
                                <h3 className={styles.subTitle}>Company: {item.company}</h3>
                                <p className={styles.aboutmeContent}>{item.description}</p>
                                <div className={styles.subTabContainer}>
                                    <div className={styles.subTabButtonContainer}>
                                    {item.projects.map((project, index) => (
                                        <button key={index}
                                                onClick={() => setActiveSubTab(index + 1)}>{project.title}</button>
                                    ))}
                                        </div>
                                    <div className={styles.subTabContent}>
                                        <h3>{item.projects[activeSubTab - 1].title}</h3>
                                        <p>{item.projects[activeSubTab - 1].description}</p>
                                    </div>
                                </div>
                                <div className={styles.subTabContainer}>
                                    {item.skills.map((skill, index) => (
                                        <div key={index} className={styles.skillContainer}>
                                            <h4>{skill}</h4>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
        }
    }

    return (<>
        <div className={styles.tabContainer}>
            <button onClick={() => setActiveTab("workexperience")}>Work Experience</button>
            <button onClick={() => setActiveTab("freelancing")}>Freelancing</button>
            <button onClick={() => setActiveTab("personalprojects")}>Personal Projects</button>
            <button onClick={() => setActiveTab("education")}>Education</button>
        </div>
        <div className={styles.tabContent}>
            {renderContent()}
        </div>
    </>)

}


