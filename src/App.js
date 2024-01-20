import './App.css';
import Navbar from './component/navbar/Navbar';
import About from './component/about/About';
import RegisterForm from './component/Registeration Form/RegisterForm';
import Login from './component/LoginForm/Login';

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <RegisterForm /> */}
      {/* <Login /> */}
      <About />
    </div>
  );
}

export default App;
