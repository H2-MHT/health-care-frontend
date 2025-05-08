import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector } from "react-redux";
import "./dashboard.css";
import { getAppointmentFormatDate } from "../../../utils/common";
const MyCalendar = ({
  events,
  onDateClick,
  onEventClick,
  isCalendarView = false,
  setCurrentView = () => {},
  eventList,
  minDate,
}) => {
  const [currentDateRange, setCurrentDateRange] = useState(null);

  const doctorDashboard = useSelector((state) => state.doctorDashboard);
  let resp = doctorDashboard?.dashboard?.appointments?.map((item) => {
    return {
      title: item?.patient_name,
      date: item?.date_time,
    };
  });

  const handleEventClick = (clickInfo) => {
    onEventClick(clickInfo);
  };

  const handleEvents = (events) => {
    console.log("handleEvents>>>>>", events);
  };

  const handleDateClick = (info) => {
    onDateClick(info.dateStr);
  };

  const getCalendarDates = (date) => {
    const startDate = getAppointmentFormatDate(date?.startStr);
    const endDate = getAppointmentFormatDate(date?.endStr);
    if (startDate || endDate)
      setCurrentView({ startDate: startDate, endDate: endDate });
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={
          isCalendarView
            ? {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek,dayGridDay",
              }
            : { right: "prev,next today" }
        }
        validRange={{
          start: minDate ? minDate : "", // Restrict to select dates from today onwards
        }}
        weekends={true}
        events={eventList ? eventList : events ? resp : []}
        locales="allLocales"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Ensures AM/PM is shown
        }}
        locale="en"
        firstDay={1}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        eventClick={handleEventClick}
        eventsSet={handleEvents}
        dateClick={handleDateClick}
        datesSet={(viewInfo) => {
          // Check if the date range actually changed
          const newDateRange = `${viewInfo.startStr}-${viewInfo.endStr}`;
          if (newDateRange !== currentDateRange) {
            setCurrentDateRange(newDateRange);
            getCalendarDates(viewInfo);
          }
        }}
      />
    </div>
  );
};

export default MyCalendar;