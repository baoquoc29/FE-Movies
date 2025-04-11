import React from "react";
import "./CustomAlert.css";

const CustomAlert = ({ message, onClose }) => {
    return (
        <div className="alert-overlay">
            <div className="alert-box">
                <p style={{color: 'black'}}>{message}</p>
                <button onClick={onClose}>Đóng</button>
            </div>
        </div>
    );
};

export default CustomAlert;
