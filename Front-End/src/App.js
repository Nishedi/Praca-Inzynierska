import './App.css';
import truckImage from './res/animated_truck.png';
import wheelGear from './res/wheel_gear.png';
import MainActivity from './MainActivity';
import ReactDOM from "react-dom/client";
import { GlobalProvider } from './GlobalContext'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from './MainPage/MainPage';
import Login from './Login/Login';
import Register from './Login/Register';
import SavedRoutes from './SavedRoutes/SavedRoutes';
import SavedRouteView from './SavedRoutes/SavedRouteView';
import YourProfile from './YourProfile/YourProfile';

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/savedroutes" element={<SavedRoutes />} />
          <Route path="/savedroute/:id" element={<SavedRouteView />} />
          <Route path="/yourprofile" element={<YourProfile />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
