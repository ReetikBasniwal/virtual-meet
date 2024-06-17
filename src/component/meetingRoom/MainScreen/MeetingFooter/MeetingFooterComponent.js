import { IoMdMic } from 'react-icons/io'
import './MeetingFooter.css'
import { BsCameraVideoFill, BsCameraVideoOffFill, BsFillMicMuteFill } from 'react-icons/bs'
import { TbScreenShare } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux';
import { roomActions } from '../../../../redux/reducers/actionreducer';
import { child, get, ref, update } from 'firebase/database';
import { db } from '../../../../server/firebase';
import { useParams } from 'react-router-dom';

export default function MeetingFooter() {
    // const participants = useSelector(state => state.roomReducer.participants);
    const user = useSelector(state => state.roomReducer.user);
    const mainStream = useSelector(state => state.roomReducer.mainStream);
    const userPrefernce = user?.[Object.keys(user)[0]];
    const { id } = useParams();
    const roomRef = ref(db, `rooms/${id}`);
    const preferenceRef = child(roomRef, `/participants/${Object.keys(user)[0]}/preference`);

    const dispatch = useDispatch();

    const togglePreference = (prop, value) => {
        if (mainStream) {
            let updatedStream = new MediaStream(mainStream.getTracks());

            if (prop === 'video') {
                if (value) {
                    navigator.mediaDevices.getUserMedia({ video: true }).then(newStream => {
                        const newVideoTrack = newStream.getVideoTracks()[0];
                        updatedStream.addTrack(newVideoTrack);
                        dispatch(roomActions.setMainStream(updatedStream));
                    }).catch(error => {
                        console.error("Error enabling video: ", error);
                    });
                } else {
                    updatedStream.getVideoTracks().forEach(track => {
                        track.stop();
                        updatedStream.removeTrack(track);
                    });

                    dispatch(roomActions.setMainStream(updatedStream));
                }
            } else if (prop === 'audio') {
                updatedStream.getAudioTracks().forEach(track => {
                    track.enabled = value;
                });
            }
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

    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className={`${userPrefernce.audio ? 'meetingIcons' : 'redMeetingIcons'}`} onClick={() => togglePreference("audio", !userPrefernce.audio)}>
                {userPrefernce.audio ? <IoMdMic /> : <BsFillMicMuteFill />}
            </div>
            <div className={`${userPrefernce.video ? 'meetingIcons' : 'redMeetingIcons'}`} onClick={() => togglePreference("video", !userPrefernce.video)}>
                {userPrefernce.video ? <BsCameraVideoFill /> : <BsCameraVideoOffFill />}
            </div>
            <div className={'meetingIcons'}>
                {userPrefernce.video ? <TbScreenShare /> : ""}
            </div>
        </div>
    )
}