import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { showToast } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../hooks/services/services";
import { useDispatch } from "react-redux";
import {loginFailure, loginSuccess} from "../redux/actions/authActions"

function LoginWithGoogle({member}) {
  const navigate = useNavigate();
 const dispatch = useDispatch();
  const handleLoginSuccess = async (response) => {
    try {
      const payload = {
        token: response?.credential,
      };
      const apiResponse = await postRequest("auth/login/google/", payload);
      if (apiResponse?.status === 200) {
        let responseData = await apiResponse.json();
        console.log(responseData);
        localStorage.setItem("user_token", responseData?.token?.access);
        dispatch(loginSuccess(member, responseData?.token?.access, responseData?.token?.refresh))
        showToast(responseData?.message, "success");
        navigate(`/dashboard`);
        if (member === "Doctor") {
          navigate("/dashboard");
        } else {
          navigate("/patient/dashboard");
        }
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId="421122253768-o2sfg2kh6mbp58duolaqvr9olobi9tkf.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
}

export default LoginWithGoogle;
