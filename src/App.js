import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './component/navbar/Navbar';
import About from './component/about/About';
import RegisterForm from './component/Registeration Form/RegisterForm';
import { Route, Routes } from "react-router-dom";
import Login from './component/LoginForm/Login';
// import { AuthContext } from './server/AuthContext';
// import { useContext, useEffect } from 'react';
// import { ToastContainer, toast } from 'react-toastify';


function App() {

  // const { currentUser } = useContext(AuthContext);

  // const notify = () => toast("Wow so easy!");

  // useEffect(() => {
  // },[])

  return (
    <>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/v-meet/sign-up' element={<RegisterForm />} />
          <Route path='/v-meet/sign-in' element={<Login />} />
        </Routes>
        <About />
      </div>
    </>
  );
}

export default App;
