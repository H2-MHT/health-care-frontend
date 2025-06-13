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
   const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
   console.log(isProfiledata,">>>>isProfiledata")
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
                        Dr.{isProfiledata?.first_name} {isProfiledata?.last_name}
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
                      Planned hourly rate : {isProfiledata?.planned_hourly_rate||0}
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
            <h3>Latest reviews</h3>
            <div class="reviewInner">
              <div class="left">
                <div class="trustRight">
                  <div class="trustScore">
                    <h5>My trust score</h5>
                    <div class="score">
                      <img
                        src="../images/user-dashboard/star.png"
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
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorView;
