import React, { useMemo, useState } from "react";
import ResetPassword from "./resetPassword";
import { useNavigate, Link } from "react-router-dom";
import { showToast } from "../../../utils/toast";
import { deleteData, postData } from "../../../hooks/services/services";
import SessionLengths from "./sessionLengths";
import AppointmentManage from "./appointmentManage";
import ReferalsCode from "./ReferalsCode";
import DataPrivacy from "./dataPrivacy";
import ReschedulePolicy from "./reschedulePolicy";
import CancellationPolicy from "./cancellationPolicy";
import TimeLanguage from "./timeLanguage";
import CommunicationNotifications from "./communicationNotifications";
import MembershipPlan from "./membershipPlan";
import DeviceTracker from "./deviceTracker";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";


const ProfileSetting = () => {
  const{t} = useTranslation("log-out");
  const sampleImage = "../images/sample.png";
  const [ConsultationDetails, setConsultationDetails] = useState();
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_data");
    navigate("/login");
  };
  const accountDelete = async () => {
    try {
      const response = await deleteData("auth/delete-account/");

      // if(response?.status === 200){
      // let responseData = await response.json()
      showToast("Delete Account successfully", "sucess");
      navigate("/signup");
      // }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const accountDeactivate = async () => {
    try {
      const response = await postData("auth/deactivate-account/");

      if (response?.status === 200) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        navigate("/login");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div class="rightContent rightsidefull">
      <form>
        <div class="profileMobile">
          <div class="nameMobile">Hello, dr,Ava Williams!</div>
          <div class="profileImgMobile">
            <img
              src="../images/doctor-dashboard/profile-sample.png"
              class="img-fluid"
            />
          </div>
        </div>

        <div class="doc_info">
          <div class="row g-4">
            <div class="col-md-12">
              <div class="topSaving">
                <div class="settingName border-radius-20 bg-white py-3">
                  <div class="img-parallel">
                    <img
                      src={isProfiledata?.profile_picture || sampleImage}
                      class="img-fluid"
                    />
                    <Link class="text-darkgreen" to="/doctor/editprofile">
                      {t("profile-setting.personal-profile-settings")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <MembershipPlan />
            <ReferalsCode />
            <div class="col-md-12">
              <div class="settingBox bg-white border-radius-20 padding-20">
                <h3 class="text-darkgreen mb-5">
                  {t("profile-setting.appointment-management")}
                </h3>
                <div class="row g-4">
                <SessionLengths
                    setConsultationDetails={setConsultationDetails}
                    ConsultationDetails={ConsultationDetails}
                  />
                  <AppointmentManage
                    ConsultationDetails={ConsultationDetails}
                  />
                </div>
              </div>
            </div>

            <TimeLanguage />
            <ReschedulePolicy />
            <CancellationPolicy />
            <CommunicationNotifications />

            <div class="col-md-12">
              <div class="settingBox bg-white border-radius-20 padding-20">
                <h3 class="text-darkgreen mb-5">
                  {t("profile-setting.privacy-security")}
                </h3>
                <div class="row g-4">
                  <DataPrivacy />
                  <ResetPassword />
                </div>
              </div>
            </div>

            <DeviceTracker />
            <div class="col-md-12">
              <div class="settingBox bg-white border-radius-20 padding-20">
                <h3 class="text-darkgreen mb-5">{t("log-out.title")}</h3>
                <div class="row g-4">
                  <div class="col-md-12">
                    <p class="mb-4">
                      {t("log-out.title")}{" "}
                      <a
                        href="#"
                        class="border-radius-20 bg-mainblue py-3 px-4 text-white"
                        onClick={logout}
                      >
                        <img
                          src="../images/doctor-dashboard/logout.svg"
                          width="30"
                        />{" "}
                        {t("log-out.logout")}
                      </a>{" "}
                    </p>
                    <p>{t("log-out.description")}</p>

                    <div class="d-flex gap-3 justify-content-center mt-4">
                      <button
                        type="button"
                        class="blue_btn"
                        onClick={accountDelete}
                      >
                        {t("log-out.delete-account")}
                      </button>
                      <button
                        type="button"
                        class="transparent_btn"
                        onClick={accountDeactivate}
                      >
                        {t("log-out.deactivate")}
                      </button>
                    </div>

                    <div class="text-center mt-4">
                      <p> {t("log-out.deactivation-consequences-title")}</p>
                      <p>{t("log-out.deactivation-consequences1")}</p>
                      <p>{t("log-out.deactivation-consequences2")}</p>
                      <p>{t("log-out.deactivation-consequences3")}</p>
                      <p>{t("log-out.restore-access-instructions")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetting;
