import "../styles/Navbar.css";
import Images from "../assets";
import UrlPopUp from "./UrlPopUp";
import {  useSetRecoilState } from "recoil";
import Loader from "../components/Loader";
import { IoMdAdd } from "react-icons/io";
import { ANALYTICSEARCH, LINKSDATA, LINKSEARCH, NAVOPEN } from "../recoil/recoil";
import { useCreateLink } from "../api/hooks";
import { IoIosSearch } from "react-icons/io";
import { GiSunflower } from "react-icons/gi";
import { IoMoonSharp } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import toast from "react-hot-toast";

const formatDateForInput = (date) => {
  const local = new Date(date);
  local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
  return local.toISOString().slice(0, 16);
};

function Navbar() {
  const location = useLocation();
  const setLinkSearch = useSetRecoilState(LINKSEARCH);
  const setAnalyticSearch = useSetRecoilState(ANALYTICSEARCH);
  const [value, setValue] = useState("");
  const setLinks = useSetRecoilState(LINKSDATA);
  const [UrlError, setUrlError] = useState(false);
  const [showAddLink, setShowAddLink] = useState(false);
  const { createLink, loading } = useCreateLink();
  const setShowNav = useSetRecoilState(NAVOPEN);

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

      // Show the short URL with a copy action
      const shortLink = response?.createdLink?.shortLink;
      if (shortLink) {
        toast(
          (t) => (
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px" }}>
                <strong>Created!</strong>{" "}
                <span style={{ color: "#1B48DA", wordBreak: "break-all" }}>
                  {shortLink}
                </span>
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shortLink);
                  toast.dismiss(t.id);
                  toast.success("Copied to clipboard!");
                }}
                style={{
                  background: "#1B48DA",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "5px 12px",
                  fontSize: "12px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Copy
              </button>
            </span>
          ),
          { duration: 6000 }
        );
      }
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

  useEffect(()=>{
    setValue("")
  },[location.pathname])
    
  const isHome = location.pathname === "/";
  const showSearch =
    location.pathname === "/links" || location.pathname === "/analytics";

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/links": "Links",
    "/analytics": "Analytics",
  };
  const pageTitle = pageTitles[location.pathname];

  return (
    <>
      <nav
        className={[
          "nav",
          isHome && "nav--home",
          showSearch && "nav--toolbar",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="right-nav">
          <div className="nav-row-main">
            <div className="right-nav-1">
              <div className="menu-btn">
                <GiHamburgerMenu
                  className="hamburger"
                  onClick={() => setShowNav(true)}
                />
              </div>
              {say.type === "evening" ? (
                <IoMoonSharp className="sayType-icon-moon" />
              ) : (
                <GiSunflower className="sayType-icon" />
              )}
              <div className="right-nav-1-tag">
                <span className="gm-text">
                  <span className="gm-line">Good {say.type}!</span>
                  {isHome ? (
                    <span className="gm-sub">URL Shortener</span>
                  ) : (
                    pageTitle && (
                      <span className="gm-sub">{pageTitle}</span>
                    )
                  )}
                </span>
                <span className="date-info">{say.date}</span>
              </div>
            </div>
            <div className="nav-quick-actions">
              <button
                type="button"
                className="create-new-btn"
                onClick={() => setShowAddLink(true)}
              >
                <IoMdAdd className="add-icon" />
                <span className="create-new-label">Create new</span>
              </button>
              <button
                type="button"
                className="create-new-btn small-create-new-btn"
                onClick={() => setShowAddLink(true)}
                aria-label="Create new link"
              >
                <IoMdAdd className="add-icon" />
              </button>
            </div>
          </div>
          {showSearch && (
            <div className="nav-row-search">
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
            </div>
          )}
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
      {loading && <Loader text="Creating your shortened URL..." />}
    </>
  );
}

export default Navbar;
