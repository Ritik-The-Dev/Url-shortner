import "../styles/Navbar.css";
import Images from "../assets";
import UrlPopUp from "./UrlPopUp";
import { useRecoilState, useSetRecoilState } from "recoil";
import Loader from "../components/Loader";
import { IoMdAdd } from "react-icons/io";
import { ANALYTICSEARCH, LINKSDATA, LINKSEARCH, NAVOPEN, USERDATA } from "../recoil/recoil";
import { useCreateLink, useGetUserData } from "../api/hooks";
import { IoIosSearch } from "react-icons/io";
import { GiSunflower } from "react-icons/gi";
import { IoMoonSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import toast from "react-hot-toast";

const formatDateForInput = (date) => {
  const local = new Date(date);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().slice(0, 16);
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfoRef = useRef(null);
  const logoutDivRef = useRef(null);
  const setLinkSearch = useSetRecoilState(LINKSEARCH);
  const setAnalyticSearch = useSetRecoilState(ANALYTICSEARCH);
  const [value, setValue] = useState("");
  const setLinks = useSetRecoilState(LINKSDATA);
  const [UrlError, setUrlError] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const { createLink, loading } = useCreateLink();
  const setShowNav = useSetRecoilState(NAVOPEN);
  const [userInfo, setUserInfo] = useRecoilState(USERDATA);
  const { getUserData, loading:userDataLoading} = useGetUserData();

  const [say, setSay] = useState({
    date: "",
    type: "",
  });
  const [newUrl, setNewUrl] = useState({
    remarks: "",
    destinationUrl: "",
    expirationDate: formatDateForInput(
      new Date(new Date().setDate(new Date().getDate() + 1))
    ),
    expirationEnabled: false,
  });

  const handleCreateNewLink = async () => {
    if (!newUrl.destinationUrl || !newUrl.destinationUrl.length > 0) {
      setUrlError(true);
      return;
    }
    setUrlError(false);
    const regex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\/.*)?$/i;
    if (newUrl.destinationUrl.includes("localhost"))
      return toast.error("Localhost Url is not allowed.");
    if (!regex.test(newUrl.destinationUrl))
      return toast.error("Pls Enter a Valid Url.");
    const response = await createLink(newUrl);
    if (response.success) {
      setShowAddLink(false);
      setNewUrl({
        remarks: "",
        destinationUrl: "",
        expirationDate: formatDateForInput(
          new Date(new Date().setDate(new Date().getDate() + 1))
        ),
        expirationEnabled: false,
      });
      setLinks(response);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login");
  };

  const handleClickOutside = (event) => {
    if (
      userInfoRef.current &&
      !userInfoRef.current.contains(event.target) &&
      logoutDivRef.current &&
      !logoutDivRef.current.contains(event.target)
    ) {
      setShowLogout(false);
    }
  };

  useEffect(() => {
    if (location.pathname === "/links") {
      setLinkSearch(value);
    } else if (location.pathname === "/analytics") {
      setAnalyticSearch(value);
    } else {
      return;
    }
  }, [value]);

  useEffect(() => {
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const hours = currentDate.getHours();
    let timeOfDay = "";

    if (hours >= 1 && hours < 12) {
      timeOfDay = "morning";
    } else if (hours >= 12 && hours < 17) {
      timeOfDay = "afternoon";
    } else {
      timeOfDay = "evening";
    }

    setSay({
      date: formattedDate,
      type: timeOfDay,
    });
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

    const CallSettings = async () => {
      const response = await getUserData();
      if (response?.success) {
        setUserInfo(response?.data);
      }
    };
  
    useEffect(() => {
      if (!userInfo) {
        CallSettings();
      }
    }, []);

  return (
    <>
      <nav className="nav">
        <div className="right-nav">
          <div className="right-nav-1">
          <div className="menu-btn">
            <GiHamburgerMenu className="hamburger" onClick={()=>setShowNav(true)}/>
          </div>
            {say.type === "evening" ? (
              <IoMoonSharp className="sayType-icon-moon" />
            ) : (
              <GiSunflower className="sayType-icon" />
            )}
            <div className="right-nav-1-tag">
              <span className="gm-text">
                Good {say.type}, {userInfo?.username}
              </span>
              <span className="date-info">{say.date}</span>
            </div>
          </div>
          <div className="right-nav-2">
            <button
              className="create-new-btn"
              onClick={() => setShowAddLink(true)}
            >
              <IoMdAdd className="add-icon" />
              Create new
            </button>
            <button
              className="create-new-btn small-create-new-btn"
              onClick={() => setShowAddLink(true)}
            >
              <IoMdAdd className="add-icon" />
            </button>
            <div className="input-div-nav">
              <IoIosSearch className="input-search-icon" />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search by remarks"
                className="search-input"
              />
            </div>
            <div
              className="userinfo-icon"
              ref={userInfoRef}
              onClick={() => setShowLogout(!showLogout)}
            >
              {userInfo &&
                userInfo?.username
                  ?.split(" ")
                  ?.slice(0, 2)
                  ?.map((word, index) => (
                    <span key={index}>
                      {word.length && word[0]?.toUpperCase()}
                    </span>
                  ))}
            </div>
            {showLogout && (
              <button
                onClick={handleLogout}
                className="logout-div"
                ref={logoutDivRef}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      {showAddLink && (
        <UrlPopUp
          value={newUrl}
          Urlerror={UrlError}
          setValue={setNewUrl}
          handleSubmit={handleCreateNewLink}
          close={() => setShowAddLink(false)}
          name="New Link"
          buttonName="Create new"
        />
      )}
      {loading && <Loader text="Your new shortened URL is being created..." />}
      {userDataLoading && <Loader text="Getting your Info..." />}
    </>
  );
}

export default Navbar;
