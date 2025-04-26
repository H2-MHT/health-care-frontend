import React,{useState} from 'react'
import MyCalendar from '../doctor-dashboard/MyCalendar';
import { useTranslation } from "react-i18next";

function MakeAppointment ({setModelOpen,modelOpen,Modal}) {
   const { t } = useTranslation();
    const [inputValue, setInputValue] = useState("");
     const [selectedTime, setSelectedTime] = useState();
     const [scheduledSelectedTime, setScheduledSelectedTime] = useState();

    const timeSlots = [
        { id: 1, timeRange: "9:15-9:30" },
        { id: 2, timeRange: "9:30-9:45" },
        { id: 3, timeRange: "9:45-10:00" },
        { id: 4, timeRange: "10:00-10:15" },
        { id: 5, timeRange: "10:15-10:30" },
        { id: 6, timeRange: "10:30-10:45" },
        { id: 7, timeRange: "10:45-11:00" },
      ];

      const handleTimeChange = (data) => {
        setInputValue(data?.timeRange?.split("-")[0]);
        setSelectedTime(data?.id);
        setScheduledSelectedTime(data?.timeRange?.split("-")[0]);
      };

      const handleOpenSecondModal = () => {
        setModelOpen(false);
        
      };

  return (
    <Modal
      show={modelOpen}
      backdrop="static"
      keyboard={false}
      onHide={setModelOpen}
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
                  //   events={false}
                  //   onDateClick={handleDateClick}
                  />
                </div>
              </div>
            </div>
            <div class="calenderTime">
              <div className="timeScroll">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`calendarInnerTime ${
                      selectedTime === slot.id ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      id={`time-${slot.id}`}
                      checked={selectedTime === slot.id} // Check if this time slot is selected
                      onChange={() => handleTimeChange(slot)} // Update the selected time slot on change
                    />
                    <div>{slot.timeRange}</div>
                  </div>
                ))}
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
                    onClick={() => setModelOpen(false)}
                  ></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default MakeAppointment 