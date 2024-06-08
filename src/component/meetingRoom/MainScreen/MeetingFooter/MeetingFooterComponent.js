import { IoMdMic } from 'react-icons/io'
import './MeetingFooter.css'
import { BsCameraVideoFill } from 'react-icons/bs'
import { TbScreenShare } from 'react-icons/tb'

export default function MeetingFooter() {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className='meetingIcons'>
                <IoMdMic />
            </div>
            <div className='meetingIcons'>
                <BsCameraVideoFill />
            </div>
            <div className='meetingIcons'>
                <TbScreenShare />
            </div>
        </div>
    )
}