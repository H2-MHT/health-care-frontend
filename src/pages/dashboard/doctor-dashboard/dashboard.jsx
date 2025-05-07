import React, { useEffect, useState } from "react";
import { withAuth } from "../../../utils/withAuth";
import "./dashboard.css";
import MyCalendar from "./MyCalendar";
import {
  deleteData,
  fetchData,
  postData,
  putData,
  fetchDataAuth,
  updateData,
} from "../../../hooks/services/services";
import {
  getDoctorDasboardFailure,
  getDoctorDasboardRequest,
  getDoctorDasboardSuccess,
} from "../../../redux/actions/doctor/doctorDashboardAction";
import {
  getDoctorProfileRequest,
  getDoctorProfileSuccess,
  getDoctorProfileFailure,
} from "../../../redux//actions/doctor/getDoctorProfileAction";
import { useDispatch, useSelector } from "react-redux";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import {
  getAppointmentFormattedDate,
  getFormattedDate,
  getTime,
} from "../../../utils/common";
import ProgressCircle from "./ProgressCircle";
import { Modal } from "react-bootstrap";
import { showToast } from "../../../utils/toast";
import { socket } from "../../../utils/config";
import { Loader } from "../../../components/ui/loader/loader";
import { useTranslation } from "react-i18next";
import { requestForToken } from "../doctorChat/firebase";
// Register chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);
const Dashboard = () => {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clickedDate, setClickedDate] = useState(null);
  const [editOpenNotesModal, setEditOpenNotesModal] = useState(false);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [activeTab, setActiveTab] = useState("treatment");
  const [editNotesData, setEditNotesData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState();
  const [notesData, setNotesData] = useState({
    title: "",
    text: "",
  });

  const doctorDashboard = useSelector((state) => state.doctorDashboard);

  useEffect(() => {
    getProfile();
    storeDeviceToken();
  }, []);

  useEffect(() => {
    if (currentView?.startDate) {
      getDoctorDashboardCalendar();
    }
  }, [currentView]);

  const storeDeviceToken = async () => {
    try {
      let selectedUser = localStorage.getItem("user_data");
      selectedUser = JSON.parse(selectedUser);
      // if (!doctorDashboard?.dashboard?.doctor_id) {
      const deviceToken = await requestForToken();
      let deviceTokenPayload = {
        user_id: selectedUser?.id,
        device_token: deviceToken,
      };
      await putData(
        "auth/firebase-device-token/",
        JSON.stringify(deviceTokenPayload)
      );
      // }
    } catch (error) {
      console.log("error :", error);
    }
  };

  useEffect(() => {
    let user_id = JSON.parse(localStorage.getItem("user_data"))?.id;
    socket.emit("register", { user_id: user_id });
  }, []);

  const getDoctorDashboardCalendar = async () => {
    const startDate = getAppointmentFormattedDate(currentView?.startDate);
    const endDate = getAppointmentFormattedDate(currentView?.endDate);
    getDoctorDasboardRequest();
    try {
      const response = await fetchData(
        `dashboard/?start_date=${startDate}&end_date=${endDate}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      dispatch(getDoctorDasboardSuccess(getData));
    } catch (error) {
      dispatch(getDoctorDasboardFailure(error.message));
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getProfile = async () => {
    getDoctorProfileRequest();
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
    }
  };

  const handleDateClick = (date) => {
    setClickedDate(date); // Update the clicked date in the parent
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Format date to "Mon / 9:20am"
    const options = {
      weekday: "short", // Abbreviated weekday (e.g. Mon)
      hour: "2-digit", // 2-digit hour (e.g. 09)
      minute: "2-digit", // 2-digit minute (e.g. 20)
      hour12: true, // Use 12-hour clock (e.g. am/pm)
    };

    const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    // Return the formatted string in the desired format
    return `${formattedTime.split(",")[0]}`;
  };

  // Calculate total rating and count of ratings
  const total = doctorDashboard?.dashboard?.reviews?.reduce(
    (acc, review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        acc.sum += review.rating;
        acc.count += 1;
      }
      return acc;
    },
    { sum: 0, count: 0 }
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNotesData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

    if (isLoading) setIsLoading(true);
    try {
      const payload = {
        title: notesData?.title,
        note: notesData?.text,
      };
      const response = await postData("user/notes/", payload);
      if (response.status === 201) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        getDoctorDashboardCalendar();
        setNotesData();
        setOpenNotesModal(false);
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotes = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
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
        getDoctorDashboardCalendar();
        setEditOpenNotesModal(false);
        setEditNotesData();
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const editNotesModal = (item) => {
    setEditNotesData(item);
    setEditOpenNotesModal(true);
  };

  const deleteNotes = async (event) => {
    event.preventDefault();
    try {
      const response = await deleteData(`user/notes/${editNotesData?.id}`);
      showToast("Notes deleted successfully", "success");
      await getDoctorDashboardCalendar();
      setEditOpenNotesModal(false);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  // Calculate average rating
  const averageRating =
    total?.count > 0 ? (total?.sum / total?.count).toFixed(1) : 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div class="rightContent">
          <div class="rightContentPart">
            <div class="left">
              <div class="calenderPart">
                <div class="tabPrt">
                  <Link to="/calendar-view" class="bg-green">
                    {t("drawer.calendar")}
                  </Link>
                  <Link to="/calender-appointment-list" class="bg-orange">
                    {t("dashboard.list")}
                  </Link>
                </div>
                <div class="calenderDetail">
                  <div class="responsive-iframe-container large-container">
                    <MyCalendar
                      events={false}
                      onDateClick={handleDateClick}
                      setCurrentView={setCurrentView}
                    />
                  </div>
                </div>
              </div>
              <div class="notePart">
                <div class="noteTop">
                  <h4>{t("dashboard.notes")}</h4>
                  <a href="#" onClick={() => setOpenNotesModal(true)}>
                    +
                  </a>
                </div>
                <div className="notesFix">
                  {doctorDashboard?.dashboard?.doctor_notes &&
                  doctorDashboard.dashboard.doctor_notes.length > 0 ? (
                    doctorDashboard.dashboard.doctor_notes.map((item) => (
                      <div className="notes" key={item?.id}>
                        <h5>{item?.title}</h5>
                        <div className="time">
                          {formatDate(item?.created_at)}
                        </div>
                        <div
                          className="edit-btn cursor-pointer"
                          onClick={() => editNotesModal(item)}
                        >
                          <img
                            src="../images/doctor-dashboard/threeDots.webp"
                            width="30"
                            alt="Edit"
                          />
                        </div>
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

            <div class="right">
              <div class="trust">
                <div className="trustLeft">
                  <div className="treatmentContainer">
                    <div class="no-appointments">Coming soon...</div>
                  </div>
                </div>
                <div class="trustRight">
                  <div class="trustScore">
                    <h5>{t("dashboard.my-trust-score")}</h5>
                    <div class="score">
                      <img
                        src="/images/doctor-dashboard/star.png"
                        class="img-fluid"
                      />
                      <div class="scoreData">{averageRating}</div>
                    </div>
                  </div>
                  <div class="trustRate">
                    <div class="rate">{total?.count}</div>
                    {t("dashboard.reviews")}
                  </div>
                </div>
              </div>
              <div class="pateintData">
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
                      activeTab === "requests" ? "active" : ""
                    } bg-blue`}
                    onClick={() => handleTabClick("requests")}
                  >
                    {t("dashboard.requests")}
                  </a>
                  <a
                    className={`tab-link ${
                      activeTab === "archives" ? "active" : ""
                    } bg-darkgreen`}
                    onClick={() => handleTabClick("archives")}
                  >
                    {t("dashboard.archives")}
                  </a>
                </div>

                <div className="tab-content">
                  {/* Treatment Plan Tab Content */}
                  {activeTab === "treatment" && (
                    <div className="treatmentData">
                      {doctorDashboard?.dashboard?.patient_diagnoses &&
                      doctorDashboard.dashboard.patient_diagnoses.length > 0 ? (
                        doctorDashboard.dashboard.patient_diagnoses.map(
                          (item) => (
                            <div className="treatmentDeatil" key={item?.id}>
                              <div>{item?.doctor_name}</div>
                              <div>for: {item?.patient_name}</div>
                              <div className="main-blue-text">
                                {item?.condition}
                              </div>
                              <div>
                                {getFormattedDate(item?.diagnosis_date)}
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
                    </div>
                  )}
                  {/* Requests Tab Content */}
                  {activeTab === "requests" && (
                    <div className="treatmentData">
                      {doctorDashboard?.dashboard?.upcoming_requests?.length >
                      0 ? (
                        doctorDashboard.dashboard.upcoming_requests.map(
                          (item) => (
                            <div className="treatmentDeatil" key={item?.id}>
                              <div>{item?.doctor_name}</div>
                              <div>for: {item?.patient_name}</div>
                              <div>{getFormattedDate(item?.date)}</div>
                              {/* <div className="file">
                                <img
                                  src="/images/doctor-dashboard/verification.svg"
                                  className="img-fluid"
                                  alt="Verification"
                                />
                              </div> */}
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
                    </div>
                  )}

                  {/* Archives Tab Content */}
                  {activeTab === "archives" && (
                    <div className="treatmentData">
                      {doctorDashboard?.dashboard?.archived_data?.length > 0 ? (
                        doctorDashboard.dashboard.archived_data.map(
                          (item, index) => (
                            <div
                              className="treatmentDeatil"
                              key={item?.id || index}
                            >
                              <div>{item?.doctor_name || "Unknown Doctor"}</div>
                              <div>
                                for: {item?.patient_name || "Unknown Patient"}
                              </div>
                              <div>
                                {item?.date
                                  ? getFormattedDate(new Date(item.date))
                                  : "No Date Available"}
                              </div>
                              {/* <div className="file">
                                <img
                                  src="/images/doctor-dashboard/verification.svg"
                                  className="img-fluid"
                                  alt="Verification"
                                  loading="lazy"
                                />
                              </div> */}
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div class="reportChart">
            <div class="circleChart">
              <div class="chartLeft">
                <ProgressCircle
                  percentage={doctorDashboard?.dashboard?.returns_percentage}
                ></ProgressCircle>
                <div class="circle2">
                  <p>{t("drawer.consultations")}</p>
                  <h5>{doctorDashboard?.dashboard?.total_consultations}</h5>
                </div>
                <div class="circle3">
                  <h5>{doctorDashboard?.dashboard?.total_clients}</h5>
                  <p>{t("dashboard.clients")}</p>
                </div>
              </div>
              <div class="chartRight">
                <div class="lastReport">
                  <h5>{t("dashboard.last-reports")}</h5>
                  <div className="lastReportFix">
                    {doctorDashboard?.dashboard?.last_report?.length > 0 ? (
                      doctorDashboard?.dashboard?.last_report?.map((item) => {
                        return (
                          <div class="reportDetail">
                            <div class="img-prt">
                              <img
                                src="/images/doctor-dashboard/profile-sample.png"
                                class="img-fluid"
                              />
                              {item?.patient_name}
                            </div>
                            <div class="red-green">
                              {item?.status == "Active" ? (
                                <img
                                  src={`/images/doctor-dashboard/redcircle.png`}
                                  class="img-fluid"
                                />
                              ) : (
                                <img
                                  src={`/images/doctor-dashboard/greencircle.png`}
                                  class="img-fluid"
                                />
                              )}
                            </div>
                            <div>
                              {item?.diagnosis_date} <span>{item?.time}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="treatmentContainer">
                        <div className="no-appointments">
                          {t("dashboard.no-reports")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        show={editOpenNotesModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setEditOpenNotesModal(false)}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div class="modal-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="saveArea d-flex align-items-center gap-2">
                <a href="#" class="save" onClick={updateNotes}>
                  {t("common.save")}
                </a>
                <a
                  href="javascript:void(0)"
                  onClick={() => setEditOpenNotesModal(false)}
                >
                  {t("common.cancel")}
                </a>
              </div>
              <a href="#">
                <img
                  src="images/doctor-dashboard/delete.png"
                  onClick={deleteNotes}
                  style={{ width: "20px", height: "20px" }}
                />
              </a>
            </div>

            <div class="noteDate">
              <p>{t("dashboard.created")}</p>
              <h6>{getFormattedDate(editNotesData?.created_at)}</h6>
              <p>{getTime(editNotesData?.created_at)}</p>
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

            <div class="NotesData">
              <textarea
                id="note"
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
      <Modal
        show={openNotesModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setOpenNotesModal(false)}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div class="modal-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="saveArea d-flex align-items-center gap-2">
                <a href="#" class="save" onClick={handleSubmit}>
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

            <div class="NotesData">
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
    </>
  );
};

const AuthDashboard = withAuth(Dashboard);
export default AuthDashboard;
