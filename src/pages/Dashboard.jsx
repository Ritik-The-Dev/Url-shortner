import React, { useEffect } from "react";
import "../styles/Dashboard.css";
import { useGetDashboardData } from "../api/hooks";
import DashboardComp from "../components/DashboardComp";
import { useRecoilState } from "recoil";
import { DASHBOARDDATA } from "../recoil/recoil";
import Loader from "../components/Loader";

function Dashboard() {
  const [dashboardData, setDashboardData] = useRecoilState(DASHBOARDDATA);

  const { getDashboardData, loading } = useGetDashboardData();

  const CallDashboard = async () => {
    const response = await getDashboardData();
    if (response.success) {
      setDashboardData(response?.data);
    }
  };

  useEffect(() => {
    if (!dashboardData) {
      CallDashboard();
    }
  }, []);

  return (
    <div className="main-app">
      <div className="dashboard">
        <div className="dashboard-data">
          <span className="total-clicks-span">
            <span>Total Clicks</span>
            <span className="colored-total-clicks">
              {dashboardData?.totalClicks}
            </span>
          </span>
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
      {loading && <Loader text="Your dashboard is being loaded..." />}
    </div>
  );
}

export default Dashboard;
