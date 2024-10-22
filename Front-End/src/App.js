import './App.css';
import truckImage from './res/animated_truck.png';
import wheelGear from './res/wheel_gear.png';
import MainActivity from './MainActivity';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainActivity />} />
      </Routes>
    </BrowserRouter>
    // <div>
      
    //   <img src={truckImage} alt="logo" />
    //   <div className="center">
    //     <p>In progress...</p>
    //     <img src={wheelGear} className="rotating-image" alt="logo" />
    //   </div>
    //   <div className="center">
    //     <MainActivity/>
    //   </div> 
    // </div>
  );
}

export default App;
