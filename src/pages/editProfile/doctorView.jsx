import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Image from "../../components/form/Image";
import { useSelector } from "react-redux";

const DoctorView = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [totalReviewSum, setTotalReviewSum] = useState(0);
  const [reviewData, setReviewData] = useState([]);
  const { doctor } = location.state || {};
  const [activeTab, setActiveTab] = useState("reviews");
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);

  return (
    <>
      <div class="rightContent p-5">
        <div class="profileMobile">
          <div class="nameMobile">Hello, dr,Ava Williams!</div>
          <div class="profileImgMobile">
            <img src="images/profile-sample.png" class="img-fluid" />
          </div>
        </div>

        <div class="publicViewMain bg-white border-radius-20">
          <div class="doc_public_view ">
            <div class="docDetails">
              <div class="doctorsName">
                <div class="img-part">
                  <Image src={isProfiledata?.profile_picture} />
                </div>
                <div class="right">
                  <div class="para">
                    {isProfiledata?.professional_stat}
                    <span class="text-mainblue">
                      {" "}
                      {isProfiledata?.experience_years || 0} years of practice
                    </span>
                  </div>
                  <div class="dcNm">
                    <div class="Nm">
                      <img src="../images/user-dashboard/batch.svg" />
                      <span class="text-mainblue">
                        Dr.{isProfiledata?.first_name}{" "}
                        {isProfiledata?.last_name}
                      </span>
                    </div>
                    <div class="dcSpecialist">
                      <div class="d-flex justify-content-center align-items-center flex-column gap-1 spclt">
                        {/* <img src="../images/user-dashboard/gyne.svg" /> */}
                        <span class="text-red">
                          {" "}
                          {isProfiledata?.professional_stat}
                        </span>
                      </div>
                      {/* <div class="bStar d-flex align-items-center gap-2">
                        <img src="../images/user-dashboard/black-star.svg" />
                        <span class="text-black ">{doctor?.rating || 0}</span>
                      </div> */}
                    </div>
                  </div>

                  <div class="locations-call">
                    <div class="loc">
                      <div class="d-flex align-items-center gap-2">
                        <img src="../images/user-dashboard/mappin.svg" />
                        <span class="text-green">
                          {isProfiledata?.country || "France"}
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
                    {/* <div class="toggle" onclick="toggleActive(this)">
                      <div class="circle">
                        <img
                          src="../images/user-dashboard/phone.png"
                          class="img-fluid"
                        />
                      </div>

                    </div> */}
                  </div>

                  <div class="doctor_call mt-5">
                    {/* <span className="transparent_btn">
                      Urgent hourly rate : {doctor?.urgent_hourly_rate}
                    </span> */}
                    <span className="transparent_btn">
                      Planned hourly rate :{" "}
                      {isProfiledata?.planned_hourly_rate || 0}
                    </span>

                    <Link
                      to={"/login"}
                      className="blue_btn d-flex align-items-center gap-3"
                    >
                      {t("all-doctor-list.make-appointment")}
                    </Link>
                  </div>
                </div>
              </div>
              <div class="doctorData">
                <div class="left">
                  <h4>Areas of Expertise</h4>
                  <p>{isProfiledata?.expertise} </p>
                </div>
                <hr />
                <div class="right">
                  <h4>Biography</h4>
                  <p>{isProfiledata?.bio} </p>
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
        </div>
      </div>
    </>
  );
};

export default DoctorView;
