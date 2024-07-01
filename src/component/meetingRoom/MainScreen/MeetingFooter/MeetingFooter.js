import { IoMdMic } from 'react-icons/io'
import './MeetingFooter.css'
import { BsCameraVideoFill, BsCameraVideoOffFill, BsFillMicMuteFill } from 'react-icons/bs'
import { TbScreenShare, TbScreenShareOff } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux';
import { roomActions } from '../../../../redux/reducers/actionreducer';
import { child, get, ref, remove, update } from 'firebase/database';
import { db } from '../../../../server/firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { MdCallEnd } from 'react-icons/md';
import { getVideoAudioStream } from '../../../../utils/getStream';

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
                if(value){
                    reInitializeStream(true, userPrefernce.audio);
                }else {
                    mainStream.getVideoTracks().forEach((track) => {
                        if (track.kind === 'video') {
                            track.stop();
                        }
                    });
                }
            } else if (prop === 'audio') {
                mainStream.getAudioTracks()[0].enabled = value
            }else {
                value && toggleVideoTrack({video: false, audio: true});
                reInitializeStream(false, true, value ? 'userMedia' : 'displayStream');
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
        if (Object.keys(user)[0]) {
            const participantRef = child(roomRef, `/participants/${Object.keys(user)[0]}`);
            remove(participantRef).then(() => {
              console.log("Participant removed on end call");
              navigate('/');
            }).catch(error => {
              console.error("Error removing participant on end call: ", error);
            });
        }
        dispatch(roomActions.resetParticipant({}));
        navigate('/');
        dispatch(roomActions.setisRoomActive(true));
    }

    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className={`${userPrefernce.audio ? 'meetingIcons' : 'redMeetingIcons'}`} onClick={() => togglePreference("audio", !userPrefernce.audio)}>
                {userPrefernce.audio ? <IoMdMic /> : <BsFillMicMuteFill />}
            </div>
            <div className={`${userPrefernce.video ? 'meetingIcons' : 'redMeetingIcons'}`} onClick={() => togglePreference("video", !userPrefernce.video)}>
                {userPrefernce.video ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
            </div>
            <div className={`${userPrefernce.screen ? 'meetingIcons' : 'redMeetingIcons'}`} onClick={() => togglePreference("screen", !userPrefernce.screen)}>
                {userPrefernce.screen ? <TbScreenShare /> : <TbScreenShareOff />}
            </div>
            <div className='redMeetingIcons' onClick={hangupCall}>
                <MdCallEnd />   
            </div>
        </div>
    )
}