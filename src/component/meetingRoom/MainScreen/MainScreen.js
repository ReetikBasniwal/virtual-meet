import { ParticipantComponent } from '../Participants/ParticipantsContainer';
import './MainScreen.css'
import MeetingFooter from "./MeetingFooter/MeetingFooter";

export default function MainScreen(){

    return (
        <div className="main-screen-wrapper">
            <div className="mainScreen">
                <ParticipantComponent />
            </div>
            <div className="footer">
                <MeetingFooter />
            </div>
        </div>
    )
}