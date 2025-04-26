
import './pagination.css';

import React, { useState } from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {

    const [inputPage, setInputPage] = useState("");

    const jumpToPage = () => {
        let pageNum = Number(inputPage) ;
        console.log("<<<<Page",pageNum)
        if (pageNum >= 0 && pageNum < totalPages) {
          console.log("<<<<Page",pageNum)
            onPageChange(pageNum);
        } else {
          alert(`Please enter a number between 1 and ${totalPages}`);
        }
      };

      const generatePageNumbers = () => {
        let pages = [];
        const lastPage = totalPages;
      
        if (lastPage <= 3) {
          for (let i = 1; i <= lastPage; i++) {
            pages.push(i);
          }
        } else if (currentPage <= 3) {
          pages = [1, 2, 3, "...", lastPage];
        } else if (currentPage < lastPage - 2) {
      
          pages = [currentPage - 1, currentPage, currentPage + 1, "...", lastPage];
        } else {
          // Show last few pages
          pages = [lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
        }
      
        return pages;
      };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {generatePageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => page !== "..." && onPageChange(page)}
          className={currentPage === page ? "active" : ""}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() =>{ 
        onPageChange(currentPage + 1)}}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

      <div>
        <input
          type="number"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          placeholder="Go to page"
        />
        <button onClick={jumpToPage}>Go</button>
      </div>

    </div>

  );
};

export default Pagination;
