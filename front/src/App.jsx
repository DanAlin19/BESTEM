import { useState } from 'react'
import Login from "./components/Login/Login"
import Register from "./components/Register/Register"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar/NavBar";
import Hero from "./components/Hero/Hero";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {

  return (
    <>
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Hero/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </BrowserRouter>
    </>
  );
}

export default App
