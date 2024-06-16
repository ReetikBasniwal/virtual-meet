import { BsFillMicMuteFill } from 'react-icons/bs';
import { Card } from '../../../Shared/Card/CardComponent';
import './Participant.css';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IoMdMic } from 'react-icons/io';
import { db } from '../../../../server/firebase';
import { onValue, ref } from 'firebase/database';
import { useParams } from 'react-router-dom';

export const Participant = ({ participantData }) => {
    const videoRef = useRef();
    const remoteStream = new MediaStream();
    const userStream = useSelector(state => state.roomReducer.mainStream);
    const user = useSelector(state => state.roomReducer.user);
    
    const { id } = useParams();
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    // const roomRef = ref(db, `rooms/${id}`)
    const participantPreferenceRef = ref(db, `rooms/${id}/participants/${participantData.id}/preference`);

    useEffect(() => {
        // Listen for changes to the participant's preferences in the database
        if(participantData.currentUser) return;
        const unsubscribe = onValue(participantPreferenceRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.preference) {
                setAudioEnabled(data.preference.audio);
                setVideoEnabled(data.preference.video);
            }
        });

        return () => unsubscribe();
    }, [participantPreferenceRef]);

    useEffect(() => {
        if(participantData.peerConnection) {
            participantData.peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach(track => {
                    remoteStream.addTrack(track);
                    if (track.kind === 'video') {
                        setVideoEnabled(track.enabled);
                    } else if (track.kind === 'audio') {
                        setAudioEnabled(track.enabled);
                    }
                })
                videoRef.current.srcObject = remoteStream;
            }
        }
        // eslint-disable-next-line
    },[participantData.peerConnection])

    useEffect(() => {
        if(userStream && participantData.currentUser) {
            const preferences = user?.[Object.keys(user)[0]];
            userStream.getTracks().forEach(track => {
                if (track.kind === 'video') {
                    track.enabled = preferences.video;
                    setVideoEnabled(preferences.video);
                } else if (track.kind === 'audio') {
                    track.enabled = preferences.audio;
                    setAudioEnabled(preferences.audio);
                }
            });
            // setVideoEnabled(preferences.video);
            // setAudioEnabled(preferences.audio);
            videoRef.current.srcObject = userStream;
        }
    },[participantData.currentUser, userStream, user])
    
    return (
        <div className='participant'>
            <Card>
                <div className={`${audioEnabled ? 'muted' : 'red-muted'}`}>
                    {audioEnabled ? <IoMdMic /> : <BsFillMicMuteFill />}
                </div>
                <video ref={videoRef} className="video" autoPlay playsInline></video>
                {!videoEnabled && <div style={{backgroundColor: participantData.avatarColor }} 
                            className="avatar">{participantData.userName[0]}</div>
                }
                <div className="name">
                    {participantData.userName} {participantData.currentUser ? "(You)" : ""}
                </div>
            </Card>
        </div>
    )
}