import React, { useEffect, useState } from "react";
import MyCalendar from "./MyCalendar";
import "./dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointmentFormattedDate,
  getFormattedDate,
  getTime,
} from "../../../utils/common";
import { showToast } from "../../../utils/toast";
import {
  fetchData,
  postData,
  putData,
  updateApointmentData,
  updateData,
} from "../../../hooks/services/services";
import {
  getDoctorDasboardFailure,
  getDoctorDasboardRequest,
  getDoctorDasboardSuccess,
} from "../../../redux/actions/doctor/doctorDashboardAction";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import InputField from "../../../components/form/InputField";

const AppointmentList = () => {
  const { t } = useTranslation("appointment-list");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sampleImage = "../images/sample.png";
  const isProfileData = useSelector((state) => state?.userProfile?.userProfile);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  const [appointmentType, setAppointmentType] = useState("Planned");
  const [scheduledAppointments, allScheduledAppointments] = useState();
  const [clickedDate, setClickedDate] = useState(new Date());
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [modelDeclineOpen, setModelDeclineOpen] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [showThirdModal, setShowThirdModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [dateValue, setDateValue] = useState({});
  const [availableSlots, setAvailableSlots] = useState();
  const [bookedSlots, setBookedSlots] = useState();
  const [currentView, setCurrentView] = useState();
  const [confirmAppointmentResponse, setConfirmAppointmentResponse] =
    useState();
  const [currentSelectedAppointment, setCurrentSelectedAppointment] =
    useState();
  const [pastAppointments, setPastAppointments] = useState([]);
  const [futureAppointments, setFutureAppointments] = useState([]);

  const currentDate = new Date(); // Get current date and time
  const pastAppointments1 = [];
  const futureAppointments1 = [];

  useEffect(() => {
    if (currentView?.startDate) {
      getPatientAppointments();
      getDoctorDashboardCalendar();
    }
  }, [currentView]);

  useEffect(() => {
    getAppointmentBookedSlots();
  }, [appointmentType, clickedDate]);

  useEffect(() => {
    getAppointmentPlannedSlots();
  }, [bookedSlots]);

  useEffect(() => {
    const appointmentExists = (appointments, appointment) => {
      return appointments.some(
        (existingAppointment) => existingAppointment.id === appointment.id
      ); // Assuming each appointment has a unique 'id' field
    };
    scheduledAppointments?.forEach((appointment) => {
      const appointmentDate = new Date(appointment?.date); // Convert date_time to a Date object
      if (appointment?.status == "Completed") {
        if (!appointmentExists(pastAppointments1, appointment)) {
          pastAppointments1.push(appointment); // Add to pastAppointments only if not a duplicate
        }
      } else {
        if (
          appointment?.status != "Cancelled" &&
          appointment?.status != "Declined" &&
          !appointmentExists(futureAppointments1, appointment) // Add to futureAppointments only if not a duplicate
        ) {
          futureAppointments1.push(appointment);
        }
      }
    });
    setFutureAppointments(futureAppointments1);
    setPastAppointments(pastAppointments1);
  }, [scheduledAppointments]);

  const getPatientAppointments = async () => {
    const startDate = getAppointmentFormattedDate(currentView?.startDate);
    const endDate = getAppointmentFormattedDate(currentView?.endDate);
    try {
      const response = await fetchData(
        `doctors/doctor-booked-appointment/?doctor_user_id=${isProfileData?.id}&start_date=${startDate}&end_date=${endDate}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      allScheduledAppointments(responseData?.data);
    } catch (error) {
      console.log("error", error?.message);
    }
  };

  const handleRadioChange = (e) => {
    setAppointmentType(e?.target?.value);
  };

  const getAppointmentPlannedSlots = async () => {
    try {
      const response = await fetchData(
        `doctors/get-all-slots/?doctor_user_id=${isProfileData?.id}`,
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
          isProfileData?.id
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

  const handleOpenSecondModal = () => {
    if (!selectedTimeSlot) {
      showToast("Please select the slot first", "info");
      return;
    }
    setShowFirstModal(false);
    setShowSecondModal(true);
  };

  const closeFirstModal = () => {
    setShowFirstModal(false);
  };

  const closeSecondModal = () => {
    setShowSecondModal(false);
  };

  const handleDateClick = (date) => {
    setClickedDate(date);
    setDateValue(getAppointmentFormattedDate(date)); // Update the clicked date in the parent
  };

  const selectedAppointment = (item) => {
    setCurrentSelectedAppointment(item);
    setShowFirstModal(true);
  };

  const cancelAppointmentModel = (item) => {
    setCurrentSelectedAppointment(item);
    setModelDeclineOpen(true);
  };

  const handleTimeChange = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const rescheduledAppointment = async () => {
    try {
      const payload = {
        appointment_id: currentSelectedAppointment?.id,
        new_slot: selectedTimeSlot,
        date: getAppointmentFormattedDate(clickedDate),
      };
      const response = await updateData(
        "doctors/appointment/reschedule/",
        JSON.stringify(payload)
      ); // Call the API service
      if (response.status == 200) {
        let responseData = await response.json();
        setSelectedTimeSlot("");
        getAppointmentBookedSlots();
        getPatientAppointments();
        setShowSecondModal(false);
        setShowThirdModal(true);
      }
    } catch (error) {
      setShowSecondModal(false);
      setShowThirdModal(true);
    }
  };

  const getDoctorDashboardCalendar = async () => {
    const startDate = getAppointmentFormattedDate(currentView?.startDate);
    const endDate = getAppointmentFormattedDate(currentView?.endDate);
    getDoctorDasboardRequest();
    try {
      const response = await fetchData(
        `dashboard/?start_date=${startDate}&end_date=${endDate}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      dispatch(getDoctorDasboardSuccess(responseData));
    } catch (error) {
      dispatch(getDoctorDasboardFailure(error.message));
    }
  };

  const generateMeetintLink = async (appointment) => {
    try {
      const payload = {
        appointment_id: appointment?.id,
        patient_user_id: appointment?.patient?.id,
        doctor_user_id: appointment?.doctor?.id,
      };
      await postData(`video-call/meeting-link/`, payload);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const confirmAppointment = async (appointment, status) => {
    setCurrentSelectedAppointment(appointment);
    try {
      const payload = {
        appointment_id: appointment?.id,
        status: status,
      };
      const response = await putData(
        `doctors/book-and-get-appointment/`,
        JSON.stringify(payload)
      );
      if (response?.status === 200) {
        let responseData = await response.json();
        setConfirmAppointmentResponse(responseData?.data);
        getDoctorDashboardCalendar();
        getPatientAppointments();
        setConfirmationModal(true);
        setSelectedTimeSlot("");
        generateMeetintLink(appointment);
        setModelDeclineOpen(false);
        showToast(responseData?.message, "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <>
      <div class="rightContent">
        <div class="drCalender">
          <div class="tabPrt">
            <Link to="/calendar-view" className="bg-green">
              {t("drawer.calendar")}
            </Link>
            <Link to="/calender-appointment-list" className="bg-orange">
              {t("dashboard.list")}
            </Link>
          </div>
          <div class="appointmentList bg-white-transparent h-100">
            <div class="appointmentListAll">
              {futureAppointments.length < 0 && (
                <h3>{t("appointment-list.no-upcoming-appointments")}</h3>
              )}

              <div className="futureApp">
                <h5 class="smallhead">{t("appointment-list.upcoming")}</h5>
                {futureAppointments?.length > 0 ? (
                  (() => {
                    // Filtering appointments based on conditions
                    const filteredAppointments = futureAppointments.filter(
                      (item) =>
                        item?.status === "Confirmed" ||
                        (item?.status === "Rescheduled" &&
                          item?.rescheduled_by === "Doctor") ||
                        item?.status === "Pending" ||
                        (item?.status === "Rescheduled" &&
                          item?.rescheduled_by === "Patient")
                    );

                    return filteredAppointments.length > 0 ? (
                      filteredAppointments.map((item) => (
                        <div key={item.id}>
                          {item?.status === "Confirmed" ||
                          (item?.status === "Rescheduled" &&
                            item?.rescheduled_by === "Doctor") ? (
                            <div
                              className="appointmentBox  reschedule_pendding"
                              style={{ backgroundColor: "honeydew" }}
                            >
                              <div className="first">
                                <div className="imgPrts">
                                  <img
                                    src={
                                      item?.patient?.profile_picture ||
                                      sampleImage
                                    }
                                    className="img-fluid"
                                  />
                                  <p>{item?.patient?.name}</p>
                                </div>
                                <a href="#">Review medical history</a>
                              </div>
                              <div className="second">
                                <button
                                  type="button"
                                  className="transparent_blue_lg"
                                  // onClick={() =>
                                  //   confirmAppointment(item, "Cancelled")
                                  // }
                                  onClick={() =>
                                    cancelAppointmentModel(item, "Cancelled")
                                  }
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="blue_lg"
                                  onClick={() => selectedAppointment(item)}
                                >
                                  RESCHEDULE
                                </button>
                              </div>
                              <div className="third">
                                <div className="clockCalenderPrts w-100">
                                  <img src="/images/doctor-dashboard/dark-clock.svg" />
                                  <span>{item?.slot}</span>
                                </div>
                                <div className="clockCalenderPrts w-100">
                                  <img src="/images/doctor-dashboard/dark-calender.svg" />
                                  <span>{getFormattedDate(item.date)}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="appointmentBox reschedule " style={{ backgroundColor: "honeydew" }}>
                              <div className="first">
                                <div className="imgPrts">
                                  <img
                                    src={
                                      item?.patient?.profile_picture ||
                                      sampleImage
                                    }
                                    className="img-fluid"
                                  />
                                  <p>{item.patient?.name}</p>
                                </div>
                                <a href="#">Review medical history</a>
                              </div>
                              <div className="fourth">
                                <div className="d-flex gap-2 justify-content-center">
                                  <button
                                    type="button"
                                    className="blue_btn"
                                    onClick={() =>
                                      confirmAppointment(item, "Confirmed")
                                    }
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    className="transparent_btn"
                                    onClick={() =>
                                      cancelAppointmentModel(item, "Cancelled")
                                    }
                                  >
                                    Decline
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  className="blue_lg"
                                  onClick={() => selectedAppointment(item)}
                                >
                                  RESCHEDULE
                                </button>
                              </div>
                              <div className="third">
                                <div className="clockCalenderPrts w-100">
                                  <img src="/images/doctor-dashboard/dark-clock.svg" />
                                  <span>{item?.slot}</span>
                                </div>
                                <div className="clockCalenderPrts w-100">
                                  <img src="/images/doctor-dashboard/dark-calender.svg" />
                                  <span>{getFormattedDate(item.date)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="treatmentContainer">
                        <div className="no-appointments">
                          No Appointments available
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="treatmentContainer">
                    <div className="no-appointments">
                      {t("appointment-list.no-appointments-available")}:
                    </div>
                  </div>
                )}
              </div>
              <h5 class="smallhead mt-5"> {t("appointment-list.recent")}:</h5>
              <div className="pastApp">
                {pastAppointments?.length > 0 ? (
                  pastAppointments?.map((appointment) => {
                    return (
                      <div class="appointmentBox reschedule_done">
                        <div class="first">
                          <div class="imgPrts">
                            <img
                              src={
                                appointment?.patient?.profile_picture
                                  ? appointment?.patient?.profile_picture
                                  : sampleImage
                              }
                              class="img-fluid"
                            />
                            <p>{appointment?.patient?.name}</p>
                          </div>
                          <a href="#">
                            {" "}
                            {t("calendar-view.review-medical-history")}:
                          </a>
                        </div>
                        <div class="second">
                          <button type="button" class="transparent_blue_lg">
                            {t("appointment-list.records")}:
                          </button>
                          <button type="button" class="blue_lg">
                            {t("appointment-list.consultation-report")}:
                          </button>
                        </div>
                        <div class="third">
                          <div class="clockCalenderPrts w-100">
                            <img src="/images/doctor-dashboard/dark-clock.svg" />
                            <span>{appointment?.slot}</span>
                          </div>
                          <div class="clockCalenderPrts w-100">
                            <img src="/images/doctor-dashboard/dark-calender.svg" />
                            <span>{getFormattedDate(appointment.date)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="treatmentContainer">
                    <div className="no-appointments">
                      {t("appointment-list.no-appointments-available")}:
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div class="calenderPart">
              <div class="calenderDetail border-radius-20">
                <div class="responsive-iframe-container large-container">
                  <MyCalendar
                    events={false}
                    onDateClick={handleDateClick}
                    setCurrentView={setCurrentView}
                  />
                </div>
              </div>
            </div>
            {/* <!-- Modal --> */}
            <Modal
              show={confirmationModal}
              backdrop="static"
              keyboard={false}
              onHide={() => setConfirmationModal(false)}
              size="lg"
            >
              <Modal.Header className="text-center" closeButton>
                <Modal.Title id="exampleModalLabel" className="w-100">
                  <h5 className="modal-title mx-auto">
                    {" "}
                    {t("appointment-list.appointment-details")}
                  </h5>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div class="appointPopup">
                  <div class="status align-items-center">
                    <div class="left">{t("wallet.status")}: </div>
                    <div class="statusFinal text-confirmed">
                      {confirmAppointmentResponse?.status}
                    </div>
                  </div>
                  <div class="status">
                    <div class="left">{t("prescription.patient")}: </div>
                    <div class="img-parallel">
                      <img
                        src={
                          confirmAppointmentResponse?.patient?.profile_picture
                            ? confirmAppointmentResponse?.patient
                                ?.profile_picture
                            : sampleImage
                        }
                        class="img-fluid"
                      />
                      <p>{confirmAppointmentResponse?.patient?.name}</p>
                    </div>
                    <div class="linkPart">
                      <a href="#" class="linking text-mainblue">
                        {t("appointment-list.view-profile")}
                      </a>
                      <a href="#" class="linking text-mainblue">
                        {t("appointment-list.view-profile")}
                      </a>
                    </div>
                  </div>
                  <div class="status">
                    <div class="left">{t("appointment-list.time")}: </div>
                    <div class="timing">
                      <div class="clockCalenderPrts w-100">
                        <img src="/images/doctor-dashboard/dark-clock.svg" />
                        <span>{confirmAppointmentResponse?.slot}</span>
                      </div>
                      <div class="clockCalenderPrts w-100">
                        <img src="/images/doctor-dashboard/dark-calender.svg" />
                        <span>
                          {getFormattedDate(confirmAppointmentResponse?.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="rescduleBtns">
                    <button type="button" class="transparent_blue_lg">
                      {t("common.cancel")}
                    </button>
                    <button
                      type="button"
                      class="blue_lg"
                      onClick={() => {
                        setShowFirstModal(true);
                        setConfirmationModal(false);
                      }}
                    >
                      {t("appointment-list.reschedule")}
                    </button>
                  </div>

                  <p class="text-center mb-1 mt-3">
                    {t("appointment-list.virtual-office-rem")}
                  </p>
                  <div class="text-mainblue font-20 text-center">
                    {t("appointment-list.add-reminder")}
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            {/* <!-- Modal --> */}
            <Modal
              show={showFirstModal}
              backdrop="static"
              keyboard={false}
              onHide={closeFirstModal}
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
                              <label htmlFor={`time-${index}`}>
                                {slot?.slot}
                              </label>
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
                          onClick={handleOpenSecondModal}
                        >
                          set the times
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

            {/* <!-- Modal --> */}
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
                          {t("appointment-list.reschedule-appointment-with")}{" "}
                          <span class="text-mainblue">
                            {currentSelectedAppointment?.patient?.name}
                          </span>{" "}
                          {t("appointment-list.for")}:
                        </p>
                        <div class="d-flex align-items-center justify-content-center gap-4 my-3">
                          <span>
                            {selectedTimeSlot
                              ? selectedTimeSlot
                              : getTime(currentSelectedAppointment?.date_time)}
                          </span>
                          <span>
                            {dateValue
                              ? dateValue
                              : getFormattedDate(
                                  currentSelectedAppointment?.date_time
                                )}
                          </span>
                        </div>
                      </div>
                      <div class="d-flex gap-2 justify-content-center">
                        <button
                          type="button"
                          class="blue_btn"
                          onClick={rescheduledAppointment}
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

            {/* <!-- Modal --> */}
            <Modal
              show={showThirdModal}
              backdrop="static"
              keyboard={false}
              onHide={() => setShowThirdModal(false)}
              size="lg"
            >
              <div class="modal-content">
                <div class="modal-header border-0 justify-content-between">
                  <h5 class="modal-title text-center" id="exampleModalLabel">
                    <img src="/images/doctor-dashboard/Info.svg" />
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    onClick={() => {
                      setShowThirdModal(false);
                    }}
                  ></button>
                </div>
                <div class="modal-body pt-0">
                  <div class="appointPopup pt-0">
                    <div class="confirmTime">
                      <p class="para font-20 text-center mb-4">
                        {t("appointment-list.receive-notification")}
                      </p>
                    </div>
                    <div class="d-flex gap-2 justify-content-center">
                      <button
                        type="button"
                        class="transparent_btn"
                        onClick={() => {
                          setShowThirdModal(false);
                        }}
                      >
                        {t("appointment-list.ok")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
            <Modal
              show={modelDeclineOpen}
              backdrop="static"
              keyboard={false}
              onHide={() => setModelDeclineOpen(false)}
              size="lg"
              centered
            >
              <div class="modal-content">
                <div class="modal-header border-0 justify-content-between">
                  <h5 class="modal-title text-center" id="exampleModalLabel">
                    <img src="/images/doctor-dashboard/Info.svg" />
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    onClick={() => {
                      setModelDeclineOpen(false);
                    }}
                  ></button>
                </div>
                <div class="modal-body pt-0">
                  <div class="appointPopup pt-0 appointPopup2">
                    <div class="confirmTime w-100">
                      <h3 class="font-24 text-center mb-5 blue_txt text-bold">
                        Do you want to cancel the appointment?
                      </h3>
                      <ul>
                        <li>Refund Amount if Doctor cancel the Appointement</li>
                        <li>
                          If Patient cancel the appintment with 24 then deduct
                          the 10% Amount and Refund to remaining Amount to
                          Patient.
                        </li>
                        <li>Remaing 10% Amount add to Doctor Wallet</li>
                        <li>
                          If Patient cancel the before 24 hours refund whole
                          Amount and free the doctor slot.
                        </li>
                        <li>
                          Patient/Doctor should not cancel the Appointement with
                          in 12 hours.
                        </li>
                        <li>
                          If any Patient book the appointment with 24 hours,
                          should show the msg "You are booking the appointment
                          with 24 hours, if you will canle the 10% Amount will
                          be decduted"
                        </li>
                        <li>
                          Send the mail to - refund@my-health.today for any
                          refund{" "}
                        </li>
                      </ul>
                    </div>
                    <div class="d-flex gap-2 justify-content-center mt-5">
                      <button
                        type="button"
                        class="transparent_btn"
                        onClick={() => {
                          confirmAppointment(
                            currentSelectedAppointment,
                            "Cancelled"
                          );
                        }}
                      >
                        save
                      </button>
                      <button
                        type="button"
                        class="transparent_btn"
                        onClick={() => {
                          setModelDeclineOpen(false);
                        }}
                      >
                        cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentList;
