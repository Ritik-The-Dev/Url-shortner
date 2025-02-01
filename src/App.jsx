import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";
import React, { useEffect } from "react";
import Loader from "./components/Loader";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import SideBar from "./components/SideBar";
import Links from "./pages/Links";
import { useRecoilState } from "recoil";
import { useGetUserData } from "./api/hooks";
import { USERDATA } from "./recoil/recoil";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useRecoilState(USERDATA);
  const { getUserData, loading } = useGetUserData();

  const fetchData = async () => {
    const response = await getUserData();
    if (response && response?.success) {
      setUserData(response?.data);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token){
      navigate("/login")
    }
    else{
      if (!userData && (location.pathname !== "/login" && location.pathname !== "/register")) {
        fetchData();
      }
    }
  }, []);

  return (
    <div className="app">
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <SideBar />
      )}
      <div className="app-side">
        {location.pathname !== "/login" &&
          location.pathname !== "/register" && <Navbar />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/links" element={<Links />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
      {loading && <Loader text={"Setting Things Up for You..."} />}
    </div>
  );
}

export default App;
