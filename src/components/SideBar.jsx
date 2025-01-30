import React, { Fragment, useState } from "react";
import "../styles/Sidebar.css";
import { LuLink } from "react-icons/lu";
import Images from "../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { RiHomeSmile2Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { IoAnalyticsOutline } from "react-icons/io5";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ANALYTICSEARCH, LINKSEARCH, NAVOPEN } from "../recoil/recoil";
import { MdClose } from "react-icons/md";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const setLinkSearch = useSetRecoilState(LINKSEARCH);
  const setAnalyticSearch = useSetRecoilState(ANALYTICSEARCH);
  const [rotated, setRotated] = useState(false);
  const [showNav, setShowNav] = useRecoilState(NAVOPEN);

  const NavItems = [
    { _id: 1, name: "Dashboard", link: "/", icon: RiHomeSmile2Line },
    { _id: 2, name: "Links", link: "/links", icon: LuLink },
    { _id: 3, name: "Analytics", link: "/analytics", icon: IoAnalyticsOutline },
    { _id: 4, name: "Settings", link: "/settings", icon: IoSettingsOutline },
  ];

  const closeNav = () => {
    setRotated(!rotated);
  };

  return (
    showNav && (
      <nav className="side-nav">
        <div className="side-nav-items">
          <div className="close-nav">
            <MdClose
              onClick={closeNav}
              className="close-nav-icon"
              style={{
                transform: rotated ? "rotate(180deg)" : "none",
                transition: "transform 0.3s ease"
              }}
            />
          </div>
          <img
            src={Images.logo}
            alt="logo"
            className="sidebar-logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
          {NavItems &&
            NavItems?.map((e, index) => (
              <Fragment key={e._id}>
                {index === NavItems.length - 1 && (
                  <span className="last-side-nav-links"></span>
                )}
                <div
                  className={`side-nav-links ${
                    location.pathname == e.link ? "side-nav-links-active" : ""
                  }`}
                  onClick={() => {
                    setLinkSearch("");
                    setAnalyticSearch("");
                    navigate(e.link);
                  }}
                >
                  <e.icon />
                  <span>{e.name}</span>
                </div>
              </Fragment>
            ))}
        </div>
      </nav>
    )
  );
}

export default SideBar;
