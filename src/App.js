import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './component/navbar/Navbar';
import About from './component/about/About';
import RegisterForm from './component/Registeration Form/RegisterForm';
import { Route, Routes } from "react-router-dom";
import Login from './component/LoginForm/Login';
import { AuthContext } from './server/AuthContext';
import { useContext, useEffect } from 'react';
import Room from './component/meetingRoom/Room';
// import { ToastContainer, toast } from 'react-toastify';


function App() {

  const { currentUser } = useContext(AuthContext);
  // const navigate = useNavigate();
  // let location = useLocation();
  // const urlParams = new URLSearchParams(window.location.search);
  // let roomId = urlParams.get("id");

  // const notify = () => toast("Wow so easy!");

  useEffect(() => {

  },[])

  return (
    <>
        <div className="App">
          <Navbar />
          <Routes>
            <Route exact path='/v-meet/sign-up' element={<RegisterForm />} />
            <Route exact path='/v-meet/sign-in' element={<Login />} />
            <Route path='/' element={<About />} />
            <Route path='/v-meet/roomId/:id' element={<Room user={currentUser}/>} />
          </Routes>
        </div>
    </>
  );
}

export default App;
