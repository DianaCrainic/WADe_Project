import React from "react";
import "./css/Calculation.css";

export default function Calculation(props: { description: string, value: string }) {
    return (
        <div className="calculation-container">
            <h4 className="calculation-title">{props.description}:</h4>
            <h4 className="calculation-value">{props.value}</h4>
        </div>
    );
}