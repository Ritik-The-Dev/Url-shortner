import React, { useEffect, useMemo } from "react";
import "../styles/Table.css";
import { IoCopyOutline } from "react-icons/io5";
import { LuExternalLink } from "react-icons/lu";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import { ANALYTICPAGE, ANALYTICSDATA, ANALYTICSEARCH } from "../recoil/recoil";
import { useGetAnalytics } from "../api/hooks";
import { debounce } from "lodash";

const fmtDate = (ts) =>
  new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Copied!"))
    .catch(() => toast.error("Copy failed"));
};

/* ── device badge colour mapping ─────────────────────────── */
const deviceClass = (device = "") => {
  const d = device.toLowerCase();
  if (d.includes("android") || d.includes("iphone") || d.includes("mobile"))
    return "device-mobile";
  if (d.includes("ipad") || d.includes("tablet")) return "device-tablet";
  return "device-desktop";
};

function Analytics() {
  const [analyticsData, setAnalyticsData] = useRecoilState(ANALYTICSDATA);
  const search = useRecoilValue(ANALYTICSEARCH);
  const [currentPage, setCurrentPage] = useRecoilState(ANALYTICPAGE);
  const { getAnalytics, loading } = useGetAnalytics();

  const callAnalytics = async () => {
    const res = await getAnalytics({
      remarks: search,
      page: currentPage,
      limit: 10,
    });
    if (res?.success) {
      setAnalyticsData(res);
      if (res?.count <= (currentPage - 1) * 10) setCurrentPage(1);
    }
  };

  const debouncedCall = useMemo(() => debounce(callAnalytics, 400), [callAnalytics]);

  useEffect(() => { if (!analyticsData) callAnalytics(); }, []);
  useEffect(() => {
    debouncedCall();
    return () => debouncedCall.cancel();
  }, [currentPage, search]);

  const rows = analyticsData?.data ?? [];

  return (
    <div className="main-app">
      <div className="tbl-page">

        {/* ── Desktop table ── */}
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th className="tbl-th" style={{ width: 160 }}>Timestamp</th>
                <th className="tbl-th">Original URL</th>
                <th className="tbl-th" style={{ width: 200 }}>Short Link</th>
                <th className="tbl-th" style={{ width: 140 }}>IP Address</th>
                <th className="tbl-th tbl-center" style={{ width: 120 }}>Device</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="tbl-loading">
                    <span className="tbl-spinner" />
                    Loading analytics…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="tbl-empty">
                    No click data yet — share a short link to start tracking.
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={i} className="tbl-row">

                    {/* Timestamp */}
                    <td className="tbl-td tbl-date">{fmtDate(row.date)}</td>

                    {/* Original URL */}
                    <td className="tbl-td">
                      <div className="url-cell">
                        <span className="url-text" title={row.destinationUrl}>
                          {row.destinationUrl}
                        </span>
                        <div className="url-actions">
                          <button
                            className="icon-btn"
                            title="Copy URL"
                            onClick={() => copyToClipboard(row.destinationUrl)}
                          >
                            <IoCopyOutline />
                          </button>
                          <a
                            href={
                              /^https?:\/\//i.test(row.destinationUrl)
                                ? row.destinationUrl
                                : `https://${row.destinationUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-btn"
                            title="Open URL"
                          >
                            <LuExternalLink />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Short link */}
                    <td className="tbl-td">
                      <div className="url-cell">
                        <span className="url-text url-text--blue" title={row.shortLink}>
                          {row.shortLink}
                        </span>
                        <button
                          className="icon-btn"
                          title="Copy short link"
                          onClick={() => copyToClipboard(row.shortLink)}
                        >
                          <IoCopyOutline />
                        </button>
                      </div>
                    </td>

                    {/* IP */}
                    <td className="tbl-td tbl-mono">{row.ipAddress}</td>

                    {/* Device */}
                    <td className="tbl-td tbl-center">
                      <span className={`device-badge ${deviceClass(row.userDevice)}`}>
                        {row.userDevice}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards ── */}
        <div className="cards-mobile">
          {loading ? (
            <div className="card-empty">Loading analytics…</div>
          ) : rows.length === 0 ? (
            <div className="card-empty">No click data yet.</div>
          ) : (
            rows.map((row, i) => (
              <div className="card" key={i}>
                <div className="card-top">
                  <span className="card-date">{fmtDate(row.date)}</span>
                  <span className={`device-badge ${deviceClass(row.userDevice)}`}>
                    {row.userDevice}
                  </span>
                </div>

                <div className="card-field">
                  <span className="card-label">Short Link</span>
                  <div className="card-url-row">
                    <span className="card-url card-url--blue">{row.shortLink}</span>
                    <button className="icon-btn" onClick={() => copyToClipboard(row.shortLink)}>
                      <IoCopyOutline />
                    </button>
                  </div>
                </div>

                <div className="card-field">
                  <span className="card-label">Original URL</span>
                  <div className="card-url-row">
                    <span className="card-url">{row.destinationUrl}</span>
                    <button className="icon-btn" onClick={() => copyToClipboard(row.destinationUrl)}>
                      <IoCopyOutline />
                    </button>
                  </div>
                </div>

                <div className="card-meta">
                  <span>IP: <strong>{row.ipAddress}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>

        <Pagination
          count={analyticsData?.count}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Analytics;
