import React, { useEffect, useState } from "react";
import { fetchData, postData } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { InputField } from "../../../components/form/InputField";
import { useNavigate } from "react-router-dom";
import { reviewRating } from "../../../utils/constants";
import { Loader } from "../../../components/ui/loader/loader";
import { useTranslation } from "react-i18next";


const Reviews = () => {
  const{t} = useTranslation();
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

  const getReviewsData = async () => {
    // setLoading(true);
    try {
      const response = await fetchData("clinics/clinic-reviews/", navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      console.log(responseData,">>>>responseData")
      setReviewData(responseData);
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log(error.message);
    }
  };
  const getReviewsReplyData = async () => {
    // setLoading(true);
    try {
      const response = await fetchData(
        `clinics/clinic-reviews/${replylistId}/replies/`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      setReplyData(responseData);
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log(error.message);
    }
  };
  const onSubmit = async () => {
     if (Object.keys(replyTextMap).length === 0) {
      return;
    }
    try {
      const payload = {
        content: replyTextMap[currentSelectedReviewId] || "", // Use the specific reply text for the review
      };
      const response = await postData(
        `clinics/clinic-reviews/${currentSelectedReviewId}/replies/`,
        payload
      );
      if (response.status === 201) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        getReviewsData();
        getReviewsReplyData();
        // Clear the specific reply text after submitting
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
  useEffect(() => {
    getReviewsData(); // Fetch data on component mount
  }, []);

  const handleReplyTextChange = (e, reviewId) => {
    setReplyTextMap((prevMap) => ({
      ...prevMap,
      [reviewId]: e.target.value, // Set the specific reply text for this review
    }));
    setCurrentSelectedReviewId(reviewId);
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

  const toggleReply = (id) => {
    setReplylistId(id); // Set the replylistId
    setOpenReview(openReview === id ? null : id); // Toggle review visibility
  };

  useEffect(() => {
    if (replylistId !== null) {
      getReviewsReplyData(); // Fetch replies when replylistId changes
    }
  }, [replylistId]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="rightContent">
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
                  {reviewData?.map((items) => (
                    <div className="d-flex flex-column mt-4" key={items.id}>
                      <div className="item">
                        <div className="reviewBox">
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
                          <h5>{t("clinic-reviews.review-title")}</h5>
                          <h6>{items?.content}</h6>
                          <div className="d-flex justify-content-between align-items-center mt-4">
                            <div
                              className="reply-text"
                              onClick={() => toggleReply(items.id)}
                            >
                              {items?.replies?.length}{" "}
                              {t("clinic-reviews.replies")}
                            </div>
                            <div className="reply-text">
                              {t("clinic-reviews.reply")}
                            </div>
                          </div>
                          {openReview === items.id && (
                            <>
                              {replyData?.map((item, index) => (
                                <div className="reviewName" key={index}>
                                  <img
                                    src="../images/doctor-dashboard/sample-doc.svg"
                                    alt="Reviewer"
                                  />
                                  <div className="reply-msg">
                                    <p>{item?.content}</p>
                                  </div>
                                  <div>
                                    <p>...</p>
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
                              src="../images/doctor-dashboard/sample-doc.svg"
                              alt="Reviewer"
                            />
                            <div>
                              <h4>{items?.reviewer_name}</h4>
                              <p>{t("wallet.date")}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-4 p-2">
                <div className="calendar-rating-display">
                  <div className="trustRight">
                    <div className="trustScore">
                      <h5> {t("dashboard.my-trust-score")}</h5>
                      <div className="score">
                        <img
                          src="../images/doctor-dashboard/star.png"
                          className="img-fluid"
                        />
                        <div className="scoreData">
                          {totalReviewSum / reviewData?.length}
                        </div>
                      </div>
                    </div>
                    <div className="trustRate">
                      <div className="rate">{reviewData?.length}</div>
                      {t("dashboard.reviews")}
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
