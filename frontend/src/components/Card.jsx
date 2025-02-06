import React from "react";
import styles from "./styles/Card.module.css";


export default function Card({data}) {
    return <div className={styles.aboutmeContainer}>
        <h1 className={styles.aboutmeTitle}>{data.title} </h1>
        <p className={styles.aboutmeContent}>{data.content}</p>
    </div>
}

