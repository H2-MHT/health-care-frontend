import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MembershipPlan from "./membershipPlan";
import DataPrivacy from "./dataPrivacy";
import ResetPassword from "./resetPassword";
import CommunicationNotifications from "./communicationNotifications";
import { useTranslation } from "react-i18next";
import TimeLanguage from "./timeLanguage";
import { showToast } from "../../../../utils/toast";
import { deleteData, postData } from "../../../../hooks/services/services";
import storage from "redux-persist/lib/storage"; // If using redux-persist
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../../redux/actions/authActions";
import { persistor } from "../../../../redux/store";

const PatinentProfileSetting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const isProfileData = useSelector((state) => state?.userProfile?.userProfile);
  const sampleImage = "../images/sample.png";

  const logoutUser = async () => {
    try {
      const payload = {
        refresh: auth?.refreshToken,
      };
      const response = await postData("auth/logout/", payload);
      if (response?.status === 200) {
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_data");
        dispatch(logout());
        storage.removeItem("persist:root");
        persistor.purge();
        navigate("/login");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
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
    <div class="rightContent">
      <form>
        <div class="profileMobile">
          <div class="nameMobile">Hello, dr,Ava Williams!</div>
          <div class="profileImgMobile">
            <img
              src="images/doctor-dashboard/profile-sample.png"
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
                      src={isProfileData?.profile_picture || sampleImage}
                      class="img-fluid"
                    />
                    <Link class="text-darkgreen" to="/patient/editprofile">
                      {" "}
                      {t("profile-setting.personal-profile-settings")}{" "}
                    </Link>
                  </div>
                </div>

                <div class="sortSearchArea mb-0">
                  <div class="search">
                    <input type="search" placeholder="search" />
                    <a href="#">
                      <img src="../images/search-dark.svg" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <MembershipPlan />
            <CommunicationNotifications />
            <TimeLanguage />
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
                        onClick={logoutUser}
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
                      <p>{t("log-out.deactivation-consequences-title")}</p>
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

export default PatinentProfileSetting;
