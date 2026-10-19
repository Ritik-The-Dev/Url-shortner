import "../styles/Navbar.css";
import UrlPopUp from "./UrlPopUp";
import { useSetRecoilState } from "recoil";
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

  const [say, setSay] = useState({ date: "", type: "" });
  const [newUrl, setNewUrl] = useState({
    remarks: "",
    destinationUrl: "",
    expirationDate: formatDateForInput(
      new Date(new Date().setDate(new Date().getDate() + 1))
    ),
    expirationEnabled: false,
  });

  const handleCreateNewLink = async () => {
    if (!newUrl.destinationUrl) {
      setUrlError(true);
      return;
    }
    setUrlError(false);
    const regex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\/.*)?$/i;
    if (newUrl.destinationUrl.includes("localhost"))
      return toast.error("Localhost URLs are not allowed.");
    if (!regex.test(newUrl.destinationUrl))
      return toast.error("Please enter a valid URL.");

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

      const shortLink = response?.createdLink?.shortLink;
      if (shortLink) {
        toast(
          (t) => (
            <span className="created-toast">
              <span className="created-toast-text">
                <strong>Created!</strong>{" "}
                <span className="created-toast-link">{shortLink}</span>
              </span>
              <button
                className="created-toast-btn"
                onClick={() => {
                  navigator.clipboard.writeText(shortLink);
                  toast.dismiss(t.id);
                  toast.success("Copied to clipboard!");
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

  const showSearch =
    location.pathname === "/links" || location.pathname === "/analytics";

  useEffect(() => {
    if (location.pathname === "/links") setLinkSearch(value);
    else if (location.pathname === "/analytics") setAnalyticSearch(value);
  }, [value]);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const hours = currentDate.getHours();
    const timeOfDay =
      hours >= 1 && hours < 12
        ? "morning"
        : hours < 17
        ? "afternoon"
        : "evening";
    setSay({ date: formattedDate, type: timeOfDay });
  }, []);

  useEffect(() => {
    setValue("");
  }, [location.pathname]);

  return (
    <>
      <nav className="nav">
        {/* Left: hamburger + greeting */}
        <div className="nav-left">
          <div className="menu-btn" onClick={() => setShowNav(true)}>
            <GiHamburgerMenu className="hamburger" />
          </div>
          {say.type === "evening" ? (
            <IoMoonSharp className="sayType-icon-moon" />
          ) : (
            <GiSunflower className="sayType-icon" />
          )}
          <div className="nav-greeting">
            <span className="gm-line">Good {say.type}!</span>
            <span className="date-info">{say.date}</span>
          </div>
        </div>

        {/* Right: search (only on links/analytics) + create button */}
        <div className="nav-right">
          {showSearch && (
            <div className="input-div-nav">
              <IoIosSearch className="input-search-icon" />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search by remarks…"
                className="search-input"
              />
            </div>
          )}
          <button
            type="button"
            className="create-new-btn"
            onClick={() => setShowAddLink(true)}
          >
            <IoMdAdd className="add-icon" />
            <span className="create-new-label">Create new</span>
          </button>
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
