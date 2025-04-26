import React, {useState,useEffect } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
// import Image from "../../../components/form/Image";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../../utils/toast";
import { InputField } from "../../../../components/form/InputField";
import { postData, postRequest } from "../../../../hooks/services/services";
import localStorage from "redux-persist/es/storage";
import { useTranslation } from "react-i18next";

const ConfirmPaymentPop = ({
  Modal,
  setModelOpen,
  modelOpen,
  setStateCount,
}) => {
  const{t} = useTranslation();
  const [email,setEmail]=useState()
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
 
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);



  const schema = Yup.object().shape({
    verifyCode: Yup.string().required("Field is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const resendOTP = async () => {
    const payload = {
      email: isProfiledata?.email
    };
    const response = await postRequest("auth/change-password/", payload); // Call the API service
    if (response.status == 200) {
      let responseData = await response.json();
      // localStorage.setItem("user_token", responseData?.access_token);
      // const decodedToken = jwtDecode(responseData?.access_token);
      // dispatch(loginSuccess(decodedToken));
      showToast(responseData?.message, "success");
    }
  };

  const onSubmit = async (data) => {
    // setLoading(true);
    try {
      const payload = {
        otp: data.verifyCode,
      };
      const response = await postData(
        "doctors/verify-otp-change-password/",
        payload
      ); // Call the API service
      if (response.status == 200) {
        let responseData = await response.json();
        localStorage.setItem("user_token", responseData?.access_token);
        showToast(responseData?.message, "success");
        setModelOpen(false)
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <Modal
      show={modelOpen}
      backdrop="static"
      keyboard={false}
      onHide={() => setModelOpen(false)}
      size="lg"
    >
      <Modal.Header closeButton>
        <div class="modal-heading-alignment">
          <img src="../images/doctor-dashboard/Info.svg" />
          <h5 class="modal-title text-left" id="exampleModalLabel">
            Verification Code
          </h5>
        </div>
      </Modal.Header>
      <Modal.Body>
        <section class="">
          <div class="signupTab">
            <div class="formArea border-radius-20 border-gray">
              {/* <a href="login.html" class="back" onClick={handleBack}>
                <Image src="/images/backarrow.png" /> Back
              </a> */}
              <h5 class="form-head mt-4 mb-4">
                {" "}
                {t("reset-password-pop.confirm-email")}
              </h5>
              <p class="text-center mb-4">
                {t("reset-password-pop.sent-code")}
                <span class="blue_txt">{isProfiledata?.email}</span>
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div class="row g-4">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label>{t("reset-password-pop.verification")}:</label>
                      <InputField
                        type="text"
                        register={register}
                        name="verifyCode"
                        error={errors?.verifyCode?.message}
                      />
                    </div>
                  </div>
                  <div class="col-md-12">
                    <button type="submit" class="black_btn">
                      {t("common.submit")}
                    </button>
                  </div>

                  <div class="co-md-12">
                    <a href="#" class="forgot text_decor" onClick={resendOTP}>
                      {t("reset-password-send-again")}
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmPaymentPop;

