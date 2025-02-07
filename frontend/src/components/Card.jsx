import React from "react";
import styles from "./styles/Card.module.css";


export default function Card({data}) {
    if (Array.isArray(data)) {
        return (
            <div className={styles.aboutmeContainer}>
                <h1 className={styles.aboutmeTitle}>Skills</h1>
                <div className={styles.skillsGrid}>
                    {data.map((skill, index) => (
                        <div key={index} className={styles.skillItem}>{skill}</div>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.aboutmeContainer}>
                <h1 className={styles.aboutmeTitle}>{data.title}</h1>
                <p className={styles.aboutmeContent}>{data.description}</p>
            </div>
        );
    }
}

