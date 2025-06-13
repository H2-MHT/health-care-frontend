import React, { useEffect,useState } from 'react'
import {useLocation} from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from "swiper/modules";
import { fetchDataAuth } from '../../../hooks/services/services';
import { useTranslation } from "react-i18next";

const FavClinicPublicView=()=> {
  const { t } = useTranslation();
  const location = useLocation()
  const { clinic = null } = location.state || {};
  const [clinicDoctorList,setClinicDoctorList]=useState()
    const [activeTab, setActiveTab] = useState("Specialisties");

  const getClinicList = async () => {
    // setLoading(true);
    try {
      const response = await fetchDataAuth("clinics/doctors/");
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setClinicDoctorList(getData.data)
      // setLoading(false);
    } catch (error) {
      console.log(error.message);
      // setLoading(false);
    }
  };
  useEffect(() => {
    getClinicList();
  }, []);
  return (
    <>
      <div class="rightContent p-0 clinicPubView">
        <div class="publicViewMain bg-white border-radius-20">
          <div class="clinicPublicView">
            <img
              src={clinic?.profile_picture || "../images/user-dashboard/clinic_head.svg"}
              class="img-fluid w-100"
            />
          </div>
          <div class="doc_public_view ">
            <div class="docDetails">
              <div class="clinicpublic_headMain">
                <h3>{clinic?.name}</h3>
                <div class="locationShare">
                  <div class="clinic_headPublic d-flex justify-content-between gap-2">
                    <div class="loc d-flex gap-3">
                      <div class="d-flex align-items-center gap-3">
                        <img src="../images/user-dashboard/flag.svg" />
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <img src="../images/user-dashboard/mappin.svg" />
                        <span class="text-green">{clinic?.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="doctorData">
                <p>
                  viverra nibh Praesent Quisque placerat placerat cursus non
                  amet, adipiscing elit. urna nisl. viverra enim. elementum ac
                  nec{" "}
                </p>
                <p>
                  quis Nam non in lacus, id ultrices ex. at elit at, maximus non
                  ex porta ullamcorper Nunc tortor. faucibus non, Quisque id{" "}
                </p>
                <p>
                  leo. varius Nullam vehicula, vitae diam varius nisl.
                  sollicitudin. venenatis sollicitudin. at dui. urna.
                  ullamcorper urna viverra nibh Praesent Quisque placerat
                  placerat cursus non amet, adipiscing elit. urna nisl. viverra
                  enim. elementum ac nec{" "}
                </p>
                <p>
                  quis Nam non in lacus, id ultrices ex. at elit at, maximus non
                  ex porta ullamcorper Nunc tortor. faucibus non, Quisque id{" "}
                </p>
                <p>
                  leo. varius Nullam vehicula, vitae diam varius nisl.
                  sollicitudin. venenatis sollicitudin. at dui. urna.
                  ullamcorper urna{" "}
                </p>
                <p>
                  leo. varius Nullam vehicula, vitae diam varius nisl.
                  sollicitudin. venenatis sollicitudin. at dui. urna.
                  ullamcorper urna{" "}
                </p>
              </div>
              <div class="tabbing">
                <ul>
                  <li  className={activeTab === "Specialisties" ? "active" : ""}>
                  <div
                    className="userInfo"
                    onClick={() => setActiveTab("Specialisties")}
                  >
                    Specialisties
                  </div>
                  </li>
                  <li  className={activeTab === "Doctors" ? "active" : ""}>
                  <div
                    className="userInfo"
                    onClick={() => setActiveTab("Doctors")}
                  >
                    Doctors
                  </div>
                  </li>
                  <li className={activeTab === "Reviews" ? "active" : ""}>
                  <div
                    className="userInfo"
                    onClick={() => setActiveTab("Reviews")}
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
              {activeTab == "Specialisties" && (
            <div>
              <div class="reviewInner">
                <div class="left">coming soon...</div>
              </div>
            </div>
          )}
                  {activeTab == "Doctors" && (
            <div>
              <div class="reviewInner">
                <div class="left">coming soon...</div>
              </div>
            </div>
          )}
              {activeTab == "Reviews" && (
            <div>
              <div class="reviewInner">
                <div class="left">Reviews...</div>
              </div>
            </div>
          )}
             {activeTab == "Media digests" && (
            <div>
              <div class="reviewInner">
                <div class="left">Media digests...</div>
              </div>
            </div>
          )}
             {activeTab == "Info" && (
            <div>
              <div class="reviewInner">
                <div class="left">Info...</div>
              </div>
            </div>
          )}
                  </div>

            <div class="trustRight">
              <div class="trustScore">
                <h5>My trust score</h5>
                <div class="score">
                  <img
                    src="../images/user-dashboard/star.png"
                    class="img-fluid"
                  />
                  <div class="scoreData">4,69</div>
                </div>
              </div>
              <div class="trustRate">
                <div class="rate">1,206</div>
                reviews
              </div>
            </div>
          </div>

          <div class="reviews">
            <div class="tabbing">
              <ul>
                <li>
                  <a href="#">Prof History </a>
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
            <div class="reviewInner">
              <div class="w-100">
                <div class="owl-carousel owl-theme">
                  <Swiper
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper"
                  >
                    {clinicDoctorList?.map((item) => (
                      <SwiperSlide>
                        <div class="item">
                          <div class="recomend">
                            <div class="recomendBox">
                              <div class="d-flex gap-3">
                                <div class="left">
                                  <div class="docrecomdpart">
                                    <div class="docImg">
                                      <img src="../images/user-dashboard/sample-doc.svg" />
                                      <img
                                        src="../images/user-dashboard/flag.svg"
                                        class="docflag"
                                      />
                                    </div>

                                    <div class="drRdetail">
                                      <div class="top">
                                        <div class="verified">
                                          <img src="../images/user-dashboard/batch.svg" />
                                          Generalist
                                          <span class="main-blue-text">
                                            14 years practice
                                          </span>
                                        </div>
                                      </div>
                                      <div class="recondName">
                                        {item?.first_name} {item?.last_name}
                                      </div>
                                      <div class="clinicLoca d-flex align-items-center gap-2">
                                        <img src="../images/user-dashboard/mappin.svg" />
                                        <span class="text-green">
                                          City, Street N
                                        </span>
                                      </div>
                                      <div class="langSpeak">
                                        <span>En</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="right">
                                  <div class="greenimg">
                                    <img src="../images/user-dashboard/general-medicine.svg" />
                                    <span>General medicine</span>
                                  </div>

                                  <div class="bStar d-flex align-items-center gap-2">
                                    <img src="../images/user-dashboard/black-star.svg" />
                                    <span class="text-black ">4.6</span>
                                  </div>
                                </div>
                              </div>
                              <p>
                                viverra nibh Praesent Quisque placerat placerat
                                cursus non amet, adipviverra nibh Praesent
                                Quisque placerat placerat cursus non amet,
                                adipiscing elit. urna nisl. viverra enim.{" "}
                              </p>

                              <div class="d-flex justify-content-end mb-3">
                                <a href="#" class="transparent_btn ">
                                  More Info
                                </a>
                              </div>
                              <div class="d-flex align-items-center justify-content-between gap-2">
                                <a
                                  href="#"
                                  class="blue_btn d-flex align-items-center gap-2"
                                >
                                  <svg
                                    width="15"
                                    height="14"
                                    viewBox="0 0 15 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M2.63518 3.59329C1.88134 3.59391 1.00133 3.2822 1 2.50112C0.998743 1.7591 1.81488 1.44599 2.63154 1.44531L10.0687 1.44531C10.8262 1.44531 11.1103 1.87775 11.1103 2.32528V3.59329M13.4344 6.71761H10.7195C9.59111 6.71761 8.67633 7.63558 8.67633 8.76795C8.67633 9.90032 9.59111 10.8183 10.7195 10.8183H13.4344M10.6259 8.86559H10.7195M1 2.61693V12.4781C1 13.0123 1.41361 13.4453 1.92382 13.4453H13.0762C13.5864 13.4453 14 13.0123 14 12.4781V4.56051C14 4.02633 13.5864 3.59329 13.0762 3.59329H2.62195"
                                      stroke="white"
                                      stroke-linecap="round"
                                    ></path>
                                  </svg>
                                  65$
                                </a>
                                <a
                                  href="#"
                                  class="blue_btn d-flex align-items-center gap-3"
                                >
                                  Make Appointment{" "}
                                  <img
                                    src="../images/user-dashboard/calendar.svg"
                                    style={{ width: "20px" }}
                                  />{" "}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="d-flex justify-content-center">
                          <a
                            href="#"
                            class="blue_btn d-flex align-items-center gap-3"
                          >
                            Meet our doctors{" "}
                            <img
                              src="../images/user-dashboard/meetDoc.svg"
                              style={{ width: "30px" }}
                            />{" "}
                          </a>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );


}

export default FavClinicPublicView;








