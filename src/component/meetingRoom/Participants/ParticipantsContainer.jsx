import { useSelector } from 'react-redux';
import { Participant } from './EachParticipant/Participant';
import './ParticipantsContainer.css';
import React from 'react';

export const ParticipantComponent = () => {
    const participants = useSelector(state => state.roomReducer.participants);
    const participantsKeys = Object.keys(participants);
    const gridSize = participantsKeys.legnth === 1 ? 1 : participantsKeys.length <= 4 ? 2 : 4;
    const colSize = participantsKeys.length <= 4 ? 1 : 2;
    const rowSize = participantsKeys.length <= 4 ?  participantsKeys.length:  Math.ceil(participantsKeys.length/2);
    
    return (
        <div style={{
                '--grid-size': gridSize,
                '--grid-col-size': colSize,
                '--grid-row-size': rowSize
            }}
            className='participantContainer'>
            {participantsKeys.map((participantKey) => {
                const currentParticipant = participants[participantKey];
                return <Participant participantData={{...currentParticipant, id: participantKey}} key={participantKey} />
            })}
        </div>
    )
}