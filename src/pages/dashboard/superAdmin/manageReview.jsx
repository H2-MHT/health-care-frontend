import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import { fetchDataAuth, updateData } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { getFormattedDate } from "../../../utils/common";
import { showToast } from "../../../utils/toast";
import Pagination from "../../../components/pagination/pagination";

const ManageReview = () => {
  const navigate = useNavigate();
  const [reviewList, setReviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const statusOptions = [
    { value: "Valid", label: "Valid" },
    { value: "Invalid", label: "Invalid" },
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(reviewList.length / itemsPerPage));
  }, [reviewList]);




  // const fetchReviews = async () => {
  //   try {
  //     const response = await fetchDataAuth(`MasterPanel/get-report/`, navigate);
  //     if (!response.ok) throw new Error("Failed to fetch");
  //     const data = await response.json();

  //     const formattedData = (data?.report || []).map((review) => ({
  //       ...review,
  //       status: review?.status || "invalid",
  //     }));

  //     setReviewList(formattedData);
  //   } catch (error) {
  //     console.error("Error fetching reviews:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchReviews = async (page = 1, searchQuery = "") => {
      setLoading(true);
      const fetchUrl = `MasterPanel/get-report/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
        searchQuery
      )}`;;
      try {
        const response = await fetchDataAuth(fetchUrl);
  
        if (!response.ok) throw new Error("Fetching Doctor List Failed");
        const totalPagesHeader = response.headers.get("Total-Pages");
        const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
        const data = await response.json();
        const formattedData = (data?.data || []).map((review) => ({
        ...review,
        status: review?.status || "invalid",
      }));
        setReviewList(formattedData);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Fetch Doctor List Error: ", error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

  const handleStatusChange = async (review, selectedOption) => {
    setReviewList((prev) =>
      prev.map((r) =>
        r.id === review.id ? { ...r, status: selectedOption.value } : r
      )
    );
    try {
      const payload = {
        report_id: review?.id,
        status: selectedOption?.value,
      };
      const response = await updateData(
        "MasterPanel/review-report/",
        JSON.stringify(payload)
      );
      if (response.status === 200) {
        const responseData = await response.json();
        console.log(">>>>>>>>>>>res", responseData);
        showToast(responseData?.message, "success");
      }
    } catch (error) {
      showToast(error?.message, "error");
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  const paginatedData = reviewList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="p-3 w-100">
      <div className="p-3 bg-white border rounded shadow">
        <div className="table-responsive" style={{ minHeight: "400px" }}>
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Reported Date</th>
                <th>Reported By</th>
                <th>Review Content</th>
                <th>Reported Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((review) => (
                <tr key={review?.id}>
                  <td>{getFormattedDate(review?.created_at)}</td>
                  <td>{review?.reported_by}</td>
                  <td>
                    <span data-tooltip-id={`tooltip-${review?.id}`}>
                      {review?.content?.length > 50
                        ? review?.content?.slice(0, 50) + "..."
                        : review?.content}
                    </span>

                    {review?.content?.length > 50 && (
                      <Tooltip
                        id={`tooltip-${review.id}`}
                        place="top"
                        style={{
                          maxWidth: "250px",
                          whiteSpace: "normal",
                          textAlign: "left",
                          fontSize: "13px",
                        }}
                      >
                        {review?.content}
                      </Tooltip>
                    )}
                  </td>
                  <td>{review?.reason}</td>
                  <td>
                    <Select
                      options={statusOptions}
                      value={
                        statusOptions.find(
                          (option) => option.value === review?.status
                        ) ||
                        statusOptions.find(
                          (option) => option.value === "invalid"
                        )
                      }
                      onChange={(selectedOption) =>
                        handleStatusChange(review, selectedOption)
                      }
                      className="status-dropdown"
                      isSearchable={false}
                    />
                  </td>
                </tr>
              ))}

              {reviewList.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default ManageReview;
