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
    const remoteStream =  React.useMemo(() => new MediaStream(), []);
    const userStream = useSelector(state => state.roomReducer.mainStream);
    const user = useSelector(state => state.roomReducer.user);
    
    const { id } = useParams();
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const participantPreferenceRef = ref(db, `rooms/${id}/participants/${participantData.id}/preference`);

    useEffect(() => {
        // Listen for changes to the participant's preferences in the database
        const unsubscribe = onValue(participantPreferenceRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setAudioEnabled(data.audio);
                setVideoEnabled(data.video);
            }
        });

        return () => unsubscribe();
    }, [participantPreferenceRef]);

    useEffect(() => {
        if(participantData.peerConnection) {
            participantData.peerConnection.ontrack = (event) => {
                event.streams[0].getTracks().forEach(track => {
                    remoteStream.addTrack(track);
                
                    // Listen for the 'ended' event on each track
                    track.onended = () => {
                        remoteStream.removeTrack(track);
                        if (track.kind === 'video') {
                            setVideoEnabled(false);
                        }
                    };
                });
                if (videoRef.current.srcObject !== remoteStream) {
                    videoRef.current.srcObject = remoteStream;
                }
            };
        }

        // Clean up previous peerConnection's ontrack handler
        return () => {
            if (participantData.peerConnection) {
                participantData.peerConnection.ontrack = null;
            }
            remoteStream.getTracks().forEach(track => {
                track.onended = null;
                remoteStream.removeTrack(track);
            });
        };

    },[participantData.peerConnection, remoteStream])

    useEffect(() => {
        if (!videoEnabled && videoRef.current && videoRef.current.srcObject) {
            const videoTracks = videoRef.current.srcObject.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = false;
            });
        } else if (videoEnabled && videoRef.current && videoRef.current.srcObject) {
            const videoTracks = videoRef.current.srcObject.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = true;
            });
        }
    }, [videoEnabled]);

    useEffect(() => {
        if(userStream && participantData.currentUser) {
            videoRef.current.srcObject = userStream;
            videoRef.current.muted = true;
        }
    },[participantData.currentUser, userStream, user])
    
    return (
        <div className='participant'>
            <Card>
                <div className={`${audioEnabled ? 'muted bg-transparent' : 'red-muted'} mic-icon`}>
                    {audioEnabled ? <IoMdMic /> : <BsFillMicMuteFill />}
                </div>
                <video 
                    ref={videoRef} 
                    className={`video ${participantData.currentUser ? 'video-mirrored' : ''}`} 
                    autoPlay playsInline
                    style={{ display: videoEnabled ? 'block' : 'none' }}
                ></video>
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