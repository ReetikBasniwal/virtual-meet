import { BsFillMicMuteFill } from 'react-icons/bs';
import { Card } from '../../../Shared/Card/CardComponent';
import './Participant.css';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export const Participant = ({ participantData }) => {
    const videoRef = useRef();

    const remoteStream = new MediaStream();

    const userStream = useSelector(state => state.roomReducer.mainStream)

    useEffect(() => {
        if(participantData.peerConnection) {
            participantData.peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach(track => {
                    remoteStream.addTrack(track);
                })

                videoRef.current.srcObject = remoteStream;
            }
        }
    },[participantData.peerConnection])

    useEffect(() => {
        if(userStream && participantData.currentUser) {
            videoRef.current.srcObject = userStream;
        }
    },[participantData.currentUser, userStream])

    return (
        <div className='participant'>
            <Card>
                <video ref={videoRef} className="video" autoPlay playsInline></video>
                <div className='muted'><BsFillMicMuteFill /></div>
                <div style={{backgroundColor: participantData.avatarColor }} className="avatar">{participantData.userName[0]}</div>
                <div className="name">
                    {participantData.userName} {participantData.currentUser ? "(You)" : ""}
                </div>
            </Card>
        </div>
    )
}