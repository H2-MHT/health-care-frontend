import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputField } from "../../../components/form/InputField";
import { showToast } from "../../../utils/toast";
import { postData } from "../../../hooks/services/services";
import { useTranslation } from "react-i18next";

import { Modal } from "react-bootstrap";

const schema = yup.object().shape({
  reviewTitle: yup.string().required("Review title is required"),
  review: yup
    .string()
    .required("Review is required")
    .min(10, "Review must be at least 10 characters"),
  rating: yup
    .number()
    .required("Rating is required")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

const ReviewModel = ({ setModelOpen, modelOpen, recentAppointmentId, currentSelectedAppointment }) => {
  const { t } = useTranslation();
 
  const {
    register,
    handleSubmit,
    setValue, // 👈 Allows updating the rating in form data
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [rating, setRating] = useState(0); // ⭐ Stores clicked rating

  const onSubmit = async (data) => {
    try {
      const payload = {
        rating: rating,
        title: data?.reviewTitle,
        content: data?.review,
        doctor_user_id: recentAppointmentId,
        appointment_id: currentSelectedAppointment?.id
      };
      const response = await postData(`reviews/review/`, payload);
      if (response.status === 201) {
        const responseJson = await response.json();
        showToast(responseJson?.message, "success");
        reset()
        setModelOpen(false);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <Modal
      show={modelOpen}
      backdrop="static"
      keyboard={false}
      onHide={() => setModelOpen(false)}
      size="lg"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="modal-body">
          <div className="appointPopup">
            <div className="status payment-method-container mt-0">
              <div className="payment-method-card bg-white w-100">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="generate_payment">
                    <div className="bg-white border-radius-20 padding-20">
                      <div className="row g-4">
                        {/* Review Title */}
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>{t("clinic-reviews.review-title")}</label>
                            <InputField
                              type="text"
                              placeholder="Review Title"
                              name="reviewTitle"
                              register={register}
                              error={errors.reviewTitle?.message}
                            />
                          </div>
                        </div>

                        {/* Review */}
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Review</label>
                            <InputField
                              type="text"
                              placeholder="Write your review..."
                              name="review"
                              register={register}
                              error={errors.review?.message}
                            />
                          </div>
                        </div>

                        {/* Star Rating (Click to Replace Image) */}
                        <div className="col-md-12">
                          <span>Rating</span>
                          <div className="reviewFillStar flex">
                            {[...Array(5)].map((_, index) => {
                              const starValue = index + 1;
                              return (
                                <img
                                  key={index}
                                  src={
                                    starValue <= rating
                                      ? "../images/fill-star.webp"
                                      : "../images/star-review.webp"
                                  }
                                  className="w-10 h-10 cursor-pointer transition-all duration-200"
                                  alt={
                                    starValue <= rating
                                      ? "Filled Star"
                                      : "Empty Star"
                                  }
                                  onClick={() => {
                                    setRating(starValue); // Set clicked rating
                                    setValue("rating", starValue); // Update form value
                                  }}
                                />
                              );
                            })}
                          </div>
                          {errors.rating && (
                            <p className="text-danger">
                              {errors.rating.message}
                            </p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <div className="rescduleBtns flex-column mb-2">
                          <button
                            type="submit"
                            className="blue_lg border-0 bg-none"
                          >
                            {t("common.submit")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReviewModel;
