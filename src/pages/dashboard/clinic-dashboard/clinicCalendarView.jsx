import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getAppointmentFormatDate,
  getFormattedDate,
  getTime,
} from "../../../utils/common";
import { getAppointmentList } from "../../../utils/common";
import MyCalendar from "../doctor-dashboard/MyCalendar";
import Image from "../../../components/form/Image";
import { useTranslation } from "react-i18next";


function ClinicCalendarView() {
  const{t} = useTranslation();
  const navigate = useNavigate();
  const [clickedDate, setClickedDate] = useState(
    getAppointmentFormatDate(new Date())
  );
  const doctorDashboard = useSelector((state) => state.doctorDashboard);
  const [currentView, setCurrentView] = useState({});
  const [appointmentList, setAppointmentList] = useState();
  const [events, setEvents] = useState();

  useEffect(() => {
    if (currentView?.startDate) getAppointmentListData();
  }, [currentView]);
  const getAppointmentListData = async () => {
    const role = JSON.parse(localStorage.getItem("user_data"))?.role;

    try {
      const list = await getAppointmentList(
        currentView?.startDate,
        currentView?.endDate,
        role,
        navigate
      );

      setAppointmentList(list);

      const events = list?.map((item) => {
        return {
          title: item?.patient?.name,
          date: item?.date_time,
        };
      });
      setEvents(events);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleDateClick = (date) => {
    setClickedDate(date);
  };

  return (
    <div className="rightContent rightsidefull">
      <div className="drCalender">
        <div className="calenderInner gap-0">
          <div className="calenderPart">
            <div className="calenderDetail border-radius-20">
              <div className="responsive-iframe-container large-container">
                <MyCalendar
                  events={true}
                  onDateClick={handleDateClick}
                  isCalendarView={true}
                  setCurrentView={setCurrentView}
                  eventList={events}
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
              {appointmentList?.map((item) => (
                <div className="cardAppoint" key={item?.id}>
                  <div className="cardTop gap-0">
                    <div className="imgPrts">
                      <Image
                        src={item?.doctor?.profile_picture}
                        className="img-fluid"
                      />
                      <div className="calenderDoctorName">
                        Dr. {item?.doctor?.name}
                      </div>
                    </div>
                    <div className="clockCalenderPrts">
                      <img src="/images/doctor-dashboard/dark-clock.svg" />
                      <span>{getTime(item?.date_time)}</span>
                    </div>
                  </div>
                  <div className="cardTop gap-0 mt-2">
                    <div className="imgPrts">
                      <Image
                        src={item?.patient?.profile_picture}
                        className="img-fluid"
                      />
                      <p>{item?.patient?.name}</p>
                    </div>
                    <div className="clockCalenderPrts">
                      <img src="/images/doctor-dashboard/dark-calender.svg" />
                      <span>{getFormattedDate(item?.date_time)}</span>
                    </div>
                  </div>
                </div>
              ))}
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

export default ClinicCalendarView;
