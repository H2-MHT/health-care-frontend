import React, { useState, useEffect } from "react";
import MyCalendar from "../doctor-dashboard/MyCalendar";
import { getFitbitData } from "../../../fitbit/fitbitApi";
import { redirectToFitbitAuth } from "../../../fitbit/fitbitAuth";
import SmallLoader from "../../../components/ui/loader/SmallLoader";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { fetchData } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import Accordion from "../../../components/form/Accordion";
import InputField from "../../../components/form/InputField";
import CommonModal from "../../../components/form/Modal";
import { showToast } from "../../../utils/toast";


const UserHealthDataCenter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [steps, setSteps] = useState(null);
  const [water, setWater] = useState(null);
  const [calories, setCalories] = useState(null);
  const [heartRate, setHeartRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [totalDistance, settotalDistance] = useState(null);
  const [profile, setProfile]=useState(null);
  const [userProfile, setUserProfile] = useState({category:"", resource:""});
  const [weight, setWeight] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [sleep, setSleep] = useState({ hours: 0, minutes: 0 });
  const [list, setList] = useState([]);
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);

  const sampleImage = "../images/sample.png";

  const fetchAllFitbitData = async (date) => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStepCount(date),
        fetchWaterQuantity(date),
        fetchRestingHeartRate(date),
        fetchSleepData(date),
        fetchWeightAndBMI(date),
        //fetchUserProfile()
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
      if (data?.summary) {
        setSteps(data.summary.steps);
        setCalories(data.summary.caloriesOut);
        const totalDistanceRaw =
          data?.summary?.distances?.find((d) => d.activity === "total")
            ?.distance || 0;
        const formattedDistance =
          totalDistanceRaw >= 1000
            ? (totalDistanceRaw / 1000).toFixed(1) + "k"
            : totalDistanceRaw.toFixed(1);
        settotalDistance(formattedDistance);
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
  const fetchSleepData = async (date) => {
    try {
      const data = await getFitbitData(`sleep/date/${date}.json`);
      if (data?.sleep && data.sleep.length > 0) {
        const totalMinutes = data.summary.totalMinutesAsleep || 0;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        setSleep({ hours, minutes });
      } else {
        setSleep({ hours: 0, minutes: 0 });
      }
    } catch (error) {
      console.error("Error fetching Fitbit sleep data", error);
      setSleep({ hours: 0, minutes: 0 }); 
    }
  };

  const fetchWeightAndBMI = async (date) => {
    try {
      const data = await getFitbitData(`body/log/weight/date/${date}.json`);
      //console.log("Weight & BMI Data:", data);
      if (data?.weight?.length > 0) {
        const latestEntry = data.weight[0]; 
        setWeight(latestEntry.weight);
        setBmi(latestEntry.bmi);
      } else {
        console.warn("No weight data found for the selected date.");
      }
    } catch (error) {
      console.error("Error fetching Fitbit weight & BMI data:", error);
    }
  };
  const fetchUserProfile = async () => {
    try {
      const data = await getFitbitData("profile.json");
      if (data?.user) {
        setProfile({
          fullName: data.user.fullName || "N/A",
          weight: data.user.weight || "N/A",
          height: data.user.height || "N/A",
          avatar:
            data.user.avatar640 ||
            data.user.avatar150 ||
            data.user.avatar ||
            "",
          weight: data?.user?.weight || "N/A",
        });
      }
    } catch (error) {
      console.error("Error fetching Fitbit user profile", error);
    }
  };

  const calculateWeightChange = (startingWeight, currentWeight) => {
    if (!startingWeight || !currentWeight || startingWeight === currentWeight) {
      return "No change";
    }
    const weightChangePercent =
      ((currentWeight - startingWeight) / startingWeight) * 100;
    return weightChangePercent < 0
      ? `${Math.abs(weightChangePercent).toFixed(1)}% decrease`
      : `${weightChangePercent.toFixed(1)}% increase`;
  };
  useEffect(() => {
   fetchAllFitbitData(selectedDate);
  }, [selectedDate]);
  const onDateClick = (date) => {
    setSelectedDate(date);
  };

  useEffect(()=> {
    fetchUserProfile()
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile({ ...userProfile, [name]: value });
  }

  const closeModal = () => {
    setOpen(false);
  }

  const handleSubmit = async () => {
    try {
      const response = await fetchData(`nhs/api/?category=${userProfile?.category}&resource=${userProfile?.resource}`, navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      setList(responseData?.hasPart)
      setOpen(false);
    } catch (error) {
      showToast(error?.message, "error")
    }
  }

  const getForm = () => {
    return (
      <div>
        <InputField type="text" placeholder="Enter category" name="category" onChange={handleChange} className="mb-3 mr-2 ml-2"/>
        <InputField type="text" placeholder="Enter resource" name="resource" onChange={handleChange} className="mb-3 mr-2 ml-2"/>
      </div>
    );
  };

  return (
    <div class="rightContent rightsidefull ">
      <div class=" userDashboard">
        <div class="profileMobile">
          <div class="nameMobile">Hello, dr,Ava Williams!</div>
          <div class="profileImgMobile">
            <img src="images/profile-sample.png" class="img-fluid" />
          </div>
        </div>
        <div class="row g-4">
          <div class="col-lg-4 col-md-12">
            <div class="row g-4">
              <div class="col-md-12">
                <div class="calenderPart w-100">
                  <div class="calenderDetail border-radius-20">
                    <MyCalendar events={false} onDateClick={onDateClick} />
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="userAllDetail bg-white padding-20 border-radius-20">
                  <div class="userData">
                    <img src={profile?.avatar || sampleImage} />
                    {profile ? (
                      <h6>{profile.fullName}</h6>
                    ) : (
                      <p>Loading profile...</p>
                    )}
                  </div>
                  <div class="userBodyData">
                    <div class="userBodyDetail">
                      <p>{t("health-data-center.blood")}</p>
                      <h5>O+</h5>
                    </div>
                    <div class="userBodyDetail">
                      <p>{t("health-data-center.height")}</p>
                      <h5>
                        {isLoading ? (
                          <SmallLoader />
                        ) : profile?.height ? (
                          `${profile.height} cm`
                        ) : (
                          "N/A"
                        )}
                      </h5>
                    </div>
                    <div class="userBodyDetail">
                      <p>{t("health-data-center.weight")}</p>
                      <h5>
                        {isLoading ? (
                          <SmallLoader />
                        ) : profile?.weight ? (
                          `${profile.weight} KG`
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
          <div class="col-lg-8 col-md-12">
            <div class="row g-3">
              <div class="col-md-3">
                <div class="pulse bg-white padding-20 border-radius-20 h-100">
                  <div class="up">
                    <p>{t("health-data-center.pulse")}</p>{" "}
                    <img
                      src="../images/user-dashboard/redHeart.svg"
                      class="img-fluid"
                    />
                  </div>
                  <div class="down">
                    <h6>{isLoading ? <SmallLoader /> : heartRate || "N/A"}</h6>
                    <p>{t("health-data-center.pulse")}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stepTaken bg-white padding-20 border-radius-20 h-100">
                  <div class="taken">
                    <img
                      src="../images/user-dashboard/stepTeken.svg"
                      class="img-fluid"
                    />{" "}
                    <div>
                      {" "}
                      {isLoading ? <SmallLoader /> : `${steps || "N/A"}`}{" "}
                      <span>/ 10000</span>
                      <p>{t("health-data-center.steps-taken")}</p>
                    </div>
                  </div>
                </div>
              </div>
              {console.log(">>>>>>>>>>>>>>>userProfile", userProfile)}
              <div class="col-md-3">
                <div class="burned bg-white padding-20 border-radius-20 h-100">
                  <div class="up">
                    <h6>{isLoading ? <SmallLoader /> : calories || "N/A"}</h6>
                    <p>kcal</p>
                  </div>
                  <div class="down">
                    <p>{t("health-data-center.burned")}</p>
                    <img
                      src="../images/user-dashboard/burned.svg"
                      class="img-fluid"
                    />{" "}
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="distanceCovered bg-white padding-20 border-radius-20 h-100">
                  <div class="covered">
                    <img
                      src="../images/user-dashboard/distanceCovered.svg"
                      class="img-fluid"
                    />{" "}
                    <div>
                      <h6>
                        {isLoading ? (
                          <SmallLoader />
                        ) : totalDistance ? (
                          `${totalDistance}k`
                        ) : (
                          "0"
                        )}
                      </h6>
                      <p>{t("health-data-center.distance-covered")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-8">
                <div class="fitnessActivity bg-white border-radius-20 padding-20">
                  <div class="top">
                    <h5>{t("health-data-center.fitness-activity")}</h5>
                    <div class="fitnessDrp">
                      <img
                        src="../images/user-dashboard/calender_blue.svg"
                        class="img-fluid"
                      />
                      <select>
                        <option>{t("health-data-center.monthly")}</option>
                        <option>{t("edit-profile.years")}</option>
                        <option>{t("health-data-center.days")}</option>
                      </select>
                    </div>
                  </div>
                  <div class="chartSection">
                    <img
                      src="../images/user-dashboard/healthChart.webp"
                      class="img-fluid w-100"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="modes bg-white border-radius-20 padding-20">
                  <a href="#">
                    <img
                      src="../images/doctor-dashboard/threeDots.webp"
                      class="img-fluid"
                    />
                  </a>
                  <div class="modeSection">
                    <img
                      src="../images/user-dashboard/nightMode.webp"
                      class="img-fluid"
                    />
                  </div>
                  <h6>{t("health-data-center.hours-of-sleep")}</h6>
                  <p>
                    {isLoading ? (
                      <SmallLoader />
                    ) : (
                      `${sleep.hours}h:${sleep.minutes
                        .toString()
                        .padStart(2, "0")} mins `
                    )}
                  </p>
                </div>
              </div>
              <div class="col-md-8">
                <div class="healthReport">
                  <h4>{t("health-data-center.health-reports")}</h4>
                  <div class="bmi bg-white">
                    <h5>{isLoading ? <SmallLoader /> : bmi || "N/A"}</h5>
                    <p>BMI</p>
                  </div>
                  <div class="row">
                    <div class="col-lg-5 col-md-6">
                      <div class="chrtIncrement">
                        <div class="chartPart">
                          <img
                            src="../images/user-dashboard/greenChartIncrement.webp"
                            class="img-fluid"
                          />
                        </div>
                        <div class="reportData">
                          <h6>{t("health-data-center.weight-change")}</h6>
                          <p>
                            {profile?.weight && weight
                              ? calculateWeightChange(profile.weight, weight)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-5 col-md-6">
                      <div class="chrtIncrement">
                        <div class="chartPart">
                          <img
                            src="../images/user-dashboard/blueChartIncrement.webp"
                            class="img-fluid"
                          />
                        </div>
                        <div class="reportData">
                          <h6>{t("health-data-center.general-health")}</h6>
                          <p class="text-graylight">
                            78% {t("health-data-center.increase")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="waterTaken bg-white border-radius-20 padding-20 h-100">
                  <h6>
                    {isLoading ? (
                      <SmallLoader />
                    ) : (
                      `${water ? `${Number(water).toFixed(1)} ml` : "N/A"}`
                    )}{" "}
                    / 7500 ml
                  </h6>
                  <div class="d-flex align-items-center gap-2 text-mainblue">
                    <img
                      src="../images/user-dashboard/waterDrop.svg"
                      class="img-fluid"
                    />{" "}
                    {t("health-data-center.water-taken")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-2">
            <div class="healthQuest" onClick={() => setOpen(true)}>
              <img src="../dashboard-user/../images/user-dashboard/health-quest.webp" />
              <p>
                {t("health-data-center.health")}{" "}
                <span>{t("health-data-center.quest")}</span>
              </p>
            </div>
          </div>
          <div class={`col-md-10 ${list?.length > 0 ? "acc-height" : ""}`}>
            <div class="bg-darkgreen padding-20 border-radius-20 h-100">
              {list?.length > 0 && <Accordion list={list} />}
            </div>
          </div>
          <CommonModal
            show={open}
            // title={t("prescription.add-prescription")}
            body={getForm()}
            size="md"
            onHide={() => setOpen(false)}
            className=""
            footerButtons={[
              {
                label: "Save",
                onClick: handleSubmit,
                className: "transparent_btn",
              },
              { label: "Cancel", onClick: closeModal, className: "blue_btn" },
            ]}
          ></CommonModal>
        </div>
      </div>
    </div>
  );
};

export default UserHealthDataCenter;
