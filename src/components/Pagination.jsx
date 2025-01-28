import { useEffect, useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

const Pagination = ({
  count,
  currentPage = 1,
  setCurrentPage = () => {},
}) => {
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setTotalPages(Math.ceil((count || 1) / 10));
  }, [count]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const range = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1, 2);
      if (currentPage > 3) {
        range.push("...");
      }

      if (currentPage > 2 && currentPage < totalPages - 1) {
        range.push(currentPage - 1, currentPage, currentPage + 1);
      }

      if (currentPage < totalPages - 2) {
        range.push("...");
      }
      range.push(totalPages - 1, totalPages);
    }

    return range;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-buttons">
        <div
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-button bg-blue"
        >
          <MdOutlineKeyboardArrowLeft className="pagination-arrow rotate-180" />
        </div>
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <div key={index} className="pagination-dots">
              <p className="pagination-button-text">...</p>
            </div>
          ) : (
            <div
              key={index}
              onClick={() => handlePageChange(page)}
              className={`pagination-button ${
                currentPage === page ? "active" : "inactive"
              }`}
            >
              <p className="pagination-button-text">{page}</p>
            </div>
          )
        )}

        <div
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-button bg-blue"
        >
          <MdOutlineKeyboardArrowRight className="pagination-arrow" />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
