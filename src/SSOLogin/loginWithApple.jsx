import React from "react";
import { showToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import AppleSignin from "react-apple-signin-auth";
import { postRequest } from "../hooks/services/services";
import { useSelector, useDispatch } from "react-redux";
import { loginFailure, loginSuccess } from "../redux/actions/authActions";
import { useTranslation } from "react-i18next";

function LoginWithApple({ member }) {
  
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLoginSuccess = async (response) => {
    try {
      const {authorization,user} = response;
      const apiResponse = await postRequest("auth/login/apple", {authorization,user,member});
      if (apiResponse?.status === 200) {
        let responseData = await apiResponse.json();
        localStorage.setItem("user_data", JSON.stringify(responseData?.user));
        localStorage.setItem("user_token", responseData?.tokens?.access);
        dispatch(loginSuccess(member, responseData?.tokens?.access));
        showToast(responseData?.message, "success");
        navigate(`/dashboard`);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleLoginError = (err) => {
    console.error("Apple Sign in Error: ", err);
  };

  return (
    <AppleSignin
      authOptions={{
        clientId: "doctor.h2.signin",
        scope: "email name",
        redirectURI: "https://h2.doctor",
        // state: "state",
        nonce: "random-random",
        usePopup: true,
      }} 
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
      skipScript={false}
      render={({ onClick }) => (
        <p onClick={onClick}>{t("login.Apple_login")}</p>
        
        // <button onClick={onClick} className="custom-apple-button">
        //   {children}
        // </button>
      )}
    />
  );
}

export default LoginWithApple;
