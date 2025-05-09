import React, { useEffect, useState } from "react";
import MyCalendar from "./MyCalendar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getAppointmentFormattedDate,
  getFormattedDate,
} from "../../../utils/common";
import Image from "../../../components/form/Image";
import { useTranslation } from "react-i18next";

import { fetchData } from "../../../hooks/services/services";
import MeetVideoCall from "../doctorChat/MeetVideoCall";
import { Modal } from "react-bootstrap";
import CommonModal from "../../../components/form/Modal";
import { API_URL } from "../../../hooks/services/apiUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

function CalendarView() {
  const { t } = useTranslation("calendar-view");
  const navigate = useNavigate();
  const { search } = useLocation();
  const [clickedDate, setClickedDate] = useState(null);
  const [appointmentList, setAppointmentList] = useState();
  const { user } = useSelector((state) => state.auth);
  const [currentView, setCurrentView] = useState();
  const isProfileData = useSelector((state) => state?.userProfile?.userProfile);
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (currentView?.startDate) getPatientAppointments();
  }, [currentView]);

  useEffect(() => {
    if (search?.includes("channel")) {
      const channel = search.split("=")[1];
      getAppointmentData(channel);
    }
  }, [search]);

  const getAppointmentData = async (link) => {
    try {
      const response = await fetchData(
        `video-call/user-info/?channel_name=${link}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      setSelectedAppointment(responseData?.data[0]);
      setVideoModal(true);
    } catch (error) {
      console.log("error", error?.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getMeetingUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const getMeetingUrl = () => {
    let url = "calendar-view/";
    if (user === "Doctor") {
      url = "calendar-view/";
    } else {
      url = "patient/calendar-view/";
    }
    const meetingUrl = `${API_URL}/${url}?${
      selectedAppointment?.meeting_link?.split("?")[1]
    }`;
    return meetingUrl;
  };

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
      setAppointmentList(responseData?.data);
      const events = responseData?.data?.map((item) => {
        let a = `${item?.date}T${item?.slot?.split("-")[0]?.trim()}:00.000Z`;
        return {
          title: item?.patient?.name,
          date: a,
          appointment_id: item?.id,
          extendedProps: {
            meetingLink: item?.meeting_link,
            data: item,
          },
        };
      });
      setScheduledEvents(events);
    } catch (error) {
      console.log("error", error?.message);
    }
  };

  const handleEventClick = (clickInfo) => {
    let appointment = clickInfo.event.extendedProps;
    if (appointment) {
      setSelectedAppointment(appointment?.data);
      setVideoModal(true);
    }
  };

  const handleDateClick = (date) => {
    setClickedDate(date); // Update the clicked date in the parent
  };

  const getForm = (appointmentd) => {
    const appointment = appointmentd;
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h3 style={{ marginBottom: "10px", color: "#333" }}>
          You're invited to a video consultation
        </h3>

        <p style={{ fontSize: "16px", color: "#666" }}>
          Please review the meeting details below and click the button to join.
        </p>
        <div style={{ display: "inline-grid" }}>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "15px 20px",
              margin: "20px auto",
              borderRadius: "8px",
              boxShadow: "0 0 8px rgba(0,0,0,0.1)",
              display: "inline-block",
              textAlign: "left",
              minWidth: "280px",
            }}
          >
            <p>
              <strong>Date:</strong> {getFormattedDate(appointment?.date)}
            </p>
            <p>
              <strong>Time:</strong> {appointment?.slot}
            </p>
            <div style={{ marginTop: "10px" }}>
              <strong
                style={{ display: "block", marginBottom: "5px", color: "#444" }}
              >
                Participants:
              </strong>
              <div style={{ display: "grid", fontSize: "15px", color: "#555" }}>
                <span>👨‍⚕️ {appointment?.doctor?.name}</span>
                <span>👨‍⚕️ {appointment?.patient?.name}</span>
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span style={{ wordBreak: "break-all", color: "#007bff" }}>
              {getMeetingUrl()}
            </span>
            <button
              onClick={handleCopy}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                color: "grey",
              }}
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>{" "}
          <button
            onClick={() => {
              setShowModal(true);
              setVideoModal(false);
            }}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Join Video Call
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="rightContent rightsidefull">
      <div className="drCalender">
        <div className="tabPrt">
          <Link to="/calendar-view" class="bg-green">
            {t("drawer.calendar")}
          </Link>
          <Link to="/calender-appointment-list" class="bg-orange">
            {t("dashboard.list")}
          </Link>
        </div>
        <div className="calenderInner">
          <div className="calenderPart">
            <div className="calenderDetail border-radius-20">
              <div className="responsive-iframe-container large-container">
                <MyCalendar
                  events={true}
                  onDateClick={handleDateClick}
                  onEventClick={handleEventClick}
                  isCalendarView={true}
                  setCurrentView={setCurrentView}
                  eventList={scheduledEvents}
                />
                <Modal
                  show={showModal}
                  centered
                  className="videocallMain"
                  backdrop="static"
                >
                  <MeetVideoCall
                    selectedAppointment={selectedAppointment}
                    showModal={showModal}
                    setShowModal={setShowModal}
                  />
                </Modal>
                <CommonModal
                  size="lg"
                  show={videoModal}
                  title="Ready to join?"
                  body={getForm(selectedAppointment)}
                  onHide={() => setVideoModal(false)}
                  className="prescriptionModal"
                ></CommonModal>
              </div>
            </div>
          </div>
          {appointmentList?.length > 0 ? (
            <div
              className={`appointmentCard ${
                appointmentList?.length > 5 ? "appList" : ""
              }`}
            >
              {appointmentList?.map((item) => {
                return (
                  <div className="cardAppoint" key={item?.id}>
                    <div className="cardTop">
                      <div className="imgPrts w-55">
                        <Image
                          src={item?.patient?.profile_picture}
                          className="img-fluid"
                        ></Image>
                        <p>{item?.patient?.name}</p>
                      </div>
                      <div className="clockCalenderPrts w-45">
                        <img src="/images/doctor-dashboard/dark-clock.svg" />
                        <span>{item?.slot}</span>
                      </div>
                    </div>
                    <div className="cardBottom mw-100 gap-4 flex-nowrap">
                      <a href="#" className="w-55">
                        {t("calendar-view.review-medical-history")}
                      </a>
                      <div className="clockCalenderPrts w-45">
                        <img src="/images/doctor-dashboard/dark-calender.svg" />
                        <span>{getFormattedDate(item?.date)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="appointmentCard">
              <div className="cardAppoint">
                {t("calendar-view.no-appointments-found")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
