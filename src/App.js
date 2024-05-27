import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './component/navbar/Navbar';
import About from './component/about/About';
import RegisterForm from './component/Registeration Form/RegisterForm';
import { Route, Routes } from "react-router-dom";
import Login from './component/LoginForm/Login';
// import { AuthContext } from './server/AuthContext';
// import { useContext, useEffect } from 'react';
import Room from './component/meetingRoom/Room';
import FourOFour from './pages/FourOFour';
import WentWrong from './pages/WentWrong';
// import { ToastContainer, toast } from 'react-toastify';


function App() {

  return (
    <>
        <div className="App">
          <Navbar />
          <Routes>
            <Route exact path='/v-meet/sign-up' element={<RegisterForm />} />
            <Route exact path='/v-meet/sign-in' element={<Login />} />
            <Route path='/' element={<About />} />
            <Route path='/v-meet/roomId/:id' element={<Room />} />
            <Route path='/v-meet/roomId/:id/noroom' element={<FourOFour />} />
            <Route path='/v-meet/error/:name' element={<WentWrong />} />
          </Routes>
        </div>
    </>
  );
}

export default App;
