import React, { useEffect, useState } from "react";
import "./userdashboard.css";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteData,
  fetchData,
  fetchDataAuth,
  postData,
  putData,
} from "../../../hooks/services/services";
import { Modal } from "react-bootstrap";
import { showToast } from "../../../utils/toast";
import MyCalendar from "../doctor-dashboard/MyCalendar";
import {
  getDoctorProfileFailure,
  getDoctorProfileRequest,
  getDoctorProfileSuccess,
} from "../../../redux/actions/doctor/getDoctorProfileAction";
import { useDispatch, useSelector } from "react-redux";
import { getFitbitData } from "../../../fitbit/fitbitApi";
import { redirectToFitbitAuth } from "../../../fitbit/fitbitAuth";
import SmallLoader from "../../../components/ui/loader/SmallLoader";
import {
  getAppointmentFormatDate,
  getAppointmentFormattedDate,
  getFormattedDate,
} from "../../../utils/common";
import { useTranslation } from "react-i18next";
import { requestForToken } from "../doctorChat/firebase";

const UserDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  const [treatmentPlanData, setTreatmentPlanData] = useState();
   const [appointmentList, setAppointmentList] = useState();
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [openNotesEditModal, setOpenNotesEditModal] = useState(false);
  const [editNotesData, setEditNotesData] = useState();
  const [videoModal, setVideoModal] = useState(false);
  const [allNotesData, setAllNotesData] = useState();
    const [selectedAppointment, setSelectedAppointment] = useState();
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [notesData, setNotesData] = useState();
  const [activeTab, setActiveTab] = useState("treatment");
  const [loading, setLoading] = useState(false);
  const DAILY_STEP_GOAL = 10000;
  const WATER_GOAL = 1800;
  const [steps, setSteps] = useState(null);
  const [water, setWater] = useState(null);
  const [calories, setCalories] = useState(null);
  const [currentView, setCurrentView] = useState();
  const [HeartRate, setHeartRate] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clickedDate, setClickedDate] = useState(
    getAppointmentFormatDate(new Date())
  );
  
  const [visibleWidgets, setVisibleWidgets] = useState({
    calendar: true,
    userTagsLeft: true,
    userTagsRight: true,
    stepCounts: true,
    notes: true,
    patientData: true,
  });
  
  const [showDropdown, setShowDropdown] = useState(false);

  const progressPercentage = steps
    ? Math.min((steps / DAILY_STEP_GOAL) * 100, 100)
    : 0;
  const progressPercentagew = water
    ? Math.min((water / WATER_GOAL) * 100, 100)
    : 0;
  const formattedWater = water ? (water / 1000).toFixed(2) + "L" : "0L";

  // Master function
  const fetchAllFitbitData = async (date) => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStepCount(date),
        fetchWaterQuantity(date),
        fetchRestingHeartRate(date),
      ]);
    } catch (error) {
      console.error("Error fetching Fitbit data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStepCount = async (date) => {
    try {
      const data = await getFitbitData(`activities/date/${date}.json`);
      console.log("Activities Data:", data);
      if (data?.summary) {
        setSteps(data.summary.steps);
        setCalories(data.summary.caloriesOut);
      }
    } catch (error) {
      console.error("Error fetching Fitbit steps & calories", error);
    }
  };

  const fetchWaterQuantity = async (date) => {
    try {
      const data = await getFitbitData(`foods/log/water/date/${date}/1d.json`);
      if (data?.["foods-log-water"]?.length > 0) {
        setWater(data["foods-log-water"][0].value);
      } else {
        console.warn("No water data available for selected date.");
      }
    } catch (error) {
      console.error("Error fetching Fitbit water data", error);
    }
  };

  const fetchRestingHeartRate = async (date) => {
    try {
      const data = await getFitbitData(`activities/heart/date/${date}/1d.json`);
      if (data?.["activities-heart"]?.length > 0) {
        setHeartRate(
          data["activities-heart"][0]?.value?.restingHeartRate || "N/A"
        );
      }
    } catch (error) {
      console.error("Error fetching Fitbit heart rate data", error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token1");
    if (accessToken) {
      setIsAuthenticated(true);
      fetchAllFitbitData(clickedDate);
    } else {
      setIsLoading(false);
    }
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === "fitbit-login-success") {
        showToast("Successfully Connected with Fitbit Account");
        setIsAuthenticated(true);
        fetchAllFitbitData(clickedDate);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [clickedDate]);

  useEffect(() => {
    getProfile();
    storeDeviceToken();
  }, []);


  const getPatientAppointments = async () => {
    const startDate = getAppointmentFormattedDate(currentView?.startDate);
    const endDate = getAppointmentFormattedDate(currentView?.endDate);
    try {
      const response = await fetchData(
        `doctors/patient-booked-appointment/?patient_user_id=${isProfiledata?.id}&start_date=${startDate}&end_date=${endDate}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      setAppointmentList(responseData?.data);
      const events = responseData?.data?.map((item) => {
        let a = `${item?.date}T${item?.slot?.split("-")[0]?.trim()}:00.000`;
        return {
          title: item?.doctor?.name,
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

    useEffect(() => {
      if (currentView?.startDate) getPatientAppointments();
    }, [currentView]);

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

  const getProfile = async () => {
    setLoading(true);
    await getDoctorProfileRequest();
    try {
      const response = await fetchDataAuth("auth/view-profile/", navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      dispatch(getDoctorProfileSuccess(getData.data));
    } catch (error) {
      dispatch(getDoctorProfileFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTreatmentPlanData = async () => {
    if (!currentView?.startDate) {
      return;
    }
    const startDate = getAppointmentFormattedDate(currentView?.startDate);
    const endDate = getAppointmentFormattedDate(currentView?.endDate);
    if (!currentView?.startDate) {
      return;
    }
    try {
      const response = await fetchDataAuth(
        `patient/patient-dashboard/?start_date=${startDate}&end_date=${endDate}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setTreatmentPlanData(getData);
    } catch (error) {
      console.log(error.message);
    }
  };

const handleEventClick = (clickInfo) => {
    let appointment = clickInfo.event.extendedProps;
    if (appointment) {
      setSelectedAppointment(appointment?.data);
      setVideoModal(true);
    }
  };

  const getNotesData = async () => {
    try {
      const response = await fetchDataAuth("user/notes/", navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setAllNotesData(getData);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getTreatmentPlanData();
    getNotesData();
  }, [currentView]);

  const editNotesModal = (item) => {
    setOpenNotesEditModal(true);
    setEditNotesData(item);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNotesData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateClick = (date) => {
    setClickedDate(date);
  };

  const updateInputNotes = (event) => {
    const { name, value } = event.target;
    setEditNotesData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!notesData?.title || !notesData?.text) {
      showToast("Please fill the fields first", "error");
      return;
    }
    try {
      const payload = {
        title: notesData?.title,
        note: notesData?.text,
      };
      const response = await postData("user/notes/", payload);
      if (response.status === 201) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        setOpenNotesModal(false);
        setNotesData("");
        getNotesData();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const deleteNotes = async (event) => {
    event.preventDefault();
    try {
      const response = await deleteData(`user/notes/${editNotesData?.id}`);
      showToast("Notes deleted successfully", "success");
      setOpenNotesEditModal(false);
      await getNotesData();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const updateNotes = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        title: editNotesData?.title,
        note: editNotesData?.note,
      };
      const response = await putData(
        `user/notes/${editNotesData?.id}/`,
        JSON.stringify(payload)
      );
      if (response.status === 200) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        setOpenNotesEditModal(false);
        getNotesData();
        setEditNotesData();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return `${formattedTime.split(",")[0]}`;
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

  return (
    <>
      <div className="rightContent rightsidefull">
        <div className="userDashboard">
          <div className="profileMobile">
            <div className="nameMobile">Hello, dr,Ava Williams!</div>
            <div className="profileImgMobile">
              <img src="images/profile-sample.png" className="img-fluid" />
            </div>
          </div>

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
                    <label>
                      {widgetKey
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="row g-4">
            {visibleWidgets.calendar && (
              <div
                className="col-lg-5 col-md-12"
                style={{ position: "relative" }}
              >
                <img
                  src="../images/user-dashboard/x.webp"
                  className="close-widget-imgg"
                  onClick={() => toggleWidget("calendar")}
                  alt="Close calendar widget"
                />
                <div className="calenderPart w-100">
                  <div className="tabPrt">
                    <Link to="/patient/calender-view" className="bg-green">
                      {t("drawer.calendar")}
                    </Link>
                    <Link to="/patient/appointment-list" className="bg-orange">
                      {t("dashboard.list")}
                    </Link>
                  </div>
                  <div className="calenderDetail">
                    <div className="responsive-iframe-container large-container">
                      <MyCalendar
                        events={true}
                        onEventClick={handleEventClick}
                        onDateClick={handleDateClick}
                        setCurrentView={setCurrentView}
                        eventList={scheduledEvents}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {visibleWidgets.userTagsLeft ||
            visibleWidgets.userTagsRight ||
            visibleWidgets.stepCounts ? (
              <div className="col-lg-7 col-md-12">
                <div className="row g-3">
                  {visibleWidgets.userTagsLeft && (
                    <div className="col-md-8" style={{ position: "relative" }}>
                      <img
                        src="../images/user-dashboard/x.webp"
                        className="close-widget-imgg"
                        onClick={() => toggleWidget("userTagsLeft")}
                        alt="Close user tags left widget"
                      />
                      <div className="userTagLeft bg-white border-radius-20 padding-20">
                        <div className="tagging darkGreenTag">
                          {t("user-dashboard.allergy")}{" "}
                          <img src="../images/user-dashboard/x.webp" />
                        </div>
                        <div className="tagging darkYellowTag">
                          {t("user-dashboard.reccomendations")}{" "}
                          <img src="../images/user-dashboard/x.webp" />
                        </div>
                        <div className="tagging tealTag">
                          {t("edit-profile.english")}{" "}
                          <img src="../images/user-dashboard/x.webp" />
                        </div>
                        <div className="tagging lightGrayTag">
                          {t("user-dashboard.add")}
                        </div>
                      </div>
                    </div>
                  )}
                  {visibleWidgets.userTagsRight && (
                    <div className="col-md-4" style={{ position: "relative" }}>
                      <img
                        src="../images/user-dashboard/x.webp"
                        className="close-widget-imgg"
                        onClick={() => toggleWidget("userTagsRight")}
                        alt="Close user tags right widget"
                      />
                      <div className="userTagRight bg-white border-radius-20 padding-20">
                        <div className="usersRound">
                          <img src={isProfiledata?.profile_picture} />
                          <p>
                            {isProfiledata?.first_name} (
                            {t("user-dashboard.you")})
                          </p>
                        </div>
                        <div className="usersRound">
                          <div className="addUserCir lightGrayTag">
                            <img src="../images/user-dashboard/useraddIcon.svg" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {visibleWidgets.stepCounts && (
                    <div className="col-md-12" style={{ position: "relative" }}>
                      <img
                        src="../images/user-dashboard/x.webp"
                        className="close-widget-imgg"
                        onClick={() => toggleWidget("stepCounts")}
                        alt="Close step counts widget"
                      />
                      <div className="stepCounts">
                        <div className="bg-white stepsIcon padding-20">
                          <img
                            src="../images/user-dashboard/u-3.svg"
                            className="Fitbit-login-icon"
                            onClick={redirectToFitbitAuth}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <div className="swch">
                          <div className="swchBox steps">
                            <div className="swchTop">
                              <img src="../images/user-dashboard/stepping.svg" />
                              {t("user-dashboard.steps")}
                            </div>
                            <h5>
                              {!isAuthenticated ? (
                                <span
                                  style={{
                                    fontSize: "0.4em",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {t("user-dashboard.not-authenticated")}
                                </span>
                              ) : isLoading ? (
                                <SmallLoader />
                              ) : steps !== null ? (
                                steps
                              ) : (
                                "0"
                              )}
                            </h5>
                            <div className="progressPart">
                              <div className="progressBarArea whiteBar">
                                <progress
                                  id="file"
                                  value={progressPercentage}
                                  max="100"
                                >
                                  {progressPercentage}%
                                </progress>
                              </div>
                            </div>
                            <h6>
                              {progressPercentage}%{" "}
                              {t("user-dashboard.of-goal")}
                            </h6>
                          </div>
                          <div className="swchBox water">
                            <div className="swchTop">
                              <img src="../images/user-dashboard/water.svg" />
                              {t("user-dashboard.water")}
                            </div>
                            <svg width="100" height="100" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="#d6d6d6"
                                strokeWidth="10"
                                fill="none"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                stroke="#3498db"
                                strokeWidth="10"
                                fill="none"
                                strokeDasharray="251.2"
                                strokeDashoffset={
                                  (1 - progressPercentagew / 100) * 251.2
                                }
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)"
                              />
                              <text
                                x="50"
                                y="55"
                                textAnchor="middle"
                                fontSize="18px"
                                fill="#000"
                              >
                                <span
                                  style={{
                                    fontSize: "0.4em",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {formattedWater}
                                </span>
                              </text>
                            </svg>
                            <h5>
                              {!isAuthenticated ? (
                                <span
                                  style={{
                                    fontSize: "0.4em",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {t("user-dashboard.not-authenticated")}
                                </span>
                              ) : isLoading ? (
                                <SmallLoader />
                              ) : water !== null ? (
                                formattedWater
                              ) : (
                                "0"
                              )}
                            </h5>
                          </div>
                          <div className="swchBox calories">
                            <div className="swchTop">
                              <img src="../images/user-dashboard/calories.svg" />
                              {t("user-dashboard.calories")}
                            </div>
                            <img
                              src="../images/user-dashboard/calories-1.webp"
                              className="img-fluid"
                            />
                            <h6>{t("clinic-dashboard.today")}</h6>
                            <h5>
                              {!isAuthenticated ? (
                                <span
                                  style={{
                                    fontSize: "0.4em",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {t("user-dashboard.not-authenticated")}
                                </span>
                              ) : isLoading ? (
                                <SmallLoader />
                              ) : calories !== null ? (
                                calories
                              ) : (
                                "0"
                              )}
                            </h5>
                          </div>
                          <div className="swchBox heartrate">
                            <div className="swchTop">
                              <img src="../images/user-dashboard/heartrate.svg" />
                              {t("user-dashboard.heart-rate")}
                            </div>
                            <img
                              src="../images/user-dashboard/heartrate-1.svg"
                              className="img-fluid"
                            />
                            <h5>
                              {!isAuthenticated ? (
                                <span
                                  style={{
                                    fontSize: "0.4em",
                                    fontWeight: "normal",
                                  }}
                                >
                                  {t("user-dashboard.not-authenticated")}
                                </span>
                              ) : isLoading ? (
                                <SmallLoader />
                              ) : HeartRate !== null ? (
                                HeartRate
                              ) : (
                                "N/A"
                              )}
                            </h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            {visibleWidgets.notes || visibleWidgets.patientData ? (
              <div className="col-lg-7 col-md-12">
                <div className="row g-3">
                  {visibleWidgets.notes && (
                    <div className="col-md-9" style={{ position: "relative" }}>
                      <img
                        src="../images/user-dashboard/x.webp"
                        className="close-widget-imgg"
                        onClick={() => toggleWidget("notes")}
                        alt="Close notes widget"
                      />
                      <div className="notePart">
                        <div className="noteTop">
                          <h4>{t("dashboard.notes")}</h4>
                          <div
                            onClick={() => setOpenNotesModal(true)}
                            className="cursor-pointer"
                          >
                            +
                          </div>
                        </div>
                        <div className="notesFix">
                          {allNotesData?.data.length > 0 ? (
                            allNotesData?.data.map((item) => (
                              <div className="notes" key={item.id}>
                                <h5>{item?.title}</h5>
                                <div className="time">
                                  {formatDate(item?.created_at)}
                                </div>
                                <a href="#">
                                  <img
                                    src="../images/doctor-dashboard/threeDots.webp"
                                    width="30"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      editNotesModal(item);
                                    }}
                                  />
                                </a>
                              </div>
                            ))
                          ) : (
                            <div className="treatmentContainer">
                              <div className="no-appointments">
                                {t("dashboard.no-notes")}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {visibleWidgets.patientData && (
                    <div className="col-md-12" style={{ position: "relative" }}>
                      <img
                        src="../images/user-dashboard/x.webp"
                        className="close-widget-imgg"
                        onClick={() => toggleWidget("patientData")}
                        alt="Close patient data widget"
                      />
                      <div className="pateintData userdashdata">
                        <div className="tabPrt">
                          <a
                            className={`tab-link ${
                              activeTab === "treatment" ? "active" : ""
                            } bg-pink`}
                            onClick={() => handleTabClick("treatment")}
                          >
                            {t("dashboard.treatment-plan")}
                          </a>
                          <a
                            className={`tab-link ${
                              activeTab === "Requests" ? "active" : ""
                            } bg-blue`}
                            onClick={() => handleTabClick("Requests")}
                          >
                            {t("dashboard.requests")}
                          </a>
                          <a
                            className={`tab-link ${
                              activeTab === "Archives" ? "active" : ""
                            } bg-darkgreen`}
                            onClick={() => handleTabClick("Archives")}
                          >
                            {t("dashboard.archives")}
                          </a>
                        </div>
                        <div className="treatmentData">
                          {activeTab === "treatment" && (
                            <>
                              {treatmentPlanData?.completed_appointments
                                ?.length > 0 ? (
                                treatmentPlanData?.completed_appointments?.map(
                                  (item) => (
                                    <div
                                      className="treatmentDeatil"
                                      key={item.id}
                                    >
                                      <div>{item?.doctor_name}</div>
                                      <div>
                                        {t("appointment-list.for")}:
                                        {
                                          treatmentPlanData?.patient
                                            ?.patient_name
                                        }
                                      </div>
                                      <div className="main-blue-text">
                                        {getFormattedDate(item.date)}
                                      </div>
                                      <div>
                                        {item?.date_time?.split("T")[0]}
                                      </div>
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="treatmentContainer">
                                  <div className="no-appointments">
                                    {t("dashboard.no-appointments")}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          {activeTab === "Requests" && (
                            <>
                              {treatmentPlanData?.upcoming_appointments.length >
                              0 ? (
                                treatmentPlanData?.upcoming_appointments?.map(
                                  (item) => (
                                    <div
                                      className="treatmentDeatil"
                                      key={item.id}
                                    >
                                      <div>{item?.doctor_name}</div>
                                      <div>
                                        {t("appointment-list.for")}:
                                        {
                                          treatmentPlanData?.patient
                                            ?.patient_name
                                        }
                                      </div>
                                      <div className="main-blue-text">
                                        {getFormattedDate(item.date)}
                                      </div>
                                      <div>
                                        {item?.date_time?.split("T")[0]}
                                      </div>
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="treatmentContainer">
                                  <div className="no-appointments">
                                    {t("dashboard.no-appointments")}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          {activeTab === "Archives" && (
                            <>
                              {treatmentPlanData?.archived_appointments.length >
                              0 ? (
                                treatmentPlanData?.archived_appointments?.map(
                                  (item) => (
                                    <div
                                      className="treatmentDeatil"
                                      key={item.id}
                                    >
                                      <div>{item?.doctor_name}</div>
                                      <div>
                                        {t("appointment-list.for")}:
                                        {
                                          treatmentPlanData?.patient
                                            ?.patient_name
                                        }
                                      </div>
                                      <div className="main-blue-text">
                                        {getFormattedDate(item.date)}
                                      </div>
                                      <div>
                                        {item?.date_time?.split("T")[0]}
                                      </div>
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="treatmentContainer">
                                  <div className="no-appointments">
                                    {t("dashboard.no-appointments")}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Modal
        show={openNotesModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setOpenNotesModal(false)}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="saveArea d-flex align-items-center gap-2">
                <a href="#" className="save" onClick={handleSubmit}>
                  {t("common.save")}
                </a>
                <a
                  href="javascript:void(0)"
                  data-bs-dismiss="modal"
                  onClick={() => setOpenNotesModal(false)}
                >
                  {t("common.cancel")}
                </a>
              </div>
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={notesData?.title}
              onChange={handleInputChange}
              placeholder="Enter note title"
              style={{ marginBottom: "25px" }}
            />
            <div className="NotesData">
              <textarea
                id="text"
                name="text"
                value={notesData?.note}
                onChange={handleInputChange}
                placeholder="Enter your note here..."
                rows="4"
                cols="50"
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={openNotesEditModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setOpenNotesEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="saveArea d-flex align-items-center gap-2">
                <a href="#" className="save" onClick={updateNotes}>
                  {t("common.save")}
                </a>
                <a
                  data-bs-dismiss="modal"
                  onClick={() => setOpenNotesEditModal(false)}
                >
                  {t("common.cancel")}
                </a>
              </div>
              <a href="#">
                <img
                  src="../images/doctor-dashboard/delete.png"
                  onClick={deleteNotes}
                />
              </a>
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={editNotesData?.title}
              onChange={updateInputNotes}
              placeholder="Enter note title"
              style={{ marginBottom: "25px" }}
            />
            <div className="NotesData">
              <textarea
                id="text"
                name="note"
                value={editNotesData?.note}
                onChange={updateInputNotes}
                placeholder="Enter your note here..."
                rows="4"
                cols="50"
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserDashboard;
