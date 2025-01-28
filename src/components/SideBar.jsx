import React, { Fragment } from "react";
import "../styles/Sidebar.css";
import { LuLink } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { RiHomeSmile2Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { IoAnalyticsOutline } from "react-icons/io5";
import { useSetRecoilState } from "recoil";
import { ANALYTICSEARCH, LINKSEARCH } from "../recoil/recoil";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const setLinkSearch = useSetRecoilState(LINKSEARCH);
  const setAnalyticSearch = useSetRecoilState(ANALYTICSEARCH);

  const NavItems = [
    { _id: 1, name: "Dashboard", link: "/", icon: RiHomeSmile2Line },
    { _id: 2, name: "Links", link: "/links", icon: LuLink },
    { _id: 3, name: "Analytics", link: "/analytics", icon: IoAnalyticsOutline },
    { _id: 4, name: "Settings", link: "/settings", icon: IoSettingsOutline },
  ];

  return (
    <nav className="side-nav">
      <div className="side-nav-items">
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
  );
}

export default SideBar;
