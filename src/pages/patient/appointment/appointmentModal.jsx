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

const AppointmentModal = ({
  showFirstModal,
  setShowFirstModal,
  selectedDoctorAppointement,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [clickedDate, setClickedDate] = useState(new Date());
  const [appointmentType, setAppointmentType] = useState("Planned");
  const [availableSlots, setAvailableSlots] = useState();
  const [bookedSlots, setBookedSlots] = useState();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [showSecondModal, setShowSecondModal] = useState(false);
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
      const response = await fetchData(
        `doctors/get-all-slots/?doctor_user_id=${selectedDoctorAppointement?.id}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      const today = new Date(clickedDate).toLocaleDateString("en-US", {
        weekday: "short",
      });
      const doctorSchedule = responseData?.data[0]?.schedule;
      let data = doctorSchedule?.[today]?.[appointmentType];
      if (data) {
        data.forEach((slot) => {
          slot.booked = bookedSlots.some((b) => b.slot === slot.slot);
        });
        setAvailableSlots(data);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      console.log("error", error?.message);
    }
  };

  const getAppointmentBookedSlots = async () => {
    try {
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

  const appoinmentSubmit = async (data) => {
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

  const payAppointmentStrip = async () => {
    try {
      const payload = {
        appointment_id: appointmentId,
        doctor_user_id: selectedDoctorAppointement?.id,
        patient_user_id: isProfiledata?.id,
      };

      const response = await postData(
        "doctors/appointment/create-checkout-session/",
        payload
      );

      if (response.status === 200) {
        let responseData = await response.json();

        if (responseData?.session_url) {
          setShowThirdModal(false);
          window.location.href = responseData.session_url;
        } else {
          showToast("Failed to retrieve payment URL", "error");
        }
      } else {
        showToast("Payment session creation failed", "error");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
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
        {console.log(
          ">>>>>>>>>>>>selectedDoctorAppointement",
          selectedDoctorAppointement
        )}
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
                    <label className="mb-0">Planned consultation</label>
                  </div>
                  <div className="radiotype d-flex align-items-center gap-2">
                    <InputField
                      type="radio"
                      name="appointmentType"
                      value="Urgent"
                      checked={appointmentType === "Urgent"}
                      onChange={handleRadioChange}
                    />
                    <label className="mb-0">Urgent call</label>
                  </div>
                </div>
                <div className="timeScroll">
                  {availableSlots?.length > 0 ? (
                    availableSlots?.map((slot, index) => (
                      <div
                        key={index}
                        className={`calendarInnerTime ${
                          selectedTimeSlot === slot ? "active" : ""
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
                    <p>No available slots</p>
                  )}
                </div>
                <div class="setimeBtn">
                  <a
                    href="javascript:void(0)"
                    class="blue_btn"
                    onClick={appoinmentSubmit}
                  >
                    set the time
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
                <h4 class="text-center mb-3">Confirm the time</h4>
                <div class="confirmTime">
                  <p class="para font-20 text-center">
                    You want to reserve the appointment with{" "}
                    <span class="text-mainblue">
                      Dr. {selectedDoctorAppointement?.first_name}{" "}
                      {selectedDoctorAppointement?.last_name}
                    </span>{" "}
                    for:
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
                    Confirm
                  </button>
                  <button
                    type="button"
                    class="transparent_btn"
                    onClick={() => {
                      setShowFirstModal(true);
                      setShowSecondModal(false);
                    }}
                  >
                    Change
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
                Confirm payment
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
                              <input
                                class="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault1"
                              />
                              <label
                                class="form-check-label radio-text"
                                for="flexRadioDefault1"
                              >
                                Add Payment Method
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
                            Secure money transfer using your bank account. Visa,
                            MasterCard, Discover, American Express
                          </div>
                        </div>
                      </div>

                      <div class="payment-method-card bg-white w-100">
                        <div class="cardFirst-row">
                          <div class="d-flex align-items-center">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault1"
                              />
                              <label
                                class="form-check-label radio-text"
                                for="flexRadioDefault1"
                              >
                                ..........9216
                              </label>
                            </div>
                          </div>
                          <div class="acc-img">
                            <div>
                              <img
                                src="../../images/visa.webp"
                                width="40"
                                alt="img"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="cardSecond-row">
                          <div class="pay-card-content">cardSecond-row</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-5">
                  <div class="userPayment">
                    <h5>Resume</h5>
                    <hr />
                    <p>Online consultation</p>
                    <div class="userPaymentBox">
                      <div class="category">
                        <h4>Category:</h4>
                        <h6 class="main-blue-text">
                          {appointmentSummary?.category}
                        </h6>
                      </div>
                      <div class="category">
                        <h4>Date:</h4>
                        <h6>{appointmentSummary?.date}</h6>
                      </div>
                      <div class="category">
                        <h4>Hour:</h4>
                        <h6>{appointmentSummary?.time}</h6>
                      </div>

                      <div class="dashDevider"></div>

                      <div class="category">
                        <h4>Subtotal:</h4>
                        <h6>{appointmentSummary?.subtotal}</h6>
                      </div>
                      <div class="category">
                        <h4>Discount:</h4>
                        <h6>{appointmentSummary?.discount}</h6>
                      </div>

                      <hr />

                      <div class="totalCost">
                        <span>Total:</span>
                        {appointmentSummary?.subtotal}
                      </div>

                      <button
                        type="button"
                        class="blue_btn"
                        onClick={payAppointmentStrip}
                      >
                        Confirm
                      </button>
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
                <p class="fw-bold">Payment was made succesfully</p>
                <h4 class="main-blue-text">Thank you for staying with H-2</h4>
                <p class="para font-20 text-center mb-4">
                  You will receive a notification as soon as the specialist
                  confirms the reservation
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
                  ok
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
            <p class="fw-medium fs-2 mb-2">Appointment confirmed</p>
            <p class="para font-16 text-center mb-3">
              Remember to enter your virtual office 5 minutes before your
              consultation.
            </p>
            <h4
              class="main-blue-text pointer"
              data-bs-toggle="modal"
              data-bs-target="#remindMe"
            >
              Add the reminder?
            </h4>

            <div class="reminderBox">
              <div class="imgPart">
                <img src={selectedDoctorAppointement?.profile_picture} />
              </div>
              <div class="remindcontentPart">
                <div class="left">
                  <h5>
                    Generalist{" "}
                    <span class="main-blue-text">6 years practice</span>
                  </h5>
                  <div class="verified">
                    <img src="../images/batch.svg" />
                    <span class="text-mainblue">
                      Dr. {selectedDoctorAppointement?.first_name}{" "}
                      {selectedDoctorAppointement?.last_name}
                    </span>{" "}
                  </div>
                  <div class="blueLoca d-flex align-items-center gap-2">
                    <img src="../images/mpin-blue.svg" />{" "}
                    <span class="text-mainblue">Leon, France</span>
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
                <li>
                  The “Join appointment” button will be enabled 5 minutes before
                  your appointment.
                </li>
                <li>
                  The specialist will be available at the time of your
                  appointment.
                </li>
                <li class="mb-0">
                  Remember to enable your microphone and camera permissions from
                  your browser.
                </li>
              </ol>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppointmentModal;
