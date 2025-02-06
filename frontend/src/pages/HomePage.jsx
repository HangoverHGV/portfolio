import React, {useState, useEffect} from "react";
import Navbar from "../components/NavBar";
import Card from "../components/Card";
import data from "../data/data.json";
import CardWithTabs from "../components/CardWithTabs";

export default function HomePage() {


    return <div className="container">
        <Navbar/>
        <Card data={data.aboutme}/>
        <CardWithTabs data={data}/>
    </div>
}

