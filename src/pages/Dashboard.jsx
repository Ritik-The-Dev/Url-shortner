import React, { useEffect, useRef } from "react";
import "../styles/Dashboard.css";
import { useGetDashboardData } from "../api/hooks";
import DashboardComp from "../components/DashboardComp";
import { useRecoilState } from "recoil";
import { DASHBOARDDATA } from "../recoil/recoil";
import Loader from "../components/Loader";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Dashboard() {
  const [dashboardData, setDashboardData] = useRecoilState(DASHBOARDDATA);
  const dashRef = useRef(null);
  const clicksRef = useRef(null);
  const linksRef = useRef(null);

  const { getDashboardData, loading } = useGetDashboardData();

  const CallDashboard = async () => {
    const response = await getDashboardData();
    if (response.success) {
      setDashboardData(response?.data);
    }
  };

  useEffect(() => {
    CallDashboard();
  }, []);

  useGSAP(
    () => {
      gsap.from(".dash-stat-card", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.65,
        ease: "power3.out",
      });
      gsap.from(".dashboard-Comp", {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out",
      });
    },
    { scope: dashRef }
  );

  useEffect(() => {
    const clicks = dashboardData?.totalClicks || 0;
    const links = dashboardData?.totalLinks || 0;

    if (clicksRef.current) {
      gsap.fromTo(
        clicksRef.current,
        { innerText: 0 },
        {
          innerText: clicks,
          duration: 1.2,
          snap: { innerText: 1 },
          ease: "power2.out",
        }
      );
    }
    if (linksRef.current) {
      gsap.fromTo(
        linksRef.current,
        { innerText: 0 },
        {
          innerText: links,
          duration: 1.2,
          snap: { innerText: 1 },
          ease: "power2.out",
          delay: 0.1,
        }
      );
    }
  }, [dashboardData?.totalClicks, dashboardData?.totalLinks]);

  return (
    <div className="main-app" ref={dashRef}>
      <div className="dashboard">
        <div className="dashboard-data">
          <div className="dashboard-stats">
            <span className="total-clicks-span dash-stat-card">
              <span>Total Clicks</span>
              <span className="colored-total-clicks" ref={clicksRef}>
                {dashboardData?.totalClicks || 0}
              </span>
            </span>
            <span className="total-clicks-span dash-stat-card">
              <span>Total Links</span>
              <span className="colored-total-clicks" ref={linksRef}>
                {dashboardData?.totalLinks || 0}
              </span>
            </span>
          </div>
          <div className="dashboard-detailed-data">
            <DashboardComp
              name="Date-wise Clicks"
              totalClicks={dashboardData?.totalClicks}
              data={dashboardData?.dateWiseClicks}
            />
            <DashboardComp
              name="Click Devices"
              totalClicks={dashboardData?.totalClicks}
              data={dashboardData?.clickedDevices}
            />
          </div>
        </div>
      </div>
      {loading && <Loader text="Loading dashboard statistics..." />}
    </div>
  );
}

export default Dashboard;
