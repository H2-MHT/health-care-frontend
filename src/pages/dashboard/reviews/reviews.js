import React, { useEffect, useState } from "react";
import { fetchData, postData } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { InputField } from "../../../components/form/InputField";
import { useNavigate } from "react-router-dom";
import { reviewRating } from "../../../utils/constants";
import Image from "../../../components/form/Image";
import { Loader } from "../../../components/ui/loader/loader";
import { Modal } from "react-bootstrap";
import Pagination from "../../../components/pagination/pagination";
import { getFormattedDate } from "../../../utils/common";

const Reviews = () => {
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [totalReviewSum, setTotalReviewSum] = useState(0);
  const [ratingCounts, setRatingCounts] = useState(reviewRating);
  const [reportedReviewIds, setReportedReviewIds] = useState([]);

  const [currentSelectedReviewId, setCurrentSelectedReviewId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [query, setquery] = useState("");

  const getPaginatedData = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await fetchData(
        `reviews/doctor/?page=${page}&limit=${itemsPerPage}&search=${encodeURIComponent(
      searchQuery
    )}`,
        navigate
      );
      const totalPagesHeader = response.headers.get("Total-Pages");
      const total = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
      const responseData = await response.json();

      setReviewData(
        Array.isArray(responseData?.data?.reviews)
          ? responseData.data.reviews
          : []
      );
      setTotalPages(total);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1); 
      getPaginatedData(1, query); 
    }
  };

  useEffect(() => {
    getPaginatedData(currentPage, query);
  }, [currentPage]);

  const handleReplyTextChange = (e, reviewId) => {
    setReplyTextMap((prevMap) => ({
      ...prevMap,
      [reviewId]: e.target.value,
    }));
    setCurrentSelectedReviewId(reviewId);
  };

  const onSubmit = async () => {
    if (Object.keys(replyTextMap).length === 0) return;
    try {
      const payload = {
        content: replyTextMap[currentSelectedReviewId] || "",
      };
      const response = await postData(
        `reviews/replies/${currentSelectedReviewId}/`,
        payload
      );
      if (response.status === 201) {
        const responseData = await response.json();
        showToast(responseData?.message, "success");
        getPaginatedData(currentPage, query);

        setReplyTextMap((prevMap) => {
          const updatedMap = { ...prevMap };
          delete updatedMap[currentSelectedReviewId];
          return updatedMap;
        });
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleReportReview = async (reviewId) => {
    const reasonToSend =
      selectedReason === "Other" ? otherReason : selectedReason;

    if (!reasonToSend) {
      showToast("Please select or enter a reason for reporting.", "error");
      return;
    }

    try {
      const payload = {
        review_id: reviewId,
        reason: reasonToSend,
      };

      const response = await postData("reviews/report-sumbit/", payload);

      if (response.ok || response.status === 200 || response.status === 201) {
        const data = await response.json();
        showToast(data?.message || "Reported successfully", "success");

        
        setReportedReviewIds((prev) => [...prev, reviewId]);
        getPaginatedData(currentPage);

       
        setIsModalOpen(false);
        setSelectedReason("");
        setOtherReason("");
      } else {
        const errorData = await response.json();
        showToast(errorData?.message || "Failed to report review", "error");
      }
    } catch (error) {
      showToast(error.message || "Something went wrong", "error");
    }
  };

  useEffect(() => {
    const totalSum = reviewData?.reduce((sum, item) => sum + item.rating, 0);
    const counts = {
      one: reviewData?.filter((item) => item.rating === 1).length,
      two: reviewData?.filter((item) => item.rating === 2).length,
      three: reviewData?.filter((item) => item.rating === 3).length,
      four: reviewData?.filter((item) => item.rating === 4).length,
      five: reviewData?.filter((item) => item.rating === 5).length,
    };
    setRatingCounts(counts);
    setTotalReviewSum(totalSum);
  }, [reviewData]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="rightContent rightsidefull">
          <div className="profileMobile">
            <div className="nameMobile">Hello, Dr. Ava Williams!</div>
            <div className="profileImgMobile">
              <img
                src="images/doctor-dashboard/profile-sample.png"
                className="img-fluid"
              />
            </div>
          </div>

          <div className="sortSearchArea">
            <div className="search">
              <input
                type="search"
                placeholder="Search"
                value={query}
                onChange={(e) => setquery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <a href="#">
                <img src="images/search-dark.svg" />
              </a>
            </div>
          </div>

          <div className="publicViewMain bg-white border-radius-20 p-2">
            <div className="row p-4">
              <div className="col-md-8 p-2">
                <div className="card-scroll">
                  {reviewData?.map((items) => (
                    <div className="d-flex flex-column mt-4" key={items?.id}>
                      <div className="item">
                        <div className="reviewBox">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="ratingstar">
                              <a href="#">
                                <img
                                  src={`images/doctor-dashboard/${
                                    items?.rating === 5
                                      ? "green"
                                      : items?.rating === 4
                                      ? "yellow"
                                      : items?.rating === 3
                                      ? "orange"
                                      : items?.rating === 2
                                      ? "darkorange"
                                      : "red"
                                  }starGrp.webp`}
                                  style={{ width: "150px" }}
                                />
                              </a>
                            </div>
                            <div className="report-button mt-3">
                              {reportedReviewIds.includes(items?.id) ? (
                                <span className="text-danger fw-bold">
                                  Reported
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setCurrentSelectedReviewId(items?.id);
                                    setIsModalOpen(true);
                                  }}
                                  style={{
                                    background: "gray",
                                    color: "white",
                                    border: "none",
                                    padding: "5px 10px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Report
                                </button>
                              )}
                            </div>
                          </div>

                          <h5>{items?.title}</h5>
                          <h6>{items?.content}</h6>
                          <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="reply-text">
                              {items?.replies?.length} Replies
                            </div>
                            <div className="reply-text">Reply</div>
                          </div>

                          {items?.replies?.map((item, index) => (
                            <div className="reviewName" key={index}>
                              <Image src={item?.reviewer_profile_picture} />
                              <div className="reply-msg">
                                <p>{item?.content}</p>
                              </div>
                              <div>
                                <p>...</p>
                              </div>
                            </div>
                          ))}

                          <div className="row p-2">
                            <div className="col-md-10">
                              <InputField
                                type="text"
                                id="text"
                                name="content"
                                className="reply-input"
                                placeholder="Type your text here..."
                                value={replyTextMap[items.id] || ""}
                                onChange={(e) =>
                                  handleReplyTextChange(e, items.id)
                                }
                              />
                            </div>
                            <div className="col-md-2 d-flex align-items-center justify-content-end">
                              <button
                                onClick={onSubmit}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                }}
                              >
                                <img
                                  src="images/doctor-dashboard/reviewSubmitBtn.webp"
                                  alt="Submit"
                                  style={{
                                    cursor: "pointer",
                                    width: "20px",
                                    height: "35px",
                                  }}
                                />
                              </button>
                            </div>
                          </div>

                          <div className="reviewName">
                            <img
                              src="images/doctor-dashboard/sample-doc.svg"
                              alt="Reviewer"
                            />
                            <div>
                              <h4>{items?.reviewer_name}</h4>
                              <p>{getFormattedDate(items?.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {reviewData.length > 0 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>

              {/* Modal for Reporting */}
              <Modal
                show={isModalOpen}
                onHide={() => setIsModalOpen(false)}
                backdrop="static"
                keyboard={false}
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title className="w-100 text-center">
                    <h5 className="modal-title mx-auto">Report Review</h5>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReportReview(currentSelectedReviewId);
                    }}
                  >
                    {[
                      "Inappropriate content",
                      "Spam",
                      "Harassment",
                      "Other",
                    ].map((option, idx) => (
                      <div className="status" key={idx}>
                        <input
                          type="radio"
                          value={option}
                          checked={selectedReason === option}
                          onChange={() => setSelectedReason(option)}
                        />
                        <label>{option}</label>
                        {option === "Other" && selectedReason === "Other" && (
                          <input
                            type="text"
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            placeholder="Please specify..."
                            className="form-control mt-2"
                          />
                        )}
                      </div>
                    ))}
                    <div className="rescduleBtns mt-3">
                      <button type="submit" className="blue_lg">
                        Submit Report
                      </button>
                    </div>
                  </form>
                </Modal.Body>
              </Modal>

              {/* Trust Score Section */}
              <div className="col-md-4 p-2">
                <div className="calendar-rating-display">
                  <div className="trustRight">
                    <div className="trustScore">
                      <h5>My trust score</h5>
                      <div className="score">
                        <img
                          src="images/doctor-dashboard/star.png"
                          className="img-fluid"
                        />
                        <div className="scoreData">
                          {totalReviewSum > 0
                            ? (totalReviewSum / reviewData?.length).toFixed(1)
                            : 0}
                        </div>
                      </div>
                    </div>
                    <div className="trustRate">
                      <div className="rate">{reviewData?.length}</div>
                      Reviews
                    </div>
                  </div>
                </div>

                {["five", "four", "three", "two", "one"].map((star, index) => (
                  <div
                    className="calendar-rating-display gap-4 mt-2"
                    key={index}
                  >
                    <div className="d-flex rating-text">
                      <p>{ratingCounts?.[star]}</p>
                    </div>
                    <div className="ratingstar">
                      <a href="#">
                        <img
                          src={`images/doctor-dashboard/${star}starGrp.webp`
                            .replace("five", "green")
                            .replace("four", "yellow")
                            .replace("three", "orange")
                            .replace("two", "darkorange")
                            .replace("one", "red")}
                          className="imgSize"
                        />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reviews;
