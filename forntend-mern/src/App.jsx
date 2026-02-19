import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
import VerifyOtp from "./page/VerifyOtp";
import Verify from "./page/Verify";
import Deshboard from "./page/Deshboard";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/deshboard" element={<Deshboard />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
