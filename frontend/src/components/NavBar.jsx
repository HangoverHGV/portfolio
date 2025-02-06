import React from "react";
import {useState, useEffect} from "react";
import "./styles/NavBar.css";


export default function Navbar(){
      return (
    <nav className="navbar">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
}
