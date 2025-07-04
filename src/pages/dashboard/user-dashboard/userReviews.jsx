import React, { useEffect, useState } from "react";
import {
  deleteData,
  fetchData,
  postData,
} from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { InputField } from "../../../components/form/InputField";
import { useNavigate } from "react-router-dom";
import { reviewRating } from "../../../utils/constants";
import { Loader } from "../../../components/ui/loader/loader";
import Pagination from "../../../components/pagination/pagination";
import { getAppointmentFormattedDate } from "../../../utils/common";
import Image from "../../../components/form/Image";

const Reviews = () => {
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState({});
  const [totalReviewSum, setTotalReviewSum] = useState(0);
  const [currentSelectedReviewId, setCurrentSelectedReviewId] = useState();
  const [ratingCounts, setRatingCounts] = useState(reviewRating);
  const [openReview, setOpenReview] = useState(null);
  const [replylistId, setReplylistId] = useState(null);
  const [replyData, setReplyData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getPaginatedReviews(currentPage); // Fetch data on component mount
  }, [currentPage]);

  const trustscore = reviewData?.length
    ? (totalReviewSum / reviewData.length).toFixed(1)
    : 0;
  const toggleReply = (id) => {
    setReplylistId(id);
    setOpenReview(openReview === id ? null : id);
  };

  useEffect(() => {
    const totalSum = reviewData?.reduce((sum, item) => sum + item.rating, 0);
    const counts = {
      one: reviewData.filter((item) => item.rating === 1).length,
      two: reviewData.filter((item) => item.rating === 2).length,
      three: reviewData.filter((item) => item.rating === 3).length,
      four: reviewData.filter((item) => item.rating === 4).length,
      five: reviewData.filter((item) => item.rating === 5).length,
    };
    setRatingCounts(counts);
    setTotalReviewSum(totalSum);
  }, [reviewData]);

  const getPaginatedReviews = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetchData(
        `reviews/review/?page=${page}&limit=${itemsPerPage}`,
        navigate
      );
      const totalPagesHeader = response.headers.get("Total-Pages");
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
      const responseData = await response.json();
      setReviewData(Array.isArray(responseData?.data) ? responseData.data : []);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getReviewsReplyData = async () => {
    // setLoading(true);
    try {
      const response = await fetchData(
        `reviews/replies/?review_id=${replylistId}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      setReplyData(responseData?.data);
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (replylistId !== null) {
      getReviewsReplyData(); // Fetch replies when replylistId changes
    }
  }, [replylistId]);

  const onSubmit = async () => {
    if (Object.keys(replyTextMap).length === 0) {
      return;
    }
    try {
      const payload = {
        content: replyTextMap[currentSelectedReviewId] || "", // Use the specific reply text for the review
      };
      const response = await postData(
        `reviews/replies/${currentSelectedReviewId}/`,
        payload
      );
      if (response.status === 201) {
        getPaginatedReviews();
        getReviewsReplyData();
        setReplyTextMap((prevMap) => {
          const updatedMap = { ...prevMap };
          delete updatedMap[currentSelectedReviewId]; // Remove the reply text for the submitted review
          return updatedMap;
        });
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleReplydelete = async (id) => {
    try {
      const response = await deleteData(`reviews/delete-update-reply/${id}`);
      showToast("Notes deleted successfully", "success");
      await getReviewsReplyData();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleReviewdelete = async (id) => {
    try {
      const payload = {
        review_id: id,
      };
      const response = await deleteData(`reviews/review/`, payload);
      console.log(response, ">>>>>>payload");
      showToast("Notes deleted successfully", "success");
      await getReviewsReplyData();
      await getPaginatedReviews();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleReplyTextChange = (e, reviewId) => {
    setReplyTextMap((prevMap) => ({
      ...prevMap,
      [reviewId]: e.target.value, // Set the specific reply text for this review
    }));
    setCurrentSelectedReviewId(reviewId);
  };

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
                src="../images/doctor-dashboard/profile-sample.png"
                className="img-fluid"
              />
            </div>
          </div>
          <div class="sortSearchArea">
            <div class="search">
              <input type="search" placeholder="search" />
              <a href="#">
                <img src="../images/search-dark.svg" />
              </a>
            </div>
          </div>

          <div className="publicViewMain bg-white border-radius-20 p-2">
            <div className="row p-4">
              <div className="col-md-8 p-2">
                <div className="card-scroll">
                  {reviewData?.length ? (
                    reviewData?.map((items) => (
                      <div className="d-flex flex-column mt-4" key={items.id}>
                        <div className="item">
                          <div className="reviewBox position-relative">
                            <div className="ratingstar">
                              <a href="#">
                                <img
                                  src={
                                    items?.rating === 5
                                      ? "../images/doctor-dashboard/greenstarGrp.webp"
                                      : items?.rating === 4
                                      ? "../images/doctor-dashboard/yellowstarGrp.webp"
                                      : items?.rating === 3
                                      ? "../images/doctor-dashboard/orangestarGrp.webp"
                                      : items?.rating === 2
                                      ? "../images/doctor-dashboard/darkorangestarGrp.webp"
                                      : "../images/doctor-dashboard/redstarGrp.webp"
                                  }
                                  alt={`star-${items?.rating}`}
                                  style={{ width: "150px" }}
                                />
                              </a>
                            </div>
                            <h5>{items?.title}</h5>
                            <h6>{items?.content}</h6>
                            <div class="maineditdelete editdelete d-flex align-items-center gap-2">
                              {/* <img src="../images/edit.svg" width="25" /> */}
                              <img
                                src="../images/delete.svg"
                                width="25"
                                onClick={() => handleReviewdelete(items?.id)}
                              />
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-4">
                              <div
                                className="reply-text"
                                onClick={() => toggleReply(items.id)}
                              >
                                {items?.replies?.length} Replies
                              </div>
                              <div className="reply-text">Reply</div>
                            </div>
                            {openReview === items?.id && (
                              <>
                                {replyData?.replies?.length > 0 &&
                                  replyData?.replies?.map((item, index) => (
                                    <div className="reviewName" key={index}>
                                      <Image src={item?.profile_picture} />
                                      <div className="reply-msg">
                                        <p>{item?.content}</p>
                                      </div>
                                      <div class="editdelete d-flex align-items-center gap-2">
                                        <img
                                          src="../images/delete.svg"
                                          width="25"
                                          onClick={() =>
                                            handleReplydelete(item?.id)
                                          }
                                        />
                                      </div>
                                    </div>
                                  ))}
                              </>
                            )}
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
                                    src="../images/doctor-dashboard/reviewSubmitBtn.webp"
                                    className=""
                                    alt="Down Arrow"
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
                                src={items?.doctor?.profile_picture}
                                alt="Reviewer"
                              />
                              <div>
                                <h4>{items?.doctor?.name}</h4>
                                <p>{getAppointmentFormattedDate(items?.created_at)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="treatmentContainer">
                      <div className="no-appointments">
                        No Reviews available
                      </div>
                    </div>
                  )}
                </div>
                {reviewData.length > 0 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>

              <div className="col-md-4 p-2">
                <div className="calendar-rating-display">
                  <div className="trustRight">
                    <div className="trustScore">
                      <h5>My trust score</h5>
                      <div className="score">
                        <img
                          src="../images/doctor-dashboard/star.png"
                          className="img-fluid"
                        />
                        <div className="scoreData">
                          {totalReviewSum > 0
                            ? totalReviewSum / reviewData?.length
                            : totalReviewSum}
                        </div>
                      </div>
                    </div>
                    <div className="trustRate">
                      <div className="rate">{reviewData?.length}</div>
                      reviews
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <div class="calendar-rating-display gap-4 mt-5">
                    <div class="d-flex rating-text">
                      <p>{ratingCounts?.five}</p>
                    </div>
                    <div class="ratingstar">
                      <a href="#">
                        <img
                          src="../images\doctor-dashboard\greenstarGrp.webp"
                          className="imgSize"
                        />
                      </a>
                    </div>
                  </div>
                  <div class="calendar-rating-display gap-4 mt-2">
                    <div class="d-flex rating-text">
                      <p>{ratingCounts?.four}</p>
                    </div>
                    <div class="ratingstar">
                      <a href="#">
                        <img
                          src="../images\doctor-dashboard\yellowstarGrp.webp"
                          className="imgSize"
                        />
                      </a>
                    </div>
                  </div>
                  <div class="calendar-rating-display gap-4 mt-2">
                    <div class="d-flex rating-text">
                      <p>{ratingCounts?.three}</p>
                    </div>
                    <div class="ratingstar">
                      <a href="#">
                        <img
                          src="../images\doctor-dashboard\orangestarGrp.webp"
                          className="imgSize"
                        />
                      </a>
                    </div>
                  </div>
                  <div class="calendar-rating-display gap-4 mt-2">
                    <div class="d-flex rating-text">
                      <p>{ratingCounts?.two}</p>
                    </div>
                    <div class="ratingstar">
                      <a href="#">
                        <img
                          src="../images\doctor-dashboard\darkorangestarGrp.webp"
                          className="imgSize"
                        />
                      </a>
                    </div>
                  </div>
                  <div class="calendar-rating-display gap-4 mt-2">
                    <div class="d-flex rating-text">
                      <p>{ratingCounts?.one}</p>
                    </div>
                    <div class="ratingstar">
                      <a href="#">
                        <img
                          src="../images\doctor-dashboard\redstarGrp.webp"
                          className="imgSize"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reviews;
