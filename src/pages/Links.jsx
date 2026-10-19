import React, { useEffect, useMemo, useState } from "react";
import "../styles/Links.css";
import "../styles/MobileCards.css";
import { truncateEnd } from "../utils/formatUrl";
import { RiPencilFill, RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "../components/Pagination";
import { RxCaretSort } from "react-icons/rx";
import { IoCopyOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import UrlPopUp from "../components/UrlPopUp";
import DeletePopUp from "../components/DeletePopUp";
import { useRecoilState, useRecoilValue } from "recoil";
import { LINKPAGE, LINKSDATA, LINKSEARCH } from "../recoil/recoil";
import Loader from "../components/Loader";
import { useDeleteLink, useEditLink, useGetLinks } from "../api/hooks";
import { debounce } from "lodash";

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

function Links() {
  const search = useRecoilValue(LINKSEARCH);
  const [urlData, setUrlData] = useState(undefined);
  const [UrlError, setUrlError] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(undefined);
  const [linksData, setLinksData] = useRecoilState(LINKSDATA);
  const [currentPage, setCurrentPage] = useRecoilState(LINKPAGE);
  const { getLinks, loading } = useGetLinks();
  const { editLink, loading: EditLoading } = useEditLink();
  const { deleteLink, loading: DeleteLoading } = useDeleteLink();

  const handleUpdateUrl = async () => {
    if (!urlData || !urlData?.destinationUrl) {
      setUrlError(true);
      return;
    }
    setUrlError(false);
    const regex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\/.*)?$/i;
    if (urlData.destinationUrl.includes("localhost"))
      return toast.error("Localhost Url is not allowed.");
    if (!regex.test(urlData.destinationUrl))
      return toast.error("Pls Enter a Valid Url.");
    const EditResponse = await editLink(urlData);
    if (EditResponse.success) {
      setUrlData(undefined);
      setLinksData(EditResponse);
    }
  };

  const handleDeleteUrl = async () => {
    if (!deletePopUp) {
      toast.error("Pls refresh something went wrong!");
      return;
    }
    const DeleteResponse = await deleteLink(deletePopUp);
    if (DeleteResponse.success) {
      setDeletePopUp(undefined);
      setLinksData(DeleteResponse);
    }
  };

  const handleCopy = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Link Copied", {
          position: "bottom-left",
          style: { background: "transparent" },
        });
      })
      .catch((error) => {
        toast.error("Failed to copy link", { position: "bottom-left" });
        console.error("Error copying to clipboard:", error);
      });
  };

  const CallLinks = async () => {
    const response = await getLinks({
      remarks: search,
      page: currentPage,
      limit: 10,
    });
    if (response?.success) {
      setLinksData(response);
      if (response?.count <= (currentPage - 1) * 10) {
        setCurrentPage(1);
      }
    }
  };

  const debouncedCallLinks = useMemo(
    () => debounce(CallLinks, 500),
    [CallLinks]
  );

  useEffect(() => {
    if (!linksData) {
      CallLinks();
    }
  }, []);

  useEffect(() => {
    debouncedCallLinks();
    return () => {
      debouncedCallLinks.cancel();
    };
  }, [currentPage, search]);

  const renderMobileCards = () => {
    if (!linksData?.data?.length) {
      return <div className="data-card-empty">No links yet. Tap + to create one.</div>;
    }

    return linksData.data.map((row) => (
      <article className="data-card" key={row._id || row.shortLink}>
        <div className="data-card-header">
          <time className="data-card-date">{FormatDate(row.date)}</time>
          <span className={`status-pill status-${row.status.toLowerCase()}`}>
            {row.status}
          </span>
        </div>
        <div className="data-card-field">
          <span className="data-card-label">Short link</span>
          <div className="data-card-short-row">
            <span className="data-card-value data-card-value--link">
              {truncateEnd(row.shortLink, 36)}
            </span>
            <button
              type="button"
              className="data-card-copy"
              onClick={() => handleCopy(row.shortLink)}
              aria-label="Copy short link"
            >
              <IoCopyOutline />
            </button>
          </div>
        </div>
        <div className="data-card-field">
          <span className="data-card-label">Original URL</span>
          <p className="data-card-value">{row.destinationUrl}</p>
        </div>
        <div className="data-card-meta">
          <span className="data-card-meta-item">
            Clicks: <strong>{row.clicks}</strong>
          </span>
          {row.remarks ? (
            <span className="data-card-meta-item">
              Remark: <strong>{row.remarks}</strong>
            </span>
          ) : null}
        </div>
        <div className="data-card-actions">
          <button
            type="button"
            className="data-card-action-btn"
            onClick={() => setUrlData(row)}
          >
            <RiPencilFill /> Edit
          </button>
          <button
            type="button"
            className="data-card-action-btn data-card-action-btn--danger"
            onClick={() => setDeletePopUp(row._id)}
          >
            <RiDeleteBin6Line /> Delete
          </button>
        </div>
      </article>
    ));
  };

  return (
    <div className="main-app">
      <div className="link-page">
        <div className="link-page-scroll">
        <div className="data-cards-mobile">
          {loading ? (
            <div className="data-card-empty">Fetching links…</div>
          ) : (
            renderMobileCards()
          )}
        </div>
        <div className="custom-table-container table-desktop-wrap">
          <p className="custom-table-scroll-hint">Swipe horizontally to see all columns</p>
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
                    <span className="sortable-inner">
                      Date
                      <RxCaretSort className="sort-icon" />
                    </span>
                  </th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>Remarks</th>
                  <th>Clicks</th>
                  <th className="sortable">
                    <span className="sortable-inner">
                      Status
                      <RxCaretSort className="sort-icon" />
                    </span>
                  </th>
                  <th>Action</th>
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
                    {"Fetching Links Please Wait..."}
                  </span>
                </div>
              </div>
            </table>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="sortable">
                    <span className="sortable-inner">
                      Date
                      <RxCaretSort className="sort-icon" />
                    </span>
                  </th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>Remarks</th>
                  <th>Clicks</th>
                  <th className="sortable">
                    <span className="sortable-inner">
                      Status
                      <RxCaretSort className="sort-icon" />
                    </span>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {linksData?.data?.length ? (
                  linksData?.data?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="border-right min-w-176">{FormatDate(row.date)}</td>
                      <td className="border-right url-cell">
                        {row.destinationUrl}
                      </td>
                      <td className="border-right text-wrap">
                        <div className="relative">
                          {row.shortLink.slice(0, 24)}
                          {row.shortLink.length > 24 ? '...' : ''}
                          <div
                            onClick={() => handleCopy(row.shortLink)}
                            className="copy-btn absolute"
                          >
                            <IoCopyOutline className="copy-icon" />
                          </div>
                        </div>
                      </td>
                      <td className="border-right">{row?.remarks || ""}</td>
                      <td className="border-right">{row.clicks}</td>
                      <td
                        className={`border-right status-${row.status.toLowerCase()}`}
                      >
                        {row.status}
                      </td>
                      <td className="action-icons">
                        <RiPencilFill
                          className="icon"
                          onClick={() => setUrlData(row)}
                        />
                        <RiDeleteBin6Line
                          onClick={() => setDeletePopUp(row._id)}
                          className="icon"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border-right">No Data Available</td>
                    <td className="border-right text-wrap">
                      No Data Available
                    </td>
                    <td className="border-right text-wrap">
                      No Data Available
                    </td>
                    <td className="border-right">No Data Available</td>
                    <td className="border-right">No Data Available</td>
                    <td className={`border-right`}>No Data Available</td>
                    <td className="action-icons">No Data Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        </div>
        <Pagination
          count={linksData?.count}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
      {urlData && (
        <UrlPopUp
          value={urlData}
          Urlerror={UrlError}
          setValue={setUrlData}
          handleSubmit={handleUpdateUrl}
          close={() => setUrlData(undefined)}
          name="Edit Link"
          buttonName="Save"
        />
      )}
      {deletePopUp && (
        <DeletePopUp
          text="Are you sure, you want to remove it ?"
          handleSubmit={handleDeleteUrl}
          close={() => setDeletePopUp(undefined)}
        />
      )}
      {EditLoading && <Loader text="Link is being edited..." />}
      {DeleteLoading && <Loader text="Links is being deleted..." />}
    </div>
  );
}

export default Links;
