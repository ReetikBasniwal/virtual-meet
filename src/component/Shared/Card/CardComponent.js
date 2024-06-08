import './Card.css';
import React from "react";

export const Card = (props) => {
    return (
        <div className='card shadow-md bg-clip-border rounded-xl'>
            {props.children}
        </div>
    )
}