import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Image from "../../../components/form/Image";
import { postData } from "../../../hooks/services/services";
import { Loader } from "../../../components/ui/loader/loader";
import { useTranslation } from "react-i18next";

const ClinicInfo = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const viewClinicDetail = async () => {
    setLoading(true);
    const viewUrl = `MasterPanel/user_detail/${id}/`;

    try {
      const response = await postData(viewUrl, { role: "Clinic" });
      if (!response.ok) throw new Error("Fetching Clinic Details Failed");

      const getData = await response.json();
      setUserInfo(getData);
      console.log(getData);
    } catch (error) {
      console.error("Fetching Clinic Details Error: ", error);
      throw error;
    }
    setLoading(false);
  };

  useEffect(() => {
    viewClinicDetail();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div class="rightContent rightsidefull">
          <div class="profileMobile">
            <div class="nameMobile">
              Hello, dr. {userInfo?.first_name} {userInfo?.last_name}!
            </div>
            <div class="profileImgMobile">
              <img src="images/profile-sample.png" class="img-fluid" />
            </div>
          </div>

          <div cass="publicViewMain bg-white border-radius-20">
            <div class="doc_public_view ">
              <div class="docDetails">
                <div class="doctorsName">
                  <div class="img-part">
                    <Image src={userInfo?.profile_picture} />
                  </div>
                  <div class="right">
                    <div class="para">
                      {userInfo?.professional_stat}{" "}
                      <span class="text-mainblue">{userInfo?.expertise}</span>
                    </div>
                    <div class="dcNm">
                      {/* <div class="dcSpecialist">
                    <div class="d-flex justify-content-center align-items-center flex-column gap-1 spclt">
                      <img src="../../images/user-dashboard/gyne.svg" />
                      <span class="text-red">Gynecology</span>
                    </div>
                    <div class="bStar d-flex align-items-center gap-2">
                          <img src="../../images/user-dashboard/black-star.svg" />
                          <span class="text-black ">{userInfo?.rating || 0}</span>
                        </div>
                  </div> */}
                    </div>

                    <div className="card p-3 shadow-sm">
                      <div class="Nm row mb-2">
                        <div className="col-md-6">
                          <img src="../../images/user-dashboard/batch.svg" />
                          <span class="text-mainblue">
                            Dr.{userInfo?.first_name} {userInfo?.last_name}
                          </span>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-6">
                          <strong>{t("singup.date_birth")}:</strong>{" "}
                          {userInfo?.dob}
                        </div>
                        <div className="col-md-6">
                          <strong>{t("singup.Gender_lable")}:</strong>{" "}
                          {userInfo?.gender}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-6">
                          <strong>{t("clinic-edit-profile.email")}:</strong>{" "}
                          {userInfo?.email}
                        </div>
                        <div className="col-md-6">
                          <strong>{t("superadmin.phone")}:</strong>{" "}
                          {userInfo?.phone_number || "1234567890"}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-6">
                          <strong>{t("superadmin.profession")}:</strong>{" "}
                          {userInfo?.professional_stat || "N/A"}
                        </div>
                        <div className="col-md-6">
                          <strong>{t("superadmin.expertise")}:</strong>{" "}
                          {userInfo?.expertise || "N/A"}
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-6">
                          <strong>{t("wallet.status")}:</strong>
                          <span
                            className={
                              userInfo?.is_active
                                ? "text-success fw-bold"
                                : "text-danger fw-bold"
                            }
                          >
                            {userInfo?.is_active ? "Unblocked" : "Blocked"}
                          </span>
                        </div>
                        <div className="col-md-6">
                          <strong>{t("superadmin.works-in")}:</strong>{" "}
                          {userInfo?.work_place || "N/A"}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-12">
                          <strong>{t("singup.languages_lable")}:</strong>{" "}
                          {userInfo?.languages?.join(", ") || "N/A"}
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-md-12"></div>
                        <div class="d-flex align-items-center gap-2">
                          <img src="../../images/user-dashboard/mappin.svg" />
                          <span class="text-green">
                            {userInfo?.residence
                              ? `${userInfo.residence},`
                              : ""}
                            {userInfo?.city ? `${userInfo.city},` : ""}
                            {userInfo?.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="locations-call">
                      <div class="loc">
                        {/* <div class="d-flex align-items-center gap-2">
                      <img src="../../images/user-dashboard/mappin.svg" />
                      <span class="text-green">
                        {userInfo?.residence ? `${userInfo.residence},` : ""}
                        {userInfo?.city ? `${userInfo.city},` : ""}
                        {userInfo?.country}
                      </span>
                    </div> */}
                        {/* <div class="d-flex align-items-center gap-3">
                      <img src="../../images/user-dashboard/flag.svg" />
                      <div class="langs">
                        EN
                        <img src="../../images/user-dashboard/flag.svg" />
                      </div>
                    </div> */}
                      </div>
                      {/* <div class="toggle" onclick="toggleActive(this)">
                    <div class="circle">
                      <img
                        src="../../images/user-dashboard/phone.png"
                        class="img-fluid"
                      />
                    </div>
                    <span class="label">Urgent call</span>
                  </div> */}
                    </div>

                    {/* <div class="doctor_call mt-5">
                  <a
                    href="#"
                    class="light_black_btn d-flex align-items-center gap-3"
                  >
                    <img src="../../images/user-dashboard/askQ.png" /> ask a
                    question
                  </a>
                  <a href="#" class="blue_btn d-flex align-items-center gap-3">
                    Make Appointment{" "}
                    <img src="../../images/user-dashboard/calendar.svg" />{" "}
                  </a>
                </div> */}
                  </div>
                </div>
                <div class="doctorData">
                  <div class="left">
                    <h4>{t("edit-profile.areas-of-expertise")}</h4>
                    <p>{userInfo?.expertise} </p>
                  </div>
                  <hr />
                  <div class="right">
                    <h4>{t("superadmin.biography")}</h4>
                    <p>{userInfo?.bio} </p>
                  </div>
                </div>
                {/* <div class="tabbing">
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
            </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClinicInfo;
