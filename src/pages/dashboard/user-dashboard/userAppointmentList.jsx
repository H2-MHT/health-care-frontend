import React, { useEffect, useState } from "react";
import MyCalendar from "../doctor-dashboard/MyCalendar";
import "../doctor-dashboard/dashboard.css";
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
import ReviewModel from "./reviewModel";
import { InputField } from "../../../components/form/InputField";
import { Flex } from "antd";
import AllDoctorList from "./bookAppointmenet/allDoctorList";
import { useTranslation } from "react-i18next";

const UserAppointmentList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isProfileData = useSelector((state) => state?.userProfile?.userProfile);
  const [selectedTime, setSelectedTime] = useState();
  const [bookedSlots, setBookedSlots] = useState();
  const [availableSlots, setAvailableSlots] = useState();
  const [modelOpen, setModelOpen] = useState(false);
  const [appointmentType, setAppointmentType] = useState("Planned");
  const [scheduledSelectedTime, setScheduledSelectedTime] = useState();
  const [clickedDate, setClickedDate] = useState(new Date());
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [currentView, setCurrentView] = useState();
  const [showThirdModal, setShowThirdModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [recentAppointmentId, setRecentAppointmentId] = useState(null);
  const [dateValue, setDateValue] = useState("");
  const [scheduledAppointments, allScheduledAppointments] = useState();
  const [pastAppointments, setPastAppointments] = useState([]);
  const [futureAppointments, setFutureAppointments] = useState([]);
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [confirmAppointmentResponse, setConfirmAppointmentResponse] =
    useState();
  const [currentSelectedAppointment, setCurrentSelectedAppointment] =
    useState();
  const sampleImage = "../images/sample.png";

  const pastAppointments1 = [];
  const futureAppointments1 = [];

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

  useEffect(() => {
    if (currentView?.startDate && currentView?.endDate) {
      getPatientAppointments();
    }
  }, [currentView]);

  useEffect(() => {
    if (currentSelectedAppointment) getAppointmentBookedSlots();
  }, [appointmentType, clickedDate, currentSelectedAppointment]);

  useEffect(() => {
    if (currentSelectedAppointment) getAppointmentPlannedSlots();
  }, [bookedSlots, currentSelectedAppointment]);

  const handleRadioChange = (e) => {
    setAppointmentType(e?.target?.value);
  };

  const handleOpenSecondModal = () => {
    setShowFirstModal(false);
    setShowSecondModal(true);
  };
  const closeFirstModal = () => {
    setShowFirstModal(false);
  };

  const getRecentDoctorlist = (item) => {
    console.log(">>>>>>>>>>>>>hhh", item);
    setRecentAppointmentId(item?.doctor?.id);
    setModelOpen(true);
  };

  const closeSecondModal = () => {
    setShowSecondModal(false);
  };

  const handleDateClick = (date) => {
    setClickedDate(date);
    setDateValue(getAppointmentFormattedDate(date));
  };

  const selectedAppointment = (item) => {
    setCurrentSelectedAppointment(item);
    setShowFirstModal(true);
  };

  const handleTimeChange = (data) => {
    setSelectedTime(data?.id);
    setScheduledSelectedTime(data?.timeRange?.split("-")[0]);
    setSelectedTime(data);
  };

  const rescheduledAppointment = async () => {
    try {
      const payload = {
        appointment_id: currentSelectedAppointment?.id,
        new_slot: selectedTime,
        date: getAppointmentFormattedDate(clickedDate),
      };
      const response = await updateData(
        "doctors/appointment/reschedule/",
        JSON.stringify(payload)
      ); // Call the API service
      if (response.status == 200) {
        let responseData = await response.json();
        setSelectedTime();
        getAppointmentBookedSlots();
        getPatientAppointments();
        setShowSecondModal(false);
        setShowThirdModal(true);
      }
    } catch (error) {
      console.log(error);
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
        setConfirmationModal(true);
        getPatientAppointments();
        showToast(responseData?.message, "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const getPatientAppointments = async () => {
    const startDate = getAppointmentFormattedDate(currentView?.startDate);
    const endDate = getAppointmentFormattedDate(currentView?.endDate);
    try {
      const response = await fetchData(
        `doctors/patient-booked-appointment/?patient_user_id=${isProfileData?.id}&start_date=${startDate}&end_date=${endDate}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      setScheduledEvents(responseData?.data);
      allScheduledAppointments(responseData?.data);
    } catch (error) {
      console.log("error", error?.message);
    }
  };

  const getAppointmentPlannedSlots = async () => {
    try {
      const response = await fetchData(
        `doctors/get-all-slots/?doctor_user_id=${currentSelectedAppointment?.doctor?.id}`,
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
          currentSelectedAppointment?.doctor?.id
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

  return (
    <>
      <div class="rightContent rightsidefull">
        <div class="drCalender">
          <div class="tabPrt">
            <Link to="/patient/calender-view" className="bg-green">
              Calendar
            </Link>
            <Link to="/patient/appointment-list" className="bg-orange">
              List
            </Link>
          </div>
          <div class="appointmentList bg-white-transparent h-100">
            <div class="appointmentListAll">
              <h5 class="smallhead">Upcoming</h5>
              <div className="futureApp">
                {futureAppointments?.length > 0 ? (
                  futureAppointments?.map((item) => {
                    return (
                      <>
                        {(item?.status == "Confirmed" ||
                          (item?.status == "Rescheduled" &&
                            item?.rescheduled_by == "Patient")) && (
                          <div
                            class="appointmentBox reschedule_pendding"
                            style={{ backgroundColor: "honeydew" }}
                          >
                            <div class="first">
                              <div class="imgPrts">
                                <img
                                  src={
                                    item?.doctor?.profile_picture
                                      ? item?.doctor?.profile_picture
                                      : sampleImage
                                  }
                                  class="img-fluid"
                                />
                                <p>{item?.doctor?.name}</p>
                              </div>
                              {/* <a onClick={() => getRecentDoctorlist(item)}>
                                {t("calendar-view.review-medical-history")}
                              </a> */}
                            </div>
                            <div className="second">
                              <button
                                type="button"
                                className="transparent_blue_lg"
                                onClick={() =>
                                  confirmAppointment(item, "Cancelled")
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
                            <div class="third">
                              <div class="clockCalenderPrts w-100">
                                <img src="/images/doctor-dashboard/dark-clock.svg" />
                                <span>{item.slot}</span>
                              </div>
                              <div class="clockCalenderPrts w-100">
                                <img src="/images/doctor-dashboard/dark-calender.svg" />
                                <span>{getFormattedDate(item.date)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        {(item?.status === "Pending" ||
                          (item?.status === "Rescheduled" &&
                            item?.rescheduled_by === "Doctor")) && (
                          <div class="appointmentBox reschedule" style={{ backgroundColor: "honeydew" }}>
                            <div class="first">
                              <div class="imgPrts">
                                <img
                                  src={
                                    item?.doctor?.profile_picture
                                      ? item?.doctor?.profile_picture
                                      : sampleImage
                                  }
                                  class="img-fluid"
                                />
                                <p>{item?.doctor?.name}</p>
                              </div>
                              {/* <a href="#" onClick={() => setModelOpen(true)}>
                                Review medical history
                              </a> */}
                            </div>
                            <div class="fourth">
                              <div class="d-flex gap-2 justify-content-center">
                                <button
                                  type="button"
                                  class="blue_btn"
                                  onClick={() =>
                                    confirmAppointment(item, "Confirmed")
                                  }
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  class="transparent_btn"
                                  onClick={() =>
                                    confirmAppointment(item, "Cancelled")
                                  }
                                >
                                  Decline
                                </button>
                              </div>
                              <button
                                type="button"
                                class="blue_lg"
                                onClick={() => selectedAppointment(item)}
                              >
                                RESCHEDULE
                              </button>
                            </div>
                            <div class="third">
                              <div class="clockCalenderPrts dark-text w-100">
                                <img src="/images/doctor-dashboard/dark-clock.svg" />
                                <span>{item.slot}</span>
                              </div>
                              <div class="clockCalenderPrts dark-text w-100">
                                <img src="/images/doctor-dashboard/dark-calender.svg" />
                                <span>{getFormattedDate(item.date)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })
                ) : (
                  <div className="futureApp">
                    <div className="treatmentContainer">
                      <div className="no-appointments">
                        No Appointments available
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <h5 class="smallhead mt-5">{t("appointment-list.recent")}</h5>
              <div className="futureApp">
                {pastAppointments?.length > 0 ? (
                  pastAppointments?.map((appointment) => {
                    return (
                      <div class="appointmentBox reschedule_done">
                        <div class="first">
                          <div class="imgPrts">
                            <img
                                  src={
                                    appointment?.doctor?.profile_picture
                                      ? appointment?.doctor?.profile_picture
                                      : sampleImage
                                  }
                                  class="img-fluid"
                                />
                            <p>{appointment.doctor?.name}</p>
                          </div>
                          <a onClick={() => getRecentDoctorlist(appointment)}>
                            {t("calendar-view.review-medical-history")}
                          </a>
                        </div>
                        <div class="second">
                          <button type="button" class="transparent_blue_lg" onClick={() => navigate("/patient/consultationrecordsList")}>
                            {t("appointment-list.records")}
                          </button>
                          <button type="button" class="blue_lg" onClick={()=> navigate(`/patient/consultationreport/${appointment?.id}`)}>
                            {t("appointment-list.consultation-report")}
                          </button>
                        </div>
                        <div class="third">
                              <div class="clockCalenderPrts dark-text w-100">
                                <img src="/images/doctor-dashboard/dark-clock.svg" />
                                <span>{appointment?.slot}</span>
                              </div>
                              <div class="clockCalenderPrts dark-text w-100">
                                <img src="/images/doctor-dashboard/dark-calender.svg" />
                                <span>{getFormattedDate(appointment?.date)}</span>
                              </div>
                            </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="treatmentContainer">
                    <div className="no-appointments">
                      {t("appointment-list.no-appointments-available")}
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
                    {t("appointment-list.appointment-details")}
                  </h5>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div class="appointPopup">
                  <div class="status align-items-center">
                    <div class="left">Status: </div>
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
                      <div class="clockCalenderPrts">
                        <img src="/images/doctor-dashboard/dark-clock.svg" />
                        <span>{confirmAppointmentResponse?.slot}</span>
                      </div>
                      <div class="clockCalenderPrts">
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
                          <label className="mb-0">
                            {" "}
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
                          <label className="mb-0">
                            {t("appointment-manage.urgent-call")}
                          </label>
                        </div> */}
                      </div>
                      <div className="timeScroll">
                        {availableSlots?.length > 0 ? (
                          availableSlots?.map((slot, index) => (
                            <div
                              key={index}
                              className={`calendarInnerTime ${
                                selectedTime === slot ? "active" : ""
                              } ${!slot?.booked ? "" : "enabled-slot"}`}
                              title={`${!slot?.booked ? "Not available" : ""}`}
                            >
                              <input
                                type="radio"
                                name="timeSlot"
                                id={`time-${index}`}
                                value={slot} // Ensure the value is correctly set
                                checked={
                                  selectedTime === slot?.slot ? true : false
                                }
                                disabled={slot?.booked}
                                className="disabled-field"
                                onChange={() => handleTimeChange(slot?.slot)}
                              />
                              <label htmlFor={`time-${index}`}>
                                {slot?.slot}
                              </label>
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
                          onClick={handleOpenSecondModal}
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
                            {currentSelectedAppointment?.doctor?.name}
                          </span>{" "}
                          {t("appointment-list.for")}:
                        </p>
                        <div class="d-flex align-items-center justify-content-center gap-4 my-3">
                          <span>
                            {selectedTime
                              ? selectedTime
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
                  <button type="button" class="btn-close"></button>
                </div>
                <div class="modal-body pt-0">
                  <div class="appointPopup pt-0">
                    <div class="confirmTime">
                      <p class="para font-20 text-center mb-4">
                        You will receive a notification as soon as the doctor
                        confirms the rescheduling
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
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
        <ReviewModel
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          recentAppointmentId={recentAppointmentId}
        />
      </div>
    </>
  );
};

export default UserAppointmentList;
