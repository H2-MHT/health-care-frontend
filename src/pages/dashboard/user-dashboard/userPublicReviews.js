import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { fetchData } from "../../../hooks/services/services";
import { Loader } from "../../../components/ui/loader/loader";
import { reviewRating } from "../../../utils/constants";

const DoctorPublicReView = ({
  setTotalReviewSum,
  reviewData,
  setReviewData,
}) => {
  const navigate = useNavigate();
  const [reviewRepliesMap, setReviewRepliesMap] = useState({}); // Store replies per review
  const [loading, setLoading] = useState(false);
  
  const [ratingCounts, setRatingCounts] = useState(reviewRating);


  

  const getAllReviewsData = async () => {
    setLoading(true);
    try {
      const response = await fetchData("clinics/clinic-reviews/", navigate);
      if (!response.ok)
        throw new Error("Failed to fetch data from the server.");

      const responseData = await response.json();
      setReviewData(responseData);
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  const getReviewsData = async (reviewId, event) => {
    event?.preventDefault();
    try {
      const response = await fetchData(
        `clinics/clinic-reviews/${reviewId}/replies/`,
        navigate
      );
      if (!response.ok)
        throw new Error("Failed to fetch replies from the server.");

      const responseData = await response.json();
      setReviewRepliesMap((prev) => ({ ...prev, [reviewId]: responseData })); // Store replies for the specific review
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getAllReviewsData();
  }, []);

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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="right">
          <div className="publicViewMain bg-white border-radius-20 px-2">
            <div className="row">
              <Swiper
                slidesPerView={3}
                spaceBetween={10}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Pagination, Navigation]}
              >
                {reviewData?.map((review) => (
                  <SwiperSlide>
                    <div className="col-md-12" key={review.id}>
                      <div className="reviewItems p-0">
                        <div className="reviewBox">
                          <div className="ratingstar">
                            <img
                              src={`../images/doctor-dashboard/${
                                review.rating === 5
                                  ? "../greenstarGrp.webp"
                                  : review.rating === 4
                                  ? "../yellowstarGrp.webp"
                                  : review.rating === 3
                                  ? "../orangestarGrp.webp"
                                  : review.rating === 2
                                  ? "../darkorangestarGrp.webp"
                                  : "redstarGrp.webp"
                              }`}
                              alt={`star-${review.rating}`}
                              style={{ width: "150px" }}
                            />
                          </div>
                          <div className="reviewTitleMain">
                            <h5>Review title</h5>
                            <h6 className="review-para">{review.content}</h6>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mt-4">
                            <div
                              className="reply-text"
                              style={{ cursor: "pointer" }}
                              onClick={(e) => getReviewsData(review.id, e)}
                            >
                              {review?.replies?.length} Replies
                            </div>
                          </div>
                          {reviewRepliesMap[review.id] &&
                            reviewRepliesMap[review.id].map((reply, index) => (
                              <div className="reviewName" key={index}>
                                <img
                                  src="../images/doctor-dashboard/sample-doc.svg"
                                  alt="Reviewer"
                                />
                                <div className="reply-msg">
                                  <p>{reply.content}</p>
                                </div>
                              </div>
                            ))}

                          <div className="row p-2"></div>

                          <div className="reviewName">
                            <img
                              src="../images/doctor-dashboard/sample-doc.svg"
                              alt="Reviewer"
                            />
                            <div>
                              <h4>{review.doctor_name}</h4>
                              <p>Date</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorPublicReView;
