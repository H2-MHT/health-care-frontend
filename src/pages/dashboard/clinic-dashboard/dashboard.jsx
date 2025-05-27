import React, { useEffect, useState } from "react";
import "../clinic-dashboard/clinicDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import MyCalendar from "../doctor-dashboard/MyCalendar";
import { fetchData, putData } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { getAppointmentFormatDate } from "../../../utils/common";
import { useTranslation } from "react-i18next";
import { requestForToken } from "../doctorChat/firebase";

const ClinicDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [view, setView] = useState("month");
  const [isLoading, setIsLoading] = useState(false);
  const [clinicAppointments, setClinicAppointments] = useState();
  const [doctors, setDoctors] = useState();
  const [ratingReview, setRatingReview] = useState();
  const [clinicAppointmentsGraphData, setClinicAppointmentsGraphData] =
    useState();
  const [selectedDate, setSelectedDate] = useState(
    getAppointmentFormatDate(new Date())
  );
  // State for widget visibility and dropdown
  const [visibleWidgets, setVisibleWidgets] = useState({
    calenderPart: true,
    activeDoctor: true,
    trustScore: true,
    activityMap: true,
    appointmentBox: true,
  });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    getAppointmentData();
    getAppointmentGraphData();
    getDoctorList();
  }, [selectedDate, view]);

  useEffect(() => {
    clinicReviews();
    storeDeviceToken();
  }, []);

  const storeDeviceToken = async () => {
    try {
      let selectedUser = localStorage.getItem("user_data");
      selectedUser = JSON.parse(selectedUser);
      const deviceToken = await requestForToken();
      let deviceTokenPayload = {
        user_id: selectedUser?.id,
        device_token: deviceToken,
      };
      await putData(
        "auth/firebase-device-token/",
        JSON.stringify(deviceTokenPayload)
      );
    } catch (error) {
      console.log("error :", error);
    }
  };

  const clinicReviews = async () => {
    const response = await fetchData("clinics/clinic-reviews/stats/", navigate);
    if (!response.ok) {
      setIsLoading(false);
      throw new Error("Failed to fetch data from the server.");
    }
    setIsLoading(false);
    const rating = await response.json();
    setRatingReview(rating);
  };

  const getDoctorList = async () => {
    const response = await fetchData("clinics/active-doctors/", navigate);
    if (!response.ok) {
      setIsLoading(false);
      throw new Error("Failed to fetch data from the server.");
    }
    setIsLoading(false);
    const doctorList = await response.json();
    setDoctors(doctorList);
  };

  const getAppointmentData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(
        `clinics/appointments/stats/?date=${selectedDate}`,
        navigate
      );
      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Failed to fetch data from the server.");
      }
      setIsLoading(false);
      const getData = await response.json();
      setClinicAppointments(getData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAppointmentGraphData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(
        `clinics/appointments/activity/?date=${selectedDate}&type=${view}`,
        navigate
      );
      if (!response.ok) {
        setIsLoading(false);
        throw new Error("Failed to fetch data from the server.");
      }
      setIsLoading(false);
      const getData = await response.json();
      setClinicAppointmentsGraphData(getData);
    } catch (error) {
      console.log(error.message);
    }
  };

 
  const toggleWidget = (widgetKey) => {
    setVisibleWidgets((prev) => ({
      ...prev,
      [widgetKey]: !prev[widgetKey],
    }));
  };

 
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

 
  const formatWidgetLabel = (key) =>
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  return (
    <div className="rightContent rightsidefull">
      
      <div
        style={{
          position: "relative",
          textAlign: "right",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={toggleDropdown}
          style={{
            padding: "8px 16px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Widget Menu
        </button>
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              right: 0,
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              zIndex: 1000,
              padding: "10px",
              width: "200px",
              maxHeight: "120px",
              overflowY: "auto",
            }}
          >
            {Object.keys(visibleWidgets).map((widgetKey) => (
              <div
                key={widgetKey}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px 0",
                }}
              >
                <input
                  type="checkbox"
                  checked={visibleWidgets[widgetKey]}
                  onChange={() => toggleWidget(widgetKey)}
                  style={{ marginRight: "10px" }}
                />
                <label>{formatWidgetLabel(widgetKey)}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rightContentPart">
        <div className="profileMobile">
          <div className="nameMobile">Hello, dr,Ava Williams!</div>
          <div className="profileImgMobile">
            <img src="../images/profile-sample.png" className="img-fluid" />
          </div>
        </div>
        <div className="left">
          {visibleWidgets.calenderPart && (
            <div className="calenderPart" style={{ position: "relative" }}>
              <img
                src="../images/user-dashboard/x.webp"
                className="close-widget-img"
                onClick={() => toggleWidget("calenderPart")}
                alt="Close calendar widget"
              />
              <div className="calenderDetail border-radius-20">
                <div className="responsive-iframe-container large-container">
                  <MyCalendar events={false} onDateClick={setSelectedDate} />
                </div>
              </div>
            </div>
          )}
          {visibleWidgets.appointmentBox && (
            <div
              className="apntBox border-radius-20 bg-white padding-20"
              style={{ position: "relative" }}
            >
              <img
                src="../images/user-dashboard/x.webp"
                className="close-widget-img"
                onClick={() => toggleWidget("appointmentBox")}
                alt="Close appointments box widget"
              />
              <div className="apntBoxInner">
                <table>
                  <thead>
                    <tr>
                      <th>{t("clinic-dashboard.appointments")}</th>
                      <th>{t("clinic-dashboard.today")}</th>
                      <th>{t("clinic-dashboard.week")}</th>
                      <th>{t("clinic-dashboard.month")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t("clinic-dashboard.booked")}</td>
                      <td>{clinicAppointments?.booked_today_appointment}</td>
                      <td>{clinicAppointments?.booked_weekly_appointment}</td>
                      <td className="main-blue-text">
                        {clinicAppointments?.booked_monthly_appointment}
                      </td>
                    </tr>
                    <tr>
                      <td>{t("clinic-dashboard.declined")}</td>
                      <td>{clinicAppointments?.declined_today_appointment}</td>
                      <td>{clinicAppointments?.declined_weekly_appointment}</td>
                      <td className="text-red">
                        {clinicAppointments?.declined_monthly_appointment}
                      </td>
                    </tr>
                    <tr>
                      <td>{t("clinic-dashboard.completed")}</td>
                      <td>{clinicAppointments?.completed_today_appointment}</td>
                      <td>
                        {clinicAppointments?.completed_weekly_appointment}
                      </td>
                      <td className="text-green">
                        {clinicAppointments?.completed_monthly_appointment}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="right">
          <div className="trust">
            {visibleWidgets.activeDoctor && (
              <div
                className="activeDoc border-radius-20 bg-white padding-20"
                style={{ position: "relative" }}
              >
                <img
                  src="../images/user-dashboard/x.webp"
                  className="close-widget-img"
                  onClick={() => toggleWidget("activeDoctor")}
                  alt="Close active doctors widget"
                />
                <div className="activeDocHead">
                  <h4>{t("clinic-dashboard.active-now")}</h4>
                  <p>
                    <span className="main-blue-text">
                      {doctors?.active_doctors}
                    </span>
                    /{doctors?.total_doctors}
                  </p>
                </div>
                <div className="activeDocInner">
                  {doctors?.active_doctors > 0 ? (
                    <div className="chattingArea">
                      {doctors?.active_doctors_list?.map((chat) => (
                        <div key={chat.id} className="chattingpart">
                          <div className="img-parallel">
                            <img
                              src="../images/sample.png"
                              className="img-fluid"
                              alt="Profile"
                            />
                            <div>
                              <p>
                                {chat.first_name} {chat?.last_name}
                              </p>
                              <input type="text" placeholder="text message" />
                            </div>
                          </div>
                          <p>{chat.time}</p>
                          <div className="chattingTicks">
                            {chat.messageStatus === "read" && (
                              <div className="messageRead">
                                <img
                                  src="../images/double_tick.webp"
                                  width="20"
                                  alt="Read"
                                />
                              </div>
                            )}
                            {chat.messageStatus === "unread" && (
                              <div className="messageUnread">
                                {chat.unreadCount}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="chattingArea">
                      {t("clinic-dashboard.no-doctors-active")}
                    </div>
                  )}
                </div>
              </div>
            )}
            {visibleWidgets.trustScore && (
              <div className="trustRight" style={{ position: "relative" }}>
                <img
                  src="../images/user-dashboard/x.webp"
                  className="close-widget-img"
                  onClick={() => toggleWidget("trustScore")}
                  alt="Close trust score widget"
                />
                <div className="trustScore">
                  <h5>{t("dashboard.my-trust-score")}</h5>
                  <div className="score">
                    <img src="../images/star.png" className="img-fluid" />
                    <div className="scoreData">
                      {ratingReview?.average_score}
                    </div>
                  </div>
                </div>
                <div className="trustRate">
                  <div className="rate">{ratingReview?.total_reviews}</div>
                  {t("dashboard.reviews")}
                </div>
              </div>
            )}
          </div>
          {visibleWidgets.activityMap && (
            <div
              className="activityMap border-radius-20 bg-white padding-20"
              style={{ position: "relative" }}
            >
              <img
                src="../images/user-dashboard/x.webp"
                className="close-widget-img"
                onClick={() => toggleWidget("activityMap")}
                alt="Close activity map widget"
              />
              <div className="head">
                <h4>{t("clinic-dashboard.activity")}</h4>
                <select onChange={(e) => setView(e.target.value)} value={view}>
                  <option value="day">{t("clinic-dashboard.day")}</option>
                  <option value="week">{t("clinic-dashboard.week")}</option>
                  <option value="month">{t("clinic-dashboard.month")}</option>
                </select>
              </div>
              <div className="ChartArea">
                <BarChart
                  width={600}
                  height={315}
                  data={clinicAppointmentsGraphData}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Declined" stackId="a" fill="red" />
                  <Bar dataKey="Completed" stackId="a" fill="green" />
                  <Bar dataKey="Booked" stackId="a" fill="lightblue" />
                </BarChart>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicDashboard;
