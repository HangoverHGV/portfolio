import React, {useState} from "react";
import styles from "./styles/Card.module.css";

export default function CardWithTabs({data}) {
    const [activeTab, setActiveTab] = useState("workexperience");
    const [activeSubTab, setActiveSubTab] = useState(1);

    const renderContent = () => {
        switch (activeTab) {
            case "workexperience":
                return (
                    <>
                        <h1 className={styles.aboutmeTitle}>Work Experience</h1>
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
                                                <button
                                                    key={index}
                                                    className={activeSubTab === index + 1 ? styles.active : ""}
                                                    onClick={() => setActiveSubTab(index + 1)}
                                                >
                                                    {project.title}
                                                </button>
                                            ))}
                                        </div>
                                        <div className={styles.subTabContent}>
                                            <h3>{item.projects[activeSubTab - 1].title}</h3>
                                            <p>{item.projects[activeSubTab - 1].description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                );
            case "freelancing":
                return (
                    <>
                        <h1 className={styles.aboutmeTitle}>Freelancing</h1>
                        <div>
                            <h3 className={styles.subTitle}>{data.freelancing.startdate} - {data.freelancing.enddate}</h3>
                            <p className={styles.aboutmeContent}>{data.freelancing.description}</p>
                            <div className={styles.subTabContainer}>
                                <div className={styles.subTabButtonContainer}>
                                    {data.freelancing.projects.map((project, index) => (
                                        <button
                                            key={index}
                                            className={activeSubTab === index + 1 ? styles.active : ""}
                                            onClick={() => setActiveSubTab(index + 1)}
                                        >
                                            {project.title}
                                        </button>
                                    ))}
                                </div>
                                <div className={styles.subTabContent}>
                                    <h3>{data.freelancing.projects[activeSubTab - 1].title}</h3>
                                    <p>{data.freelancing.projects[activeSubTab - 1].description}</p>
                                    {data.freelancing.projects[activeSubTab - 1].image && (
                                        <img
                                            className={styles.reviewImg}
                                            src={`${data.freelancing.projects[activeSubTab - 1].image}`}
                                            alt="project"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                );
            case "personalprojects":
                return (
                    <>
                        <h1 className={styles.aboutmeTitle}>Personal Projects</h1>
                        <div>
                            <div className={styles.subTabButtonContainer}>
                                {data.personalprojects.map((project, index) => (
                                    <button
                                        key={index}
                                        className={activeSubTab === index + 1 ? styles.active : ""}
                                        onClick={() => setActiveSubTab(index + 1)}
                                    >
                                        {project.title}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.subTabContent}>
                                <h3>{data.personalprojects[activeSubTab - 1].title}</h3>
                                <p dangerouslySetInnerHTML={{__html: data.personalprojects[activeSubTab - 1].description}}></p>
                            </div>
                        </div>
                    </>
                );
            case "education":
                return (
                    <>
                        <h1 className={styles.aboutmeTitle}>Education</h1>
                        <div>
                            {data.education.map((item, index) => (
                                <div key={index} className={styles.container}>
                                    <h2 className={styles.title}>{item.title}</h2>
                                    <h3 className={styles.subTitle}>{item.startdate} - {item.enddate} in {item.location}</h3>
                                    <h3 className={styles.subTitle}>School: {item.school}</h3>
                                    <p className={styles.aboutmeContent}>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className={styles.tabContainer}>
                <button
                    className={activeTab === "workexperience" ? styles.active : ""}
                    onClick={() => setActiveTab("workexperience")}
                >
                    Work Experience
                </button>
                <button
                    className={activeTab === "freelancing" ? styles.active : ""}
                    onClick={() => setActiveTab("freelancing")}
                >
                    Freelancing
                </button>
                <button
                    className={activeTab === "personalprojects" ? styles.active : ""}
                    onClick={() => setActiveTab("personalprojects")}
                >
                    Personal Projects
                </button>
                <button
                    className={activeTab === "education" ? styles.active : ""}
                    onClick={() => setActiveTab("education")}
                >
                    Education
                </button>
            </div>
            <div className={styles.tabContent}>
                {renderContent()}
            </div>
        </>
    );
}