import './MainScreen.css'
import MeetingFooter from "./MeetingFooter/MeetingFooterComponent";

export default function MainScreen(){

    return (
        <div className="main-screen-wrapper">
            <div className="mainScreen"></div>
            <div className="footer">
                <MeetingFooter />
            </div>
        </div>
    )
}