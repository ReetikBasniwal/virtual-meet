import { BsFillMicMuteFill } from 'react-icons/bs';
import { Card } from '../../../Shared/Card/CardComponent';
import './Participant.css';
import React from 'react';

export const Participant = ({ participantData }) => {
    console.log(participantData, "data");
    return (
        <div className='participant'>
            <Card>
                <video className="video" autoPlay playsInline></video>
                <div className='muted'><BsFillMicMuteFill /></div>
                <div style={{backgroundColor: participantData.avatarColor }} className="avatar">{participantData.userName[0]}</div>
                <div className="name">
                    {participantData.userName} {participantData.currentUser ? "(You)" : ""}
                </div>
            </Card>
        </div>
    )
}