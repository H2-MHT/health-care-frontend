import React, { useEffect, useState } from "react";
import MyCalendar from "./MyCalendar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAppointmentFormattedDate, getFormattedDate, getTime } from "../../../utils/common";
import { getAppointmentList } from "../../../utils/common";
import Image from "../../../components/form/Image";
import { useTranslation } from "react-i18next";

import { fetchData } from "../../../hooks/services/services";

function CalendarView() {
   const{t} = useTranslation("calendar-view");
  const navigate = useNavigate();
  const [clickedDate, setClickedDate] = useState(null);
  const [appointmentList, setAppointmentList] = useState();
  const [events, setEvents] = useState([]);
  let { user } = useSelector((state) => state.auth);
  const doctorDashboard = useSelector((state) => state.doctorDashboard);
  const [currentView, setCurrentView] = useState();
  const isProfileData = useSelector((state) => state?.userProfile?.userProfile);
  const [scheduledEvents, setScheduledEvents] = useState([]);

  useEffect(()=>{
    if(currentView?.startDate)
      getPatientAppointments();
  },[currentView])

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
          let a = `${item?.date}T${item?.slot?.split("-")[0]?.trim()}:00.000Z`
          return {
            title: item?.patient?.name,
            date: a,
          };
        });
        setScheduledEvents(events)
      } catch (error) {
        console.log("error", error?.message);
      }
  };

  const handleDateClick = (date) => {
    setClickedDate(date); // Update the clicked date in the parent
  };

  return (
    <div className="rightContent">
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
                  isCalendarView={true}
                  setCurrentView={setCurrentView}
                  eventList={scheduledEvents}
                />
              </div>
            </div>
          </div>
          {console.log(">>>>>>>>>>>>appointmentList", appointmentList)}
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
