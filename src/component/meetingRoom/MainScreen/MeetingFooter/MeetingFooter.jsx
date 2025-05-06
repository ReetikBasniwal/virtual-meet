import { IoMdMic } from 'react-icons/io'
import './MeetingFooter.css'
import { BsCameraVideoFill, BsCameraVideoOffFill, BsFillMicMuteFill } from 'react-icons/bs'
import { TbScreenShare, TbScreenShareOff } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux';
import { roomActions } from '../../../../redux/reducers/actionreducer';
import { child, get, ref, remove, update } from 'firebase/database';
import { db } from '../../../../server/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { MdCallEnd, MdOutlinePeopleAlt } from 'react-icons/md';
import { getVideoAudioStream } from '../../../../utils/getStream';
import { useEffect, useState } from 'react';

export default function MeetingFooter() {
    const participants = useSelector(state => state.roomReducer.participants);
    const user = useSelector(state => state.roomReducer.user);
    const mainStream = useSelector(state => state.roomReducer.mainStream);
    const userPrefernce = user?.[Object.keys(user)[0]];
    const { id } = useParams();
    const roomRef = ref(db, `rooms/${id}`);
    const preferenceRef = child(roomRef, `/participants/${Object.keys(user)[0]}/preference`);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const togglePreference = async (prop, value) => {
        if (mainStream) {
            if (prop === 'video') {
                mainStream.getVideoTracks().forEach((track) => {
                    if (track.kind === 'video') {
                        track.enabled = value;
                    }
                });
            } else if (prop === 'audio') {
                mainStream.getAudioTracks()[0].enabled = value
            } else {
                value && toggleVideoTrack({video: false, audio: true});
                reInitializeStream(value ? false: true, true, value ? 'displayStream' : 'userMedia');
            }
            dispatch(roomActions.setMainStream(mainStream));
        }

        dispatch(roomActions.setUser({
            [Object.keys(user)[0]]: {
                ...user[Object.keys(user)[0]],
                [prop]: value
            }
        }))

        get(preferenceRef).then((snapshot) => {
            if (snapshot.exists()) {
              let newPreference = {
                ...snapshot.val(),
                [prop]: value
              }
              update(preferenceRef, newPreference);
            } else {
              console.log("No preference available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    const reInitializeStream = (video, audio, type='userMedia') => {
        const media = type === 'userMedia' ? getVideoAudioStream(video, audio) : 
            navigator.mediaDevices.getDisplayMedia();
        return new Promise((resolve) => {
            media.then((stream) => {
                if (type === 'displayMedia') {
                    toggleVideoTrack({audio, video});
                }
                dispatch(roomActions.setMainStream(stream));
                replaceStream(stream, participants);
                resolve(true);
            });
        });
    }

    const toggleVideoTrack = (status) => {
        if (mainStream && !status.video) 
            mainStream?.getVideoTracks().forEach((track) => {
                if (track.kind === 'video') {
                    !status.video && track.stop();
                }
            });
        else if (mainStream) {
            reInitializeStream(status.video, status.audio);
        }
    }

    const replaceStream = (mediaStream, participants) => {
        if(!participants || !mediaStream) return;
        Object.values(participants).forEach((peer) => {
            peer.peerConnection?.getSenders().forEach((sender) => {
                if(sender.track.kind === "audio") {
                    if(mediaStream.getAudioTracks().length > 0){
                        sender.replaceTrack(mediaStream.getAudioTracks()[0]);
                    }
                }
                if(sender.track.kind === "video") {
                    if(mediaStream.getVideoTracks().length > 0){
                        sender.replaceTrack(mediaStream.getVideoTracks()[0]);
                    }
                }
            });
        })
    }

    const hangupCall = () => {
        // Stop all tracks in the main stream
        if (mainStream) {
            mainStream.getTracks().forEach(track => {
                track.stop();
            });
        }

        // Close all peer connections and stop their tracks
        Object.values(participants).forEach(participant => {
            if (participant.peerConnection) {
                // Stop all tracks in the peer connection
                participant.peerConnection.getSenders().forEach(sender => {
                    if (sender.track) {
                        sender.track.stop();
                    }
                });
                // Close the peer connection
                participant.peerConnection.close();
            }
        });

        // Remove participant from Firebase
        if (Object.keys(user)[0]) {
            const participantRef = child(roomRef, `/participants/${Object.keys(user)[0]}`);
            remove(participantRef).then(() => {
                console.log("Participant removed on end call");
                // navigate('/');
            }).catch(error => {
                console.error("Error removing participant on end call: ", error);
            });
        }

        // Reset Redux state
        dispatch(roomActions.resetParticipant({}));
        dispatch(roomActions.setMainStream(null));
        dispatch(roomActions.setisRoomActive(false));
        navigate('/');
    }
    
    return (
        <div className="h-full w-full flex items-center justify-between box-border pl-4 pr-4">
            <div className="timeandid hidden md:flex items-center gap-2">
                <CurrentTime className="" /> <div role="separator" className="divider border-l border-black dark:border-white"></div> <span>{id}</span>
            </div>
            <div className="controls flex items-center w-100 gap-1">
                <div className={`${userPrefernce.audio ? 'meetingIcons bg-gray-700/90' : 'redMeetingIcons'}`} onClick={() => togglePreference("audio", !userPrefernce.audio)}>
                    {userPrefernce.audio ? <IoMdMic size={20} /> : <BsFillMicMuteFill size={20} />}
                </div>
                <div className={`${userPrefernce.video ? 'meetingIcons bg-gray-700/90' : 'redMeetingIcons'}`} onClick={() => togglePreference("video", !userPrefernce.video)}>
                    {userPrefernce.video ? <BsCameraVideoFill size={20} /> : <BsCameraVideoOffFill size={20} />}
                </div>
                <div className={`${userPrefernce.screen ? 'meetingIcons bg-gray-700/90' : 'redMeetingIcons'}`} onClick={() => togglePreference("screen", !userPrefernce.screen)}>
                    {userPrefernce.screen ? <TbScreenShare size={20} /> : <TbScreenShareOff size={20} />}
                </div>
                <div className='redMeetingIcons' onClick={hangupCall}>
                    <MdCallEnd />   
                </div>
            </div>
            <div className="particount relative w-9 h-11 flex items-end justify-start">
                <div className="absolute top-0 right-0 rounded-full w-5 h-5 flex items-center justify-center bg-gray-600">
                    <span className="text-white text-xs">{Object.keys(participants).length}</span>
                </div>
                <MdOutlinePeopleAlt size={23} />
            </div>
        </div>
    )
}


const CurrentTime = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });
            setTime(formattedTime);
          };
      
          updateTime(); // initial call
          const intervalId = setInterval(updateTime, 1000); // update every second
      
          return () => clearInterval(intervalId); // cleanup on unmount
    }, []);

    return (
        <span>{time}</span>
    )
}