import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './component/navbar/Navbar';
import About from './component/about/About';
import RegisterForm from './component/Registeration Form/RegisterForm';
import { Route, Routes } from "react-router-dom";
import Login from './component/LoginForm/Login';
import Room from './component/meetingRoom/Room';
import FourOFour from './pages/FourOFour';
import WentWrong from './pages/WentWrong';
import { useSelector } from 'react-redux';


function App() {

  const isActiveRoom = useSelector(state => state.roomReducer.isActiveRoom);

  return (
    <>
        <div className="App">
          {!isActiveRoom ? <Navbar /> : <></>}
          <Routes>
            <Route exact path='/sign-up' element={<RegisterForm />} />
            <Route exact path='/sign-in' element={<Login />} />
            <Route path='/' element={<About />} />
            <Route path='/roomId/:id' element={<Room />} />
            <Route path='/roomId/:id/noroom' element={<FourOFour />} />
            <Route path='/error/:name' element={<WentWrong />} />
          </Routes>
        </div>
    </>
  );
}

export default App;
