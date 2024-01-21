import './App.css';
import Navbar from './component/navbar/Navbar';
import About from './component/about/About';
import RegisterForm from './component/Registeration Form/RegisterForm';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from './component/LoginForm/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/v-meet/sign-up' element={<RegisterForm />} />
          <Route path='/v-meet/sign-in' element={<Login />} />
        </Routes>
        <About />
      </div>
    </Router>
    
  );
}

export default App;
