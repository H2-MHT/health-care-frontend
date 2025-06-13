import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DoctorPublicReviews from "./doctorPublicReviews";
import Image from "../../../../components/form/Image";
import { useTranslation } from "react-i18next";

const DoctorPublicView = () => {
  const [totalReviewSum, setTotalReviewSum] = useState(0);
   const { t } = useTranslation();
  const [reviewData, setReviewData] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const location = useLocation();
  const { doctor = null } = location.state || {};
  return (
    <div class="rightContent">
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
                <Image src={doctor?.profile_picture} />
              </div>
              <div class="right">
                <div class="para">
                 {t("edit-profile.maternal-medicine")}{" "}
                  <span class="text-mainblue">
                    {" "}
                    {doctor?.years || 0} {t("edit-profile.years-practice")}
                  </span>
                </div>
                <div class="dcNm">
                  <div class="Nm">
                    <img src="images/batch.svg" />
                    <span class="text-mainblue">
                     {t("support.dr")} {doctor?.first_name} {doctor?.last_name}
                    </span>
                  </div>
                  <div class="dcSpecialist">
                    <div class="d-flex justify-content-center align-items-center flex-column gap-1 spclt">
                      <img src="images/gyne.svg" />
                      <span class="text-red">{doctor?.professional_stat }</span>
                    </div>
                    <div class="bStar d-flex align-items-center gap-2">
                      <img src="images/black-star.svg" />
                      <span class="text-black ">{doctor?.rating || 0}</span>
                    </div>
                  </div>
                </div>

                <div class="locations-call">
                  <div class="loc">
                    <div class="d-flex align-items-center gap-2">
                      <img src="images/mappin.svg" />
                      <span class="text-green">{doctor?.clinic_name}</span>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                      <img src="images/flag.svg" />
                      <div class="langs">
                        EN
                        <img src="images/flag.svg" />
                      </div>
                    </div>
                  </div>
                  <div class="toggle" onclick="toggleActive(this)">
                    <div class="circle">
                      <img src="images/phone.png" class="img-fluid" />
                    </div>
                    <span class="label">Urgent call</span>
                  </div>
                </div>

                <div class="doctor_call mt-5">
                  <a
                    href="#"
                    class="light_black_btn d-flex align-items-center gap-3"
                  >
                    <img src="images/askQ.png" /> ask a question
                  </a>
                  <a href="#" class="blue_btn d-flex align-items-center gap-3">
                    Make Appointment <img src="images/calendar.svg" />{" "}
                  </a>
                </div>
              </div>
            </div>
            <div class="doctorData">
              <div class="left">
                <h4>Areas of Expertise</h4>
                <p>{doctor?.expertise}</p>
              </div>
              <hr />
              <div class="right">
                <h4>Biography</h4>
                <p>{doctor?.bio}</p>
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
                <li className={activeTab === "Licenses" ? "active" : ""}>
                <div
                    className="userInfo"
                    onClick={() => setActiveTab("Licenses")}
                  >
                    Licenses
                  </div>
                </li>
                {/* <li className={activeTab === "Reviews" ? "active" : ""}>
                <div
                    className="userInfo"
                    onClick={() => setActiveTab("Reviews")}
                  >
                    Reviews
                  </div>
                </li> */}
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
                <li className={activeTab === "Full Scedule" ? "active" : ""}>
                <div
                    className="userInfo"
                    onClick={() => setActiveTab("Full Scedule")}
                  >
                   Full Scedule
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
       

        <div class="reviews">
          <div class="tabbing">
            <ul>
              <li>
                <a href="#">Prof History</a>
              </li> 
              <li>
                <a href="#">Licenses</a>
              </li>
              <li class="active">
                <a href="#">Reviews</a>
              </li>
              <li>
                <a href="#">Media digests</a>
              </li>
              <li>
                <a href="#">Info</a>
              </li>
              <li>
                <a href="#">Full Scedule</a>
              </li>
            </ul>
          </div>
          {/* <h3>Latest reviews</h3> */}
          <div class="reviewInner">
            {/* <div class="left">
              <div class="trustRight">
                <div class="trustScore">
                  <h5>My trust score</h5>
                  <div class="score">
                    <img src="images/star.png" class="img-fluid" />
                    <div class="scoreData">
                      {totalReviewSum / reviewData?.length}
                    </div>
                  </div>
                </div>
                <div class="trustRate">
                  <div class="rate">{reviewData?.length}</div>
                  reviews
                </div>
              </div>
            </div> */}
             {activeTab == "history" && (
            <div>
              <div class="reviewInner">
                <div class="left">coming soon...</div>
              </div>
            </div>
          )}
             {activeTab == "Licenses" && (
            <div>
              <div class="reviewInner">
                <div class="left">coming soon...</div>
              </div>
            </div>
          )}
             {activeTab == "Media digests" && (
            <div>
              <div class="reviewInner">
                <div class="left">coming soon...</div>
              </div>
            </div>
          )}
               {activeTab == "Info" && (
            <div>
              <div class="reviewInner">
                <div class="left">coming soon...</div>
              </div>
            </div>
          )}
              {activeTab == "Full Scedule" && (
            <div>
              <div class="reviewInner">
                <div class="left">coming soon...</div>
              </div>
            </div>
          )}
            <DoctorPublicReviews
              setTotalReviewSum={setTotalReviewSum}
              setReviewData={setReviewData}
              reviewData={reviewData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPublicView;
