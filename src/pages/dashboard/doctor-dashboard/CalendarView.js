import React, { useEffect, useState } from "react";
import MyCalendar from "./MyCalendar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getAppointmentFormattedDate,
  getFormattedDate,
  getTime,
} from "../../../utils/common";
import { getAppointmentList } from "../../../utils/common";
import Image from "../../../components/form/Image";
import { useTranslation } from "react-i18next";

import { fetchData } from "../../../hooks/services/services";
import MeetVideoCall from "../doctorChat/MeetVideoCall";
import { Modal } from "react-bootstrap";
import CommonModal from "../../../components/form/Modal";

function CalendarView() {
  const { t } = useTranslation("calendar-view");
  const navigate = useNavigate();
  const [clickedDate, setClickedDate] = useState(null);
  const [appointmentList, setAppointmentList] = useState();
  const [events, setEvents] = useState([]);
  let { user } = useSelector((state) => state.auth);
  const doctorDashboard = useSelector((state) => state.doctorDashboard);
  const [currentView, setCurrentView] = useState();
  const isProfileData = useSelector((state) => state?.userProfile?.userProfile);
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState();

  useEffect(() => {
    if (currentView?.startDate) getPatientAppointments();
  }, [currentView]);

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
      setSelectedAppointment(appointment);
      setVideoModal(true);
    }
  };

  const handleDateClick = (date) => {
    setClickedDate(date); // Update the clicked date in the parent
  };

  const getForm = () => {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h3>You're invited to join a video consultation</h3>
        <p>If you'd like to join the call, please click the button below.</p>
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
                  body={getForm()}
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
