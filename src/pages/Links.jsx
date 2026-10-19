import React, { useEffect, useMemo, useState } from "react";
import "../styles/Table.css";
import { RiPencilFill, RiDeleteBin6Line } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
import { LuExternalLink } from "react-icons/lu";
import Pagination from "../components/Pagination";
import UrlPopUp from "../components/UrlPopUp";
import DeletePopUp from "../components/DeletePopUp";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { useRecoilState, useRecoilValue } from "recoil";
import { LINKPAGE, LINKSDATA, LINKSEARCH } from "../recoil/recoil";
import { useDeleteLink, useEditLink, useGetLinks } from "../api/hooks";
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

function Links() {
  const search = useRecoilValue(LINKSEARCH);
  const [urlData, setUrlData] = useState(undefined);
  const [urlError, setUrlError] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(undefined);
  const [linksData, setLinksData] = useRecoilState(LINKSDATA);
  const [currentPage, setCurrentPage] = useRecoilState(LINKPAGE);
  const { getLinks, loading } = useGetLinks();
  const { editLink, loading: editLoading } = useEditLink();
  const { deleteLink, loading: deleteLoading } = useDeleteLink();

  const callLinks = async () => {
    const res = await getLinks({ remarks: search, page: currentPage, limit: 10 });
    if (res?.success) {
      setLinksData(res);
      if (res?.count <= (currentPage - 1) * 10) setCurrentPage(1);
    }
  };

  const debouncedCall = useMemo(() => debounce(callLinks, 400), [callLinks]);

  useEffect(() => { if (!linksData) callLinks(); }, []);
  useEffect(() => {
    debouncedCall();
    return () => debouncedCall.cancel();
  }, [currentPage, search]);

  const handleEdit = async () => {
    if (!urlData?.destinationUrl) { setUrlError(true); return; }
    setUrlError(false);
    const regex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\/.*)?$/i;
    if (urlData.destinationUrl.includes("localhost"))
      return toast.error("Localhost URLs are not allowed.");
    if (!regex.test(urlData.destinationUrl))
      return toast.error("Please enter a valid URL.");
    const res = await editLink(urlData);
    if (res.success) { setUrlData(undefined); setLinksData(res); }
  };

  const handleDelete = async () => {
    if (!deletePopUp) return;
    const res = await deleteLink(deletePopUp);
    if (res.success) { setDeletePopUp(undefined); setLinksData(res); }
  };

  const rows = linksData?.data ?? [];

  return (
    <div className="main-app">
      <div className="tbl-page">

        {/* ── Desktop table ── */}
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th className="tbl-th" style={{ width: 150 }}>Date</th>
                <th className="tbl-th">Original URL</th>
                <th className="tbl-th" style={{ width: 200 }}>Short Link</th>
                <th className="tbl-th" style={{ width: 130 }}>Remarks</th>
                <th className="tbl-th tbl-center" style={{ width: 70 }}>Clicks</th>
                <th className="tbl-th tbl-center" style={{ width: 90 }}>Status</th>
                <th className="tbl-th tbl-center" style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="tbl-loading">
                    <span className="tbl-spinner" />
                    Loading links…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="tbl-empty">
                    No links yet — hit <strong>Create new</strong> to add one.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row._id} className="tbl-row">

                    {/* Date */}
                    <td className="tbl-td tbl-date">{fmtDate(row.date)}</td>

                    {/* Original URL — single line + copy */}
                    <td className="tbl-td">
                      <div className="url-cell">
                        <span className="url-text" title={row.destinationUrl}>
                          {row.destinationUrl}
                        </span>
                        <div className="url-actions">
                          <button
                            className="icon-btn"
                            title="Copy original URL"
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
                            title="Open original URL"
                          >
                            <LuExternalLink />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Short link — single line + copy */}
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

                    {/* Remarks */}
                    <td className="tbl-td tbl-muted">{row.remarks || "—"}</td>

                    {/* Clicks */}
                    <td className="tbl-td tbl-center tbl-bold">{row.clicks}</td>

                    {/* Status */}
                    <td className="tbl-td tbl-center">
                      <span className={`status-badge status-${row.status.toLowerCase()}`}>
                        {row.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="tbl-td tbl-center">
                      <div className="action-row">
                        <button
                          className="action-btn"
                          title="Edit"
                          onClick={() => setUrlData(row)}
                        >
                          <RiPencilFill />
                        </button>
                        <button
                          className="action-btn action-btn--danger"
                          title="Delete"
                          onClick={() => setDeletePopUp(row._id)}
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </div>
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
            <div className="card-empty">Loading links…</div>
          ) : rows.length === 0 ? (
            <div className="card-empty">No links yet — tap <strong>+</strong> to create one.</div>
          ) : (
            rows.map((row) => (
              <div className="card" key={row._id}>
                <div className="card-top">
                  <span className="card-date">{fmtDate(row.date)}</span>
                  <span className={`status-badge status-${row.status.toLowerCase()}`}>
                    {row.status}
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
                  <span>Clicks: <strong>{row.clicks}</strong></span>
                  {row.remarks && <span>Remark: <strong>{row.remarks}</strong></span>}
                </div>

                <div className="card-actions">
                  <button className="card-act-btn" onClick={() => setUrlData(row)}>
                    <RiPencilFill /> Edit
                  </button>
                  <button className="card-act-btn card-act-btn--danger" onClick={() => setDeletePopUp(row._id)}>
                    <RiDeleteBin6Line /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <Pagination count={linksData?.count} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>

      {urlData && (
        <UrlPopUp
          value={urlData}
          Urlerror={urlError}
          setValue={setUrlData}
          handleSubmit={handleEdit}
          close={() => setUrlData(undefined)}
          name="Edit Link"
          buttonName="Save"
        />
      )}
      {deletePopUp && (
        <DeletePopUp
          text="Are you sure you want to remove this link?"
          handleSubmit={handleDelete}
          close={() => setDeletePopUp(undefined)}
        />
      )}
      {editLoading && <Loader text="Saving changes…" />}
      {deleteLoading && <Loader text="Deleting link…" />}
    </div>
  );
}

export default Links;
