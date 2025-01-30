import React, { useEffect, useMemo, useState } from "react";
import "../styles/Analytics.css";
import Pagination from "../components/Pagination";
import { RxCaretSort } from "react-icons/rx";
import { useRecoilState, useRecoilValue } from "recoil";
import { ANALYTICPAGE, ANALYTICSDATA, ANALYTICSEARCH } from "../recoil/recoil";
import { useGetAnalytics } from "../api/hooks";
import { debounce } from "lodash";

function Analytics() {
  const [analyticsData, setAnalyticsData] = useRecoilState(ANALYTICSDATA);
  const search = useRecoilValue(ANALYTICSEARCH);
  const [currentPage, setCurrentPage] = useRecoilState(ANALYTICPAGE);
  const { getAnalytics, loading } = useGetAnalytics();

  const CallAnalytics = async () => {
    const response = await getAnalytics({
      remarks: search,
      page: currentPage,
      limit: 10,
    });
    if (response?.success) {
      setAnalyticsData(response);
      if (response?.count <= (currentPage - 1) * 10) {
        setCurrentPage(1);
      }      
    }
  };

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const FormatDate = (timestamp) => {
    const date = new Date(timestamp);

    const formattedDate = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });

    return formattedDate;
  };

  const debouncedCallAnalytics = useMemo(
    () => debounce(CallAnalytics, 500),
    [CallAnalytics]
  );

  useEffect(() => {
    if (!analyticsData) {
      CallAnalytics();
    }
  }, []);

  useEffect(() => {
    debouncedCallAnalytics();
    return () => {
      debouncedCallAnalytics.cancel();
    };
  }, [currentPage, search]);

  return (
    <div className="main-app">
      <div className="link-page">
        <div className="custom-table-container">
          {loading ? (
            <table
              className="custom-table"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <thead
                style={{
                  width: "100%",
                }}
              >
                <tr>
                  <th className="sortable">
                    Timestamp
                    <RxCaretSort className="sort-icon" />
                  </th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>ip address</th>
                  <th>User Device</th>
                </tr>
              </thead>
              <div className="inner-loader">
                <div className="loader-container">
                  <svg
                    className="loader-spinner"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="loader-circle"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="loader-path"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span className="loader-text" style={{ color: "black" }}>
                    {"Fetching Analytics Please Wait..."}
                  </span>
                </div>
              </div>
            </table>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="sortable">
                    Timestamp
                    <RxCaretSort className="sort-icon" />
                  </th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>ip address</th>
                  <th>User Device</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData?.data?.length ? (
                  analyticsData?.data?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="border-right min-w-176">{FormatDate(row.date)}</td>
                      <td className="border-right text-wrap">
                        {truncateText(row.destinationUrl)}
                      </td>
                      <td className="border-right text-wrap">
                        {truncateText(row.shortLink)}
                      </td>
                      <td className="border-right">{row.ipAddress}</td>
                      <td className="border-right min-w-128">{row.userDevice}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border-right">No Data Found</td>
                    <td className="border-right text-wrap">No Data Found</td>
                    <td className="border-right text-wrap">No Data Found</td>
                    <td className="border-right">No Data Found</td>
                    <td className="border-right">No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <Pagination
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          count={analyticsData?.count}
        />
      </div>
    </div>
  );
}

export default Analytics;
