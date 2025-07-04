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
  const [userInfo, setUserInfo] = useState([]);
  const [licensesdetail, setLicensesdetail] = useState();
  const [mediadigestDetails, setMediadigestDetails] = useState();
  const [selectedDoctorAppointement, setSelectedDoctorAppointement] =
    useState();
  const { doctor = null } = location.state || {};

  const makeAppointment = (item) => {
    setShowFirstModal(true);
    setSelectedDoctorAppointement(item);
  };

  useEffect(() => {
    getUserInfo(id);
  }, [id]);

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
  };

  const getMediaDigest = async () => {
    try {
      const response = await fetchDataAuth(
        "doctors/media-digest-document/",
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setMediadigestDetails(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLicensesData = async () => {
    try {
      const response = await fetchDataAuth(
        "doctors/licence-certificate/",
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setLicensesdetail(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getLicensesData();
    getMediaDigest();
  }, []);

  console.log(licensesdetail, ">>>licensesdetail");

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
                  {doctor?.professional_stat}
                  <span class="text-mainblue">
                    {" "}
                    {doctor?.experience_years || 0} years of practice{" "}
                  </span>
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
                      <span class="text-red">{doctor?.professional_stat}</span>
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
                  </div>
                </div>

                <div class="doctor_call mt-5">
                  <sapn className="transparent_btn">
                    Planned Fee: {doctor?.planned_hourly_rate}
                  </sapn>
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
                <div className="userInfo" onClick={() => setActiveTab("Info")}>
                  Info
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
                {mediadigestDetails?.map((item) => (
                  <div className="mediaBox d-flex gap-2 " key={item?.id}>
                    <img
                      src={item?.attachment_file}
                      className="w-100 "
                      alt="Media"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab == "licenses" && (
            <div>
              <div class="reviewInner">
                {licensesdetail?.map((item) => (
                  <div className="mediaBox d-flex gap-2" key={item?.id}>
                    <img src={item?.attachment} className="w-100" alt="Media" />
                  </div>
                ))}
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
