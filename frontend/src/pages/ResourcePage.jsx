import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import Navbar from "../components/NavBar";
import ResourceTable from "../components/ResourceTable";


export default function ResourcePage() {
    const {scheduleId} = useParams();

    return <>
        <Navbar/>
        <div className="container">
            <h1>Resource Page</h1>
            <ResourceTable scheduleId={scheduleId}/>
        </div>
    </>
}




