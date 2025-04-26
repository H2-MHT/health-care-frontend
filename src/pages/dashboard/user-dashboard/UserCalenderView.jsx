import React, { useEffect, useMemo, useState } from "react";
import MyCalendar from "../doctor-dashboard/MyCalendar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAppointmentFormattedDate, getFormattedDate, getTime } from "../../../utils/common";
import { getAppointmentList } from "../../../utils/common";
import Image from "../../../components/form/Image";
import { Link } from "react-router-dom";
import { fetchData } from "../../../hooks/services/services";

function UserCalendarView() {
  const navigate = useNavigate();
  const [clickedDate, setClickedDate] = useState(null);
  const [appointmentList, setAppointmentList] = useState();
  const [events, setEvents] = useState([]);
  const doctorDashboard = useSelector((state) => state.doctorDashboard);
  const [currentView, setCurrentView] = useState();
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const isProfileData = useSelector((state) => state?.userProfile?.userProfile);

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
        setAppointmentList(responseData?.data)
        const events = responseData?.data?.map((item) => {
          let a = `${item?.date}T${item?.slot?.split("-")[0]?.trim()}:00.000`
          return {
            title: item?.doctor?.name,
            date: a,
          };
        });

        setScheduledEvents(events)
      } catch (error) {
        console.log("error", error?.message);
      }
    };

  useEffect(() => {
    if(currentView?.startDate)
      getPatientAppointments()
  }, [currentView]);

  const handleDateClick = (date) => {
    setClickedDate(date); // Update the clicked date in the parent
  };

  return (
    <div className="rightContent">
      <div className="drCalender">
        <div className="tabPrt">
          <Link to="/patient/calender-view" className="bg-green">
            Calendar
          </Link>
          <Link to="/patient/appointment-list" className="bg-orange">
            List
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
                      <div className="imgPrts">
                        <Image
                          src={item?.doctor?.profile_picture}
                          className="img-fluid"
                        ></Image>

                        <p>{item?.doctor?.name}</p>
                      </div>
                      <div className="clockCalenderPrts">
                        <img src="/images/doctor-dashboard/dark-clock.svg" />
                        <span>{item?.slot}</span>
                      </div>
                    </div>
                    <div className="cardBottom mw-100">
                      <a href="#">
                        Review medical history
                      </a>
                      <div className="clockCalenderPrts">
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
              <div className="cardAppoint">No Appointments found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCalendarView;
