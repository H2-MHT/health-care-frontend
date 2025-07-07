import React, { useState } from "react";
import AddFamilyMemeberModel from "./addFamilyMemeberModel";
import MyCalendar from "../../doctor-dashboard/MyCalendar";
import {
  getAppointmentFormatDate,
  getAppointmentFormattedDate,
} from "../../../../utils/common";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { showToast } from "../../../../utils/toast";
import {
  deleteData,
  fetchDataAuth,
  postData,
  putData,
} from "../../../../hooks/services/services";
import { useEffect } from "react";
import { redirectToFitbitAuth } from "../../../../fitbit/fitbitAuth";
import SmallLoader from "../../../../components/ui/loader/SmallLoader";
import { getFitbitData } from "../../../../fitbit/fitbitApi";
import EditFamilyMemeberModel from "./editFamilyMemeberModel";
import { useSelector } from "react-redux";

const FamilyMemberProfileDashboard = () => {
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  const [modelOpen, setModelOpen] = useState(false);
  const [treatmentPlanData, setTreatmentPlanData] = useState();
  const [editNotesData, setEditNotesData] = useState();
  const [activeTab, setActiveTab] = useState("treatment");
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [openFamilyMemeberModel, setOpenFamilyMemeberModel] = useState(false);
  const [familyMemberDetails, setFamilyMemberDetails] = useState(null);
  const [openNotesEditModal, setOpenNotesEditModal] = useState(false);
  const [isFamilyMemberAdded, setIsFamilyMemberAdded] = useState(false);
  const [allNotesData, setAllNotesData] = useState();
  const [currentView, setCurrentView] = useState();
  const [memberSelection, setMemberSelection] = useState(isProfiledata);
  const DAILY_STEP_GOAL = 10000;
  const WATER_GOAL = 1800;
  const sampleImage = "../images/sample.png";
  const [steps, setSteps] = useState(null);
  const [water, setWater] = useState(null);
  const [calories, setCalories] = useState(null);
  const [HeartRate, setHeartRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notesData, setNotesData] = useState({ title: "", text: "" });
  const navigate = useNavigate();
  const [clickedDate, setClickedDate] = useState(
    getAppointmentFormatDate(new Date())
  );

  const progressPercentage = steps
    ? Math.min((steps / DAILY_STEP_GOAL) * 100, 100)
    : 0;
  const progressPercentagew = water
    ? Math.min((water / WATER_GOAL) * 100, 100)
    : 0;
  const formattedWater = water ? (water / 1000).toFixed(2) + "L" : "0L";

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

  console.log(familyMemberDetails, ">>>>>familyMemberDetails");
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

  const handleDateClick = (date) => {
    setClickedDate(date); // Update the clicked date in the parent
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const editNotesModal = (item) => {
    setOpenNotesEditModal(true);
    setEditNotesData(item);
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

  const updateInputNotes = (event) => {
    const { name, value } = event.target;
    setEditNotesData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNotesData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const getTreatmentPlanData = async () => {
    if (!currentView?.startDate) {
      return;
    }
    const startDate = getAppointmentFormattedDate(currentView?.startDate);
    const endDate = getAppointmentFormattedDate(currentView?.endDate);
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

  const getFamilyMemberDetails = async () => {
    try {
      const response = await fetchDataAuth(
        "patient/get-family-members/",
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      console.log(getData, ">>>>>>>getData");
      setFamilyMemberDetails(getData?.family_members[0]);
    } catch (error) {
      console.log(error.message);
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
      //
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getTreatmentPlanData();
    getNotesData();
    getFamilyMemberDetails();
  }, []);

  useEffect(() => {
    getFamilyMemberDetails();
  }, [isFamilyMemberAdded]);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        getNotesData();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const setProfileData = (data) => {
    const obj = {
      first_name: data?.member_name,
      profile_picture: data?.member_profile,
    };
    setMemberSelection(obj);
  };
  return (
    <div class="rightContent rightsidefull">
      <div class=" userDashboard">
        <div class="profileMobile">
          <div class="nameMobile">Hello, dr,Ava Williams!</div>
          <div class="profileImgMobile">
            <img src="images/profile-sample.png" class="img-fluid" />
          </div>
        </div>

        <div class="familyProf">
          <div class="familyProfSidebar">
            <div class="familyClick active">
              <img
                src={isProfiledata?.profile_picture || sampleImage}
                class="userMain"
              />
              <h5>{isProfiledata?.first_name}(you)</h5>
            </div>
            {console.log(">>>>>>>>>>>>isProfileData", isProfiledata)}
            {console.log(">>>>>>>>>familyMemberDetails", familyMemberDetails)}
            {familyMemberDetails && (
              <div class="familyClick ">
                <div class="threedots">
                  <img
                    src="../images/doctor-dashboard/threeDots.webp"
                    onClick={() => setOpenFamilyMemeberModel(true)}
                  />
                </div>
                <img
                  src={familyMemberDetails?.member_profile || sampleImage}
                  class="userMain"
                />
                <h5> {familyMemberDetails?.member_name}</h5>
                <a href="#" onClick={() => setProfileData(familyMemberDetails)}>
                  Switch to{" "}
                </a>
              </div>
            )}
            <div class="familyClick">
              <div class="lightGrayTag" onClick={() => setModelOpen(true)}>
                <img src="../images/user-dashboard/useraddIcon.svg" />
              </div>
              <h4>Add member</h4>
            </div>
          </div>
          <div class="bg-white p-3">
            <div class="row g-4">
              <div class="col-lg-5 col-md-12">
                <div class="calenderPart w-100">
                  <div class="tabPrt">
                    <Link to="/patient/calender-view" className="bg-green">
                      Calendar
                    </Link>
                    <Link to="/patient/appointment-list" className="bg-orange">
                      List
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
              </div>
              <div class="col-lg-7 col-md-12">
                <div class="row g-4">
                  <div class="col-md-8">
                    <div class="userTagLeft bg-white border-radius-20 padding-20 box-shadow-main">
                      <div class="tagging darkGreenTag">
                        Allergy <img src="../images/user-dashboard/x.webp" />
                      </div>
                      <div class="tagging darkYellowTag">
                        Reccomendations{" "}
                        <img src="../images/user-dashboard/x.webp" />
                      </div>
                      <div class="tagging tealTag">
                        English <img src="../images/user-dashboard/x.webp" />
                      </div>
                      <div class="tagging lightGrayTag">+ Add</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="userTagRight bg-white border-radius-20 padding-20 box-shadow-main">
                      <div class="usersRound">
                        <img
                          src={memberSelection?.profile_picture || sampleImage}
                        />
                        <p>{memberSelection?.first_name} (you)</p>
                      </div>
                      <div class="usersRound">
                        <div class="addUserCir lightGrayTag">
                          <img
                            src="../images/user-dashboard/useraddIcon.svg"
                            onClick={() => setModelOpen(true)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="stepCounts">
                      <div class="bg-white stepsIcon padding-20">
                        <img src="../images/user-dashboard/u-1.svg" />
                        <img src="../images/user-dashboard/u-2.svg" />
                        <img
                          src="../images/user-dashboard/u-3.svg"
                          class="Fitbit-login-icon"
                          onClick={redirectToFitbitAuth}
                          style={{ cursor: "pointer" }}
                        />
                        <img src="../images/user-dashboard/u-4.svg" />
                        <a href="#"> + Add</a>
                      </div>
                      <div class="swch">
                        <div class="swchBox steps">
                          <div class="swchTop">
                            <img src="../images/user-dashboard/stepping.svg" />
                            Steps
                          </div>
                          <h5>
                            {!isAuthenticated ? (
                              <span
                                style={{
                                  fontSize: "0.4em",
                                  fontWeight: "normal",
                                }}
                              >
                                Not Authenticated
                              </span>
                            ) : isLoading ? (
                              <SmallLoader />
                            ) : steps !== null ? (
                              steps
                            ) : (
                              "0"
                            )}
                          </h5>
                          <div class="progressPart">
                            <div class="progressBarArea whiteBar">
                              <progress
                                id="file"
                                value={progressPercentage}
                                max="100"
                              >
                                {" "}
                                {progressPercentage}%{" "}
                              </progress>
                            </div>
                          </div>
                          <h6>{progressPercentage}% of goal</h6>
                        </div>

                        <div class="swchBox water">
                          <div class="swchTop">
                            <img src="../images/user-dashboard/water.svg" />
                            Water
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
                                Not Authenticated
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

                        <div class="swchBox calories">
                          <div class="swchTop">
                            <img src="../images/user-dashboard/calories.svg" />
                            Calories
                          </div>
                          <img
                            src="../images/user-dashboard/calories-1.webp"
                            class="img-fluid"
                          />
                          <h6>Today</h6>
                          <h5>
                            {!isAuthenticated ? (
                              <span
                                style={{
                                  fontSize: "0.4em",
                                  fontWeight: "normal",
                                }}
                              >
                                Not Authenticated
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
                        <div class="swchBox heartrate">
                          <div class="swchTop">
                            <img src="../images/user-dashboard/heartrate.svg" />
                            Heart Rate
                          </div>
                          <img
                            src="../images/user-dashboard/heartrate-1.svg"
                            class="img-fluid"
                          />
                          <h5>
                            {!isAuthenticated ? (
                              <span
                                style={{
                                  fontSize: "0.4em",
                                  fontWeight: "normal",
                                }}
                              >
                                Not Authenticated
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
                </div>
              </div>
              <div class="col-lg-7 col-md-12">
                <div class="row g-3">
                  <div class="col-md-9">
                    <div class="notePart">
                      <div class="noteTop">
                        <h4>Notes</h4>
                        <a href="#" onClick={() => setOpenNotesModal(true)}>
                          +
                        </a>
                      </div>
                      <div class="notesFix">
                        {allNotesData?.data.map((item) => {
                          return (
                            <div class="notes">
                              <h5>{item?.title}</h5>
                              <div class="time">
                                {item?.created_at && formatDate(item?.created_at)}
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
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3"></div>
                  <div class="col-md-12">
                    <div class="pateintData userdashdata">
                      <div class="tabPrt">
                        <a
                          class="bg-pink"
                          className={`tab-link ${
                            activeTab === "treatment" ? "active" : ""
                          } bg-pink`}
                          onClick={() => handleTabClick("treatment")}
                        >
                          Treatment Plan
                        </a>
                        <a
                          class="bg-blue"
                          className={`tab-link ${
                            activeTab === "requests" ? "active" : ""
                          } bg-blue`}
                          onClick={() => handleTabClick("Requests")}
                        >
                          Requests
                        </a>
                        <a
                          class="bg-darkgreen"
                          className={`tab-link ${
                            activeTab === "archives" ? "active" : ""
                          } bg-darkgreen`}
                          onClick={() => handleTabClick("Archives")}
                        >
                          Archives
                        </a>
                      </div>
                      <div class="treatmentData">
                        {activeTab === "treatment" && (
                          <>
                            {treatmentPlanData?.completed_appointments?.map(
                              (item) => {
                                return (
                                  <div class="treatmentDeatil">
                                    <div>{item?.doctor_name}</div>
                                    <div>
                                      for:
                                      {treatmentPlanData?.patient?.patient_name}
                                    </div>
                                    <div class="main-blue-text">
                                      Amoxicilina
                                    </div>
                                    <div>{item?.date_time?.split("T")[0]}</div>
                                    {/* <div class="file">
                                      <img
                                        src="../images/user-dashboard/verification.svg"
                                        class="img-fluid"
                                      />
                                    </div> */}
                                  </div>
                                );
                              }
                            )}
                          </>
                        )}

                        {activeTab === "Requests" && (
                          <>
                            {treatmentPlanData?.upcoming_appointments?.map(
                              (item) => {
                                return (
                                  <div class="treatmentDeatil">
                                    <div>{item?.doctor_name}</div>
                                    <div>
                                      for:
                                      {treatmentPlanData?.patient?.patient_name}
                                    </div>
                                    <div class="main-blue-text">
                                      Amoxicilina
                                    </div>
                                    <div>{item?.date_time?.split("T")[0]}</div>
                                    {/* <div class="file">
                                      <img
                                        src="../images/user-dashboard/verification.svg"
                                        class="img-fluid"
                                      />
                                    </div> */}
                                  </div>
                                );
                              }
                            )}
                          </>
                        )}

                        {activeTab === "Archives" && (
                          <>
                            {treatmentPlanData?.archived_appointments?.map(
                              (item) => {
                                return (
                                  <div class="treatmentDeatil">
                                    <div>{item?.doctor_name}</div>
                                    <div>
                                      for:
                                      {treatmentPlanData?.patient?.patient_name}
                                    </div>
                                    <div class="main-blue-text">
                                      Amoxicilina
                                    </div>
                                    <div>{item?.date_time?.split("T")[0]}</div>
                                    {/* <div class="file">
                                      <img
                                        src="../images/user-dashboard/verification.svg"
                                        class="img-fluid"
                                      />
                                    </div> */}
                                  </div>
                                );
                              }
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div class="col-lg-5 col-md-12">
                <div class="sixChart bg-white padding-20 border-radius-20 h-100">
                  <div class="row g-3">
                    <div class="col-lg-4 col-md-6">
                      <div class="userChart">
                        <img
                          src="../images/user-dashboard/userchrt-1.webp"
                          class="img-fluid w-100"
                        />
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                      <div class="userChart">
                        <img
                          src="../images/user-dashboard/userchrt-1.webp"
                          class="img-fluid w-100"
                        />
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                      <div class="userChart">
                        <img
                          src="../images/user-dashboard/userchrt-1.webp"
                          class="img-fluid w-100"
                        />
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                      <div class="userChart">
                        <img
                          src="../images/user-dashboard/userchrt-1.webp"
                          class="img-fluid w-100"
                        />
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                      <div class="userChart">
                        <img
                          src="../images/user-dashboard/userchrt-1.webp"
                          class="img-fluid w-100"
                        />
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                      <div class="userChart">
                        <img
                          src="../images/user-dashboard/userchrt-1.webp"
                          class="img-fluid w-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
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
          <div class="modal-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="saveArea d-flex align-items-center gap-2">
                <a href="#" class="save" onClick={handleSubmit}>
                  Save
                </a>
                <a
                  href="javascript:void(0)"
                  data-bs-dismiss="modal"
                  onClick={() => setOpenNotesModal(false)}
                >
                  Cancel
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

      <Modal
        show={openNotesEditModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setOpenNotesEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div class="modal-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="saveArea d-flex align-items-center gap-2">
                <a href="#" class="save" onClick={updateNotes}>
                  Save
                </a>
                <a
                  // href="javascript:void(0)"
                  data-bs-dismiss="modal"
                  onClick={() => setOpenNotesEditModal(false)}
                >
                  Cancel
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

            <div class="NotesData">
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
      <AddFamilyMemeberModel
        setModelOpen={setModelOpen}
        modelOpen={modelOpen}
        getFamilyMemberDetails={getFamilyMemberDetails}
        setIsFamilyMemberAdded={setIsFamilyMemberAdded}
      />
      <EditFamilyMemeberModel
        openFamilyMemeberModel={openFamilyMemeberModel}
        setOpenFamilyMemeberModel={setOpenFamilyMemeberModel}
        setFamilyMemberDetails={setFamilyMemberDetails}
        familyMemberDetails={familyMemberDetails}
        getFamilyMemberDetails={getFamilyMemberDetails}
      />
    </div>
  );
};

export default FamilyMemberProfileDashboard;
