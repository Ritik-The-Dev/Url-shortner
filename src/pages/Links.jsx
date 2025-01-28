import React, { useEffect, useMemo, useState } from "react";
import "../styles/Links.css";
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
                    Date
                    <RxCaretSort className="sort-icon" />
                  </th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>Remarks</th>
                  <th>Clicks</th>
                  <th className="sortable">
                    Status
                    <RxCaretSort className="sort-icon" />
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
                    Date
                    <RxCaretSort className="sort-icon" />
                  </th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>Remarks</th>
                  <th>Clicks</th>
                  <th className="sortable">
                    Status
                    <RxCaretSort className="sort-icon" />
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {linksData?.data?.length ? (
                  linksData?.data?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="border-right">{row.date}</td>
                      <td className="border-right text-wrap">
                        {row.destinationUrl}
                      </td>
                      <td className="border-right text-wrap">
                        <div className="relative">
                          {row.shortLink}
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
