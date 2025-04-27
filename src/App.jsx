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
import { useEffect, useState } from 'react';


function App() {

  const isActiveRoom = useSelector(state => state.roomReducer.isActiveRoom);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
        <div className="App bg-white dark:bg-gray-900 transition-colors duration-200">
          {!isActiveRoom ? <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} /> : <></>}
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
