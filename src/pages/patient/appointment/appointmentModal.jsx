import React, { useEffect, useState } from "react";
import MyCalendar from "../../dashboard/doctor-dashboard/MyCalendar";
import { Modal } from "react-bootstrap";
import { InputField } from "../../../components/form/InputField";
import {
  getAppointmentFormatDate,
  getAppointmentFormattedDate,
  getFormattedDate,
} from "../../../utils/common";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchData, postData } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { useTranslation } from "react-i18next";

const AppointmentModal = ({
  showFirstModal,
  setShowFirstModal,
  selectedDoctorAppointement,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("appointment-manage");
  const [clickedDate, setClickedDate] = useState(new Date());
  const [appointmentType, setAppointmentType] = useState("Planned");
  const [availableSlots, setAvailableSlots] = useState();
  const [bookedSlots, setBookedSlots] = useState();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [stripeLink, SetStripeLink] = useState("");
  const [showThirdModal, setShowThirdModal] = useState(false);
  const [showFourthModal, setShowFourthModal] = useState(false);
  const [showFifthModal, setShowFifthModal] = useState(false);
  const [appointmentSummary, setAppointmentSummary] = useState();
  const [appointmentId, setAppointmentId] = useState();
  const [paymentSuccess, setPaymentSuccess] = useState();
  const [paymentFailed, setPaymentFailed] = useState();
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  const dashboardData = useSelector(
    (state) => state?.doctorDashboard?.dashboard
  );

  const handleRadioChange = (e) => {
    setAppointmentType(e?.target?.value);
  };

  useEffect(() => {
    if (selectedDoctorAppointement) {
      getAppointmentBookedSlots();
      getAppointmentPlannedSlots();
    }
  }, [appointmentType, clickedDate, selectedDoctorAppointement]);
  console.log(selectedDoctorAppointement, ">>>>selectedDoctorAppointement");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isSuccess = params.get("status") === "success";
    const isFailed = params.get("status") === "failed";
    if (isSuccess || isFailed) {
      setShowThirdModal(false);
      setShowFourthModal(true);
    }
    setPaymentFailed(isFailed);
    setPaymentSuccess(isSuccess);
  }, []);

  const getAppointmentPlannedSlots = async () => {
    try {
      const today = new Date(clickedDate).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const response = await fetchData(
        `doctors/filter-slots/?doctor_id=${selectedDoctorAppointement?.doctor_id}&weekday=${today}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      const allSlots = responseData?.slots;
      const updatedSlots = allSlots?.map((slot) => {
        const slotStr = `${slot.start_time} - ${slot.end_time}`;
        const matched = bookedSlots.find((b) => b.slot === slotStr);
        return {
          ...slot,
          slot: slotStr,
          booked: matched ? true : false,
        };
      });
      setAvailableSlots(updatedSlots);
    } catch (error) {
      console.log("error", error?.message);
    }
  };

  const getAppointmentBookedSlots = async () => {
    try {
      const today = new Date(clickedDate).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const response = await fetchData(
        `doctors/book-and-get-appointment/?doctor_user_id=${
          selectedDoctorAppointement?.id
        }&date=${getAppointmentFormattedDate(clickedDate)}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      setBookedSlots(responseData?.data);
    } catch (error) {
      console.log("error", error?.message);
    }
  };

  const handleDateClick = (date) => {
    setClickedDate(date);
  };

  const handleTimeChange = (slot) => {
    console.log(">>>>>>slot");
    setSelectedTimeSlot(slot);
  };

  const closeSecondModal = () => {
    setShowSecondModal(false);
  };

  const appoinmentSubmit = async () => {
    if (!selectedTimeSlot) {
      showToast("Please select a time slot first", "error");
      return;
    }

    try {
      const payload = {
        doctor_user_id: selectedDoctorAppointement?.id,
        slot: selectedTimeSlot,
        appointment_type: appointmentType,
        date: getAppointmentFormattedDate(clickedDate),
        patient_user_id: isProfiledata?.id,
      };
      const response = await postData(
        "doctors/book-and-get-appointment/",
        payload
      ); // Call the API service
      if (response.status == 201) {
        let responseData = await response.json();

        SetStripeLink(responseData?.data?.stripe_link);
        setAppointmentId(responseData?.data?.appointment_id);
        setShowFirstModal(false);
        setShowSecondModal(true);
      }
    } catch (error) {
      setShowSecondModal(true);
      getPaymentDetails();
      setShowFirstModal(false);
    }
  };

  useEffect(() => {
    if (appointmentId) getPaymentDetails();
  }, [appointmentId]);

  const getPaymentDetails = async () => {
    console.log(">>>>>>>>appointmentId", appointmentId);
    try {
      const response = await fetchData(
        `doctors/appointment-summary/${appointmentId}/`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      setAppointmentSummary(responseData);
    } catch (error) {}
  };

  return (
    <>
      <Modal
        show={showFirstModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setShowFirstModal(false)}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div class="appointPopup">
            <div class="popupCalnder">
              <div class="calenderPart">
                <div class="calenderDetail border-radius-20">
                  <div class="responsive-iframe-container large-container">
                    <MyCalendar
                      events={false}
                      onDateClick={handleDateClick}
                      minDate={new Date()}
                    />
                  </div>
                </div>
              </div>
              <div class="calenderTime">
                <div className="genderCheck d-flex align-items-center gap-4">
                  <div className="radiotype d-flex align-items-center gap-2">
                    <InputField
                      type="radio"
                      name="appointmentType"
                      value="Planned"
                      checked={appointmentType === "Planned"}
                      onChange={handleRadioChange}
                    />
                    <label className="mb-0">
                      {t("appointment-manage.planned-consultation")}
                    </label>
                  </div>
                  {/* <div className="radiotype d-flex align-items-center gap-2">
                    <InputField
                      type="radio"
                      name="appointmentType"
                      value="Urgent"
                      checked={appointmentType === "Urgent"}
                      onChange={handleRadioChange}
                    />
                    <label className="mb-0">Urgent call</label>
                  </div> */}
                </div>
                <div className="timeScroll">
                  {availableSlots?.length > 0 ? (
                    availableSlots?.map((slot, index) => (
                      <div
                        key={index}
                        className={`calendarInnerTime ${
                          selectedTimeSlot === slot.slot ? "active" : ""
                        } ${!slot?.booked ? "" : "enabled-slot"}`}
                        title={`${!slot?.booked ? "Not available" : ""}`}
                      >
                        <input
                          type="radio"
                          name="timeSlot"
                          id={`time-${index}`}
                          value={slot?.slot} // Ensure the value is correctly set
                          checked={
                            selectedTimeSlot === slot?.slot ? true : false
                          }
                          onChange={() => handleTimeChange(slot?.slot)}
                          disabled={slot?.booked}
                          className="disabled-field"
                        />
                        <label htmlFor={`time-${index}`}>{slot?.slot}</label>
                      </div>
                    ))
                  ) : (
                    <p> {t("appointment-manage.no-available-slots")}</p>
                  )}
                </div>
                <div class="setimeBtn">
                  <a
                    href="javascript:void(0)"
                    class="blue_btn"
                    onClick={appoinmentSubmit}
                  >
                    {t("appointment-list.set-the-time")}
                  </a>
                  <div class="bg-mainblue border-round p-2 d-flex align-items-center justify-content-center">
                    <button
                      type="button"
                      class="btn-close"
                      onClick={() => setShowFirstModal(false)}
                    ></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showSecondModal}
        backdrop="static"
        keyboard={false}
        onHide={closeSecondModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h5 class="modal-title text-center" id="exampleModalLabel">
              <img src="/images/doctor-dashboard/Info.svg" />
            </h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div class="modal-body pt-0">
              <div class="appointPopup pt-0">
                <h4 class="text-center mb-3">
                  {t("appointment-list.confirm-time")}
                </h4>
                <div class="confirmTime">
                  <p class="para font-20 text-center">
                    {t("appointment-list.reserve-appointment")}{" "}
                    <span class="text-mainblue">
                      {t("support.dr")} {selectedDoctorAppointement?.first_name}{" "}
                      {selectedDoctorAppointement?.last_name}
                    </span>{" "}
                    {t("support.for")}
                  </p>
                  <div class="d-flex align-items-center justify-content-center gap-4 my-3">
                    <span>{selectedTimeSlot}</span>
                    <span>{getFormattedDate(clickedDate)}</span>
                  </div>
                </div>
                <div class="d-flex gap-2 justify-content-center">
                  <button
                    type="button"
                    class="blue_btn"
                    onClick={() => setShowThirdModal(true)}
                  >
                    {t("singup.confirm_lable")}
                  </button>
                  <button
                    type="button"
                    class="transparent_btn"
                    onClick={() => {
                      setShowFirstModal(true);
                      setShowSecondModal(false);
                    }}
                  >
                    {t("appointment-list.change")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showThirdModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setShowThirdModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <div class="modal-header border-0">
            <div class="modal-heading-alignment">
              <img src="../../images/Info.svg" />
              <h5 class="modal-title text-left" id="exampleModalLabel">
                {t("appointment-manage.confirm-payment")}
              </h5>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div class="modal-content">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-7">
                  <div class="appointPopup p-0">
                    <div class="status payment-method-container mt-0">
                      <div class="payment-method-card bg-white w-100">
                        <div class="cardFirst-row">
                          <div class="d-flex align-items-center">
                            <div class="form-check">
                              <label
                                class="form-check-label radio-text"
                                for="flexRadioDefault1"
                              >
                                {t("appointment-manage.pay-now")}
                              </label>
                            </div>
                          </div>
                          <div class="acc-img">
                            <div>
                              <img
                                src="../../images/payment-card.webp"
                                width="120"
                                alt="img"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="cardSecond-row">
                          <div class="pay-card-content">
                            {t("appointment-manage.Secure-money")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="userPayment">
                    <h5> {t("wallet.resume")}</h5>
                    <hr />
                    <p> {t("wallet.Online-consultation")}</p>
                    <div class="userPaymentBox">
                      <div class="category">
                        <h4>{t("wallet.category")}:</h4>
                        <h6 class="main-blue-text">
                          {appointmentSummary?.category}
                        </h6>
                      </div>
                      <div class="category">
                        <h4>{t("wallet.date")}:</h4>
                        <h6>{appointmentSummary?.date}</h6>
                      </div>
                      <div class="category">
                        <h4>{t("wallet.hour")}:</h4>
                        <h6>{appointmentSummary?.time}</h6>
                      </div>

                      {/* <div class="dashDevider"></div> */}

                      {/* <div class="category">
                        <h4>{t("wallet.sub-total")}:</h4>
                        <h6>{appointmentSummary?.subtotal}</h6>
                      </div> */}
                      {/* <div class="category">
                        <h4>{t("wallet.discount")}:</h4>
                        <h6>{appointmentSummary?.discount}</h6>
                      </div> */}

                      {/* <hr /> */}

                      {/* <div class="totalCost">
                        <span>{t("wallet.total")}:</span>
                        {appointmentSummary?.subtotal}
                      </div> */}

                      <a
                        type="button"
                        class="blue_btn"
                        href={stripeLink}
                        target="blank"
                      >
                        Pay Now
                        {/* {t("wallet.confirm")} */}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showFourthModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setShowFourthModal(false)}
        size="lg"
      >
        <Modal.Body>
          <div class="modal-body">
            <h5 class="modal-title text-center" id="exampleModalLabel">
              <img src="../images/Info.svg" />
            </h5>
            <button
              type="button"
              class="btn-close"
              onClick={() => setShowFourthModal(false)}
            ></button>
          </div>
          <div class="modal-body pt-0">
            <div class="appointPopup pt-0">
              <div class="confirmTime text-center">
                <p class="fw-bold">{t("wallet.payment-succesfully")}</p>
                <h4 class="main-blue-text"> {t("wallet.for-staying")}</h4>
                <p class="para font-20 text-center mb-4">
                  {t("wallet.receive-notificatio")}
                </p>
              </div>
              <div class="d-flex gap-2 justify-content-center">
                <button
                  type="button"
                  class="blue_btn"
                  onClick={() => {
                    setShowFourthModal(false);
                    setShowFifthModal(true);
                  }}
                >
                  {t("wallet.ok")}
                </button>{" "}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showFifthModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setShowFifthModal(false)}
        size="lg"
        className="modal-dialog-centered"
      >
        <Modal.Body>
          <div class="modal-body">
            <button
              type="button"
              class="btn-close"
              onClick={() => setShowFifthModal(false)}
            ></button>
          </div>
          <div class="confirmTime text-center w-100">
            <p class="fw-medium fs-2 mb-2">
              {t("wallet.appointment-confirmed")}
            </p>
            <p class="para font-16 text-center mb-3">
              {t("wallet.virtual-office")}
            </p>
            <h4
              class="main-blue-text pointer"
              data-bs-toggle="modal"
              data-bs-target="#remindMe"
            >
              {t("wallet.add-reminder")}
            </h4>

            <div class="reminderBox">
              <div class="imgPart">
                <img src={selectedDoctorAppointement?.profile_picture} />
              </div>
              <div class="remindcontentPart">
                <div class="left">
                  <h5>
                    {t("all-doctor-list.generalist")}{" "}
                    <span class="main-blue-text">
                      {t("all-doctor-list.years-practice")}
                    </span>
                  </h5>
                  <div class="verified">
                    <img src="../images/batch.svg" />
                    <span class="text-mainblue">
                      {t("support.dr")} {selectedDoctorAppointement?.first_name}{" "}
                      {selectedDoctorAppointement?.last_name}
                    </span>{" "}
                  </div>
                  <div class="blueLoca d-flex align-items-center gap-2">
                    <img src="../images/mpin-blue.svg" />{" "}
                    <span class="text-mainblue">{t("wallet.leon-france")}</span>
                  </div>
                </div>
                <div class="right">
                  <div class="clockCalenderPrts mb-2">
                    <img src="../images/dark-clock.svg" />
                    <span>{selectedTimeSlot}</span>
                  </div>
                  <div class="clockCalenderPrts">
                    <img src="../images/dark-calender.svg" />
                    <span>{getFormattedDate(clickedDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="remindBlueBox">
              <ol>
                <li>{t("wallet.your-appointment")}</li>
                <li>{t("wallet.specialist-appointment")}</li>
                <li class="mb-0">{t("wallet.microphone-camera")}</li>
              </ol>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppointmentModal;
