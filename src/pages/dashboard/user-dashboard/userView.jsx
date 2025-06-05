import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Image from "../../../components/form/Image";
import UserPublicReviews from "./userPublicReviews";
import { fetchData, fetchDataAuth } from "../../../hooks/services/services";
import AppointmentModal from "../../patient/appointment/appointmentModal";

const UserView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [totalReviewSum, setTotalReviewSum] = useState(0);
  const [reviewData, setReviewData] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [userInfo, setUserInfo] = useState([])
  const [selectedDoctorAppointement, setSelectedDoctorAppointement] =
    useState();
  const { doctor = null } = location.state || {};

  const makeAppointment = (item) => {
    setShowFirstModal(true);
    setSelectedDoctorAppointement(item);
  };

  useEffect(()=>{
    getUserInfo(id);
  },[id])

  const getUserInfo = async (id) => {
try {
      const response = await fetchData(
        `doctors/doctor-info/?doctor_user_id=${id}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const responseData = await response.json();
      setUserInfo(responseData);
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.log(error.message);
    }
  }

  return (
    <div class="rightContent rightsidefull">
      <div class="profileMobile">
        <div class="nameMobile">Hello, dr,Ava Williams!</div>
        <div class="profileImgMobile">
          <Image src={doctor?.profile_picture} />
        </div>
      </div>

      <div class="publicViewMain bg-white border-radius-20">
        <div class="doc_public_view ">
          <div class="docDetails">
            <div class="doctorsName">
              <div class="img-part">
                <Image src={doctor?.profile_picture} />
              </div>
              <div class="right">
                <div class="para">
                  Maternal-Fetal Medicine
                  <span class="text-mainblue"> {doctor?.experience_years || 0} years of practice</span>
                </div>
                <div class="dcNm">
                  <div class="Nm">
                    <img src="../../images/batch.svg" />
                    <span class="text-mainblue">
                      Dr.{doctor?.first_name} {doctor?.last_name}
                    </span>
                  </div>
                  <div class="dcSpecialist">
                    <div class="d-flex justify-content-center align-items-center flex-column gap-1 spclt">
                      {/* <img src="../../images/user-dashboard/gyne.svg" /> */}
                      <span class="text-red">
                        {doctor?.speciality}
                      </span>
                    </div>
                    {/* <div class="bStar d-flex align-items-center gap-2">
                      <img src="../../images/black-star.svg" />
                      <span class="text-black ">{doctor?.rating || 0}</span>
                    </div> */}
                  </div>
                </div>

                <div class="locations-call">
                  <div class="loc">
                    <div class="d-flex align-items-center gap-2">
                      <img src="/images/mappin.svg" />
                      <span class="text-green">
                        {doctor?.city}, {doctor?.country}
                      </span>
                    </div>
                    {/* <div class="d-flex align-items-center gap-3">
                          <img src="../images/user-dashboard/flag.svg"/>
                          <div class="langs">
                            EN
                            <img src="../images/user-dashboard/flag.svg" />
                          </div>
                        </div> */}
                  </div>
                  <div class="toggle" onclick="toggleActive(this)">
                    <div class="circle">
                      <img
                        src="../../images/doctor-dashboard/phone.png"
                        class="img-fluid"
                      />
                    </div>
                    <span class="label">Urgent call </span>
                  </div>
                </div>

                <div class="doctor_call mt-5">
                  {/* <sapn className="transparent_btn">
                    urgent fee: {doctor?.urgent_hourly_rate}{" "}
                  </sapn> */}
                  <sapn className="transparent_btn">
                    Planned Fee: {doctor?.planned_hourly_rate}
                  </sapn>
                  {/* <a
                    class="light_black_btn d-flex align-items-center gap-3"
                  >
                    <img src="../../images/user-dashboard/askQ.png" /> ask a
                    question
                  </a> */}
                  <a
                    class="blue_btn d-flex align-items-center gap-3"
                    onClick={() => makeAppointment(doctor)}
                  >
                    Make Appointment{" "}
                    <img src="../../images/user-dashboard/calendar.svg" />{" "}
                  </a>
                </div>
              </div>
            </div>
            <div class="doctorData">
              <div class="left">
                <h4>Areas of Expertise</h4>
                <p>{doctor?.expertise} </p>
              </div>
              <hr />
              <div class="right">
                <h4>Biography</h4>
                <p>{doctor?.bio} </p>
              </div>
            </div>
            <div class="tabbing">
              <ul>
                <li className={activeTab === "history" ? "active" : ""}>
                  <div
                    className="userInfo"
                    onClick={() => setActiveTab("history")}
                  >
                    Prof History
                  </div>
                </li>
                <li className={activeTab === "licenses" ? "active" : ""}>
                  <div
                    className="userInfo"
                    onClick={() => setActiveTab("licenses")}
                  >
                    Licenses
                  </div>
                </li>
                <li className={activeTab === "reviews" ? "active" : ""}>
                  <div
                    className="userInfo"
                    onClick={() => setActiveTab("reviews")}
                  >
                    Reviews
                  </div>
                </li>
                <li className={activeTab === "Media digests" ? "active" : ""}>
                  <div
                    className="userInfo"
                    onClick={() => setActiveTab("Media digests")}
                  >
                    Media digests
                  </div>
                </li>
                <li className={activeTab === "Info" ? "active" : ""}>
                  <div
                    className="userInfo"
                    onClick={() => setActiveTab("Info")}
                  >
                    Info
                  </div>
                </li>
                <li className={activeTab === "schedule" ? "active" : ""}>
                  <div
                    className="userInfo"
                    onClick={() => setActiveTab("schedule")}
                  >
                    Full Schedule
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* <div class="recomend">
                <h6>Recomendadions</h6>
                <div class="recomendBox">
                  <a href="#" class="wishlist"><img src="../images/user-dashboard/wishlist.svg" /></a>
                  <a href="#" class="cross"><img src="../images/user-dashboard/cross.svg" /></a>
                  <div class="left">
                    <div class="docrecomdpart">
                      <div class="docImg">
                        <img src="../images/user-dashboard/sample-doc.svg" />
                        <img src="../images/user-dashboard/flag.svg" class="docflag"/>
                      </div>
                      <div class="drRdetail">
                        <div class="top">
                          <div class="verified">
                            <img src="../images/user-dashboard/batch.svg" /> 
                            Verified Doctor
                          </div>
                          <div class="bStar d-flex align-items-center gap-2">
                            <img src="../images/user-dashboard/black-star.svg" />
                            <span class="text-black ">4.6</span>
                          </div>
                        </div>
                        <div class="recondName">Dr. Jacob Lopez, M.D.</div>
                        <div class="blueLoca d-flex align-items-center gap-2">
                          <img src="../images/user-dashboard/mpin-blue.svg" /> <span class="text-mainblue">Leon, France</span>
                        </div>
                        <div class="langSpeak">
                          <span>Fr</span>
                          <span>En</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#reschdule2" class="blue_btn d-flex align-items-center gap-2">
                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.63518 3.59329C1.88134 3.59391 1.00133 3.2822 1 2.50112C0.998743 1.7591 1.81488 1.44599 2.63154 1.44531L10.0687 1.44531C10.8262 1.44531 11.1103 1.87775 11.1103 2.32528V3.59329M13.4344 6.71761H10.7195C9.59111 6.71761 8.67633 7.63558 8.67633 8.76795C8.67633 9.90032 9.59111 10.8183 10.7195 10.8183H13.4344M10.6259 8.86559H10.7195M1 2.61693V12.4781C1 13.0123 1.41361 13.4453 1.92382 13.4453H13.0762C13.5864 13.4453 14 13.0123 14 12.4781V4.56051C14 4.02633 13.5864 3.59329 13.0762 3.59329H2.62195" stroke="white" stroke-linecap="round"/>
                            </svg>                            
                            65$
                          </a>
                          <a href="#" class="transparent_btn ">Info</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="right">
                    <div class="greenimg">
                      <img src="../images/user-dashboard/general-medicine.svg" />
                      <span>General medicine</span>
                    </div>
                    <div class="exp">
                      <span>Generalist</span>
                      <span class="text-mainblue">6 yp</span>
                    </div>
                    <div class="file"><img src="../images/user-dashboard/verification.svg" class="img-fluid" /></div>
                  </div>
                </div>
                <div class="recomendBox">
                  <a href="#" class="wishlist"><img src="../images/user-dashboard/wishlist.svg" /></a>
                  <a href="#" class="cross"><img src="../images/user-dashboard/cross.svg" /></a>
                  <div class="left">
                    <div class="docrecomdpart">
                      <div class="docImg">
                        <img src="../images/user-dashboard/sample-doc.svg" />
                        <img src="../images/user-dashboard/flag.svg" class="docflag"/>
                      </div>
                      <div class="drRdetail">
                        <div class="top">
                          <div class="verified">
                            <img src="../images/user-dashboard/batch.svg" /> 
                            Verified Doctor
                          </div>
                          <div class="bStar d-flex align-items-center gap-2">
                            <img src="../images/user-dashboard/black-star.svg" />
                            <span class="text-black ">4.6</span>
                          </div>
                        </div>
                        <div class="recondName">Dr. Jacob Lopez, M.D.</div>
                        <div class="blueLoca d-flex align-items-center gap-2">
                          <img src="../images/user-dashboard/mpin-blue.svg" /> <span class="text-mainblue">Leon, France</span>
                        </div>
                        <div class="langSpeak">
                          <span>Fr</span>
                          <span>En</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#reschdule2" class="blue_btn d-flex align-items-center gap-2">
                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.63518 3.59329C1.88134 3.59391 1.00133 3.2822 1 2.50112C0.998743 1.7591 1.81488 1.44599 2.63154 1.44531L10.0687 1.44531C10.8262 1.44531 11.1103 1.87775 11.1103 2.32528V3.59329M13.4344 6.71761H10.7195C9.59111 6.71761 8.67633 7.63558 8.67633 8.76795C8.67633 9.90032 9.59111 10.8183 10.7195 10.8183H13.4344M10.6259 8.86559H10.7195M1 2.61693V12.4781C1 13.0123 1.41361 13.4453 1.92382 13.4453H13.0762C13.5864 13.4453 14 13.0123 14 12.4781V4.56051C14 4.02633 13.5864 3.59329 13.0762 3.59329H2.62195" stroke="white" stroke-linecap="round"/>
                            </svg>                            
                            65$
                          </a>
                          <a href="#" class="transparent_btn ">Info</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="right">
                    <div class="greenimg">
                      <img src="../images/user-dashboard/general-medicine.svg" />
                      <span>General medicine</span>
                    </div>
                    <div class="exp">
                      <span>Generalist</span>
                      <span class="text-mainblue">6 yp</span>
                    </div>
                    <div class="file"><img src="../images/user-dashboard/verification.svg" class="img-fluid" /></div>
                  </div>
                </div>
                <div class="recomendBox">
                  <a href="#" class="wishlist"><img src="../images/user-dashboard/wishlist.svg" /></a>
                  <a href="#" class="cross"><img src="../images/user-dashboard/cross.svg" /></a>
                  <div class="left">
                    <div class="docrecomdpart">
                      <div class="docImg">
                        <img src="../images/user-dashboard/sample-doc.svg" />
                        <img src="../images/user-dashboard/flag.svg" class="docflag"/>
                      </div>
                      <div class="drRdetail">
                        <div class="top">
                          <div class="verified">
                            <img src="../images/user-dashboard/batch.svg" /> 
                            Verified Doctor
                          </div>
                          <div class="bStar d-flex align-items-center gap-2">
                            <img src="../images/user-dashboard/black-star.svg" />
                            <span class="text-black ">4.6</span>
                          </div>
                        </div>
                        <div class="recondName">Dr. Jacob Lopez, M.D.</div>
                        <div class="blueLoca d-flex align-items-center gap-2">
                          <img src="../images/user-dashboard/mpin-blue.svg" /> <span class="text-mainblue">Leon, France</span>
                        </div>
                        <div class="langSpeak">
                          <span>Fr</span>
                          <span>En</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#reschdule2" class="blue_btn d-flex align-items-center gap-2">
                            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.63518 3.59329C1.88134 3.59391 1.00133 3.2822 1 2.50112C0.998743 1.7591 1.81488 1.44599 2.63154 1.44531L10.0687 1.44531C10.8262 1.44531 11.1103 1.87775 11.1103 2.32528V3.59329M13.4344 6.71761H10.7195C9.59111 6.71761 8.67633 7.63558 8.67633 8.76795C8.67633 9.90032 9.59111 10.8183 10.7195 10.8183H13.4344M10.6259 8.86559H10.7195M1 2.61693V12.4781C1 13.0123 1.41361 13.4453 1.92382 13.4453H13.0762C13.5864 13.4453 14 13.0123 14 12.4781V4.56051C14 4.02633 13.5864 3.59329 13.0762 3.59329H2.62195" stroke="white" stroke-linecap="round"/>
                            </svg>                            
                            65$
                          </a>
                          <a href="#" class="transparent_btn ">Info</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="right">
                    <div class="greenimg">
                      <img src="../images/user-dashboard/general-medicine.svg" />
                      <span>General medicine</span>
                    </div>
                    <div class="exp">
                      <span>Generalist</span>
                      <span class="text-mainblue">6 yp</span>
                    </div>
                    <div class="file"><img src="../images/user-dashboard/verification.svg" class="img-fluid" /></div>
                  </div>
                </div>
              </div>  */}
        </div>

        <div class="reviews reviewsInfo">
          <div class="tabbing">
            <ul>
              <li className={activeTab === "history" ? "active" : ""}>
                <div
                  className="userInfo"
                  onClick={() => setActiveTab("history")}
                >
                  Prof History
                </div>
              </li>
              <li className={activeTab === "licenses" ? "active" : ""}>
                <div
                  className="userInfo"
                  onClick={() => setActiveTab("licenses")}
                >
                  Licenses
                </div>
              </li>
              <li className={activeTab === "reviews" ? "active" : ""}>
                <div
                  className="userInfo"
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </div>
              </li>
              <li className={activeTab === "Media digests" ? "active" : ""}>
                <div
                  className="userInfo"
                  onClick={() => setActiveTab("Media digests")}
                >
                  Media digests
                </div>
              </li>
              <li className={activeTab === "Info" ? "active" : ""}>
                <div className="userInfo" onClick={() => setActiveTab("Info")}>
                  Info
                </div>
              </li>
              <li className={activeTab === "schedule" ? "active" : ""}>
                <div
                  className="userInfo"
                  onClick={() => setActiveTab("schedule")}
                >
                  Full Schedule
                </div>
              </li>
            </ul>
          </div>
          {activeTab == "reviews" && (
            <>
              <h3>Latest reviews</h3>
              <div class="reviewInner">
                <div class="left">
                  <div class="trustRight">
                    <div class="trustScore">
                      <h5>My trust score</h5>
                      <div class="score">
                        <img
                          src="../../images/user-dashboard/star.png"
                          class="img-fluid"
                        />
                        <div class="scoreData">
                          {totalReviewSum > 0
                            ? totalReviewSum / reviewData?.length
                            : totalReviewSum}
                        </div>
                      </div>
                    </div>
                    <div class="trustRate">
                      <div class="rate">{reviewData?.length}</div>
                      reviews
                    </div>
                  </div>
                </div>
                <UserPublicReviews
                  setTotalReviewSum={setTotalReviewSum}
                  setReviewData={setReviewData}
                  reviewData={reviewData}
                />
              </div>
            </>
          )}
          {activeTab == "history" && (
            <div>
              <div class="reviewInner">
                <div class="left">coming soon...</div>
              </div>
            </div>
          )}
          {activeTab == "schedule" && (
            <div>
              <div class="reviewInner">
                <div class="left">coming soon...</div>
              </div>
            </div>
          )}
          {activeTab == "Media digests" && (
            <div>
              <div class="reviewInner">
                <div class="left">Media digests</div>
              </div>
            </div>
          )}
          {activeTab == "licenses" && (
            <div>
              <div class="reviewInner">
                <div class="left">licenses</div>
              </div>
            </div>
          )}
          {activeTab == "Info" && (
            <div>
              <div class="reviewInner">
                <div class="left">Info</div>
              </div>
            </div>
          )}
        </div>
        <AppointmentModal
          setShowFirstModal={setShowFirstModal}
          showFirstModal={showFirstModal}
          selectedDoctorAppointement={selectedDoctorAppointement}
        />
      </div>
    </div>
  );
};

export default UserView;
