import React, { useState, useEffect } from "react";
import { redirectToFitbitAuth } from "../../../fitbit/fitbitAuth";
import { getFitbitData } from "../../../fitbit/fitbitApi";
import { showToast } from "../../../utils/toast";
import MyCalendar from "../../dashboard/doctor-dashboard/MyCalendar";
import SmallLoader from "../../../components/ui/loader/SmallLoader";

export const PatientDashboard = () => {
  const DAILY_STEP_GOAL = 10000;
  const WATER_GOAL = 1800;
  const [steps, setSteps] = useState(null);
  const [water, setWater] = useState(null);
  const [calories, setCalories] = useState(null);
  const [HeartRate, setHeartRate] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today

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
      fetchAllFitbitData(selectedDate);
    } else {
      setIsLoading(false);
    }
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === "fitbit-login-success") {
        showToast("Successfully Connected with Fitbit Account");
        setIsAuthenticated(true);
        fetchAllFitbitData(selectedDate);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [selectedDate]);

  const onDateClick = (date) => {
    setSelectedDate(date);
  };
  return (
    <div class="rightContent ">
      <div class=" userDashboard">
        <div class="profileMobile">
          <div class="nameMobile">Hello, dr,Ava Williams!</div>
          <div class="profileImgMobile">
            <img src="images/profile-sample.png" class="img-fluid" />
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-5 col-md-12">
            <div class="calenderPart w-100">
              <div class="tabPrt">
                <a href="#" class="bg-green">
                  Calender
                </a>
                <a href="#" class="bg-orange">
                  List
                </a>
              </div>
              <div class="calenderDetail">
                <MyCalendar events={false} onDateClick={onDateClick} />
              </div>
            </div>
          </div>
          <div class="col-lg-7 col-md-12">
            <div class="row g-3">
              <div class="col-md-8">
                <div class="userTagLeft bg-white border-radius-20 padding-20">
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
                <div class="userTagRight bg-white border-radius-20 padding-20">
                  <div class="usersRound">
                    <img src="../images/user-dashboard/useradding.svg" />
                    <p>Jenny (you)</p>
                  </div>
                  <div class="usersRound">
                    <div class="addUserCir lightGrayTag">
                      <img src="../images/user-dashboard/useraddIcon.svg" />
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
                            style={{ fontSize: "0.4em", fontWeight: "normal" }}
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
                          <span style={{ fontSize: "0.4em", fontWeight:"bold"}}>{formattedWater}</span>
                        </text>
                      </svg>
                      <h5>
                        {!isAuthenticated ? (
                          <span
                            style={{ fontSize: "0.4em", fontWeight: "normal" }}
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
                            style={{ fontSize: "0.4em", fontWeight: "normal" }}
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
                            style={{ fontSize: "0.4em", fontWeight: "normal" }}
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
                    <a href="#">+</a>
                  </div>
                  <div class="notesFix">
                    <div class="notes">
                      <h5>Note Name</h5>
                      <div class="time">Mon / 9:20am</div>
                      <a
                        href="javascript:void(0)"
                        data-bs-toggle="modal"
                        data-bs-target="#NotesModal"
                      >
                        <img
                          src="../images/threeDots.webp"
                          width="30"
                        />
                      </a>
                    </div>
                    <div class="notes">
                      <h5>Note Name</h5>
                      <div class="time">Mon / 9:20am</div>
                      <a href="javascript:void(0)">
                        <img
                          src="../images/user-dashboard/threeDots.webp"
                          width="30"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="pateintData userdashdata">
                  <div class="tabPrt">
                    <a href="#" class="bg-pink">
                      Treatment Plan
                    </a>
                    <a href="#" class="bg-blue">
                      Requests
                    </a>
                    <a href="#" class="bg-darkgreen">
                      Archives
                    </a>
                  </div>
                  <div class="treatmentData">
                    <div class="treatmentDeatil">
                      <div>Dr. Green</div>
                      <div>for: Jenny Fox</div>
                      <div class="main-blue-text">Amoxicilina</div>
                      <div>24/09/2023</div>
                      <div class="file">
                        <img
                          src="../images/user-dashboard/verification.svg"
                          class="img-fluid"
                        />
                      </div>
                    </div>
                    <div class="treatmentDeatil">
                      <div>Dr. Green</div>
                      <div>for: Jenny Fox</div>
                      <div class="main-blue-text">Amoxicilina</div>
                      <div>24/09/2023</div>
                      <div class="file">
                        <img
                          src="../images/user-dashboard/verification.svg"
                          class="img-fluid"
                        />
                      </div>
                    </div>
                    <div class="treatmentDeatil">
                      <div>Dr. Green</div>
                      <div>for: Jenny Fox</div>
                      <div class="main-blue-text">Amoxicilina</div>
                      <div>24/09/2023</div>
                      <div class="file">
                        <img
                          src="../images/user-dashboard/verification.svg"
                          class="img-fluid"
                        />
                      </div>
                    </div>
                    <div class="treatmentDeatil">
                      <div>Dr. Green</div>
                      <div>for: Jenny Fox</div>
                      <div class="main-blue-text">Amoxicilina</div>
                      <div>24/09/2023</div>
                      <div class="file">
                        <img
                          src="../images/user-dashboard/verification.svg"
                          class="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
