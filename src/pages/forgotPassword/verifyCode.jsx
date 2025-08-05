import React from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { showToast } from "../../utils/toast";
import { InputField } from "../../components/form/InputField";
import { useNavigate } from "react-router-dom";
import Image from "../../components/form/Image";
import { useLocation } from "react-router-dom";
import { postRequest } from "../../hooks/services/services";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "../../redux/actions/authActions";

const VerifyCode = ({ stateCount, setStateCount, email, type }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  let DefaultRole = "Doctor";
  // Get query parameters from the URL using URLSearchParams
  const schema = Yup.object().shape({
    verifyCode: Yup.string().required("Field is required"),
  });
console.log(stateCount,">>>>>stateCount")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleBack = (event) => {
    event.preventDefault();
    setStateCount(stateCount - 1);
  };

  const resendOTP = async () => {
    try {
      const payload = {
        email: email,
      };
      const response = await postRequest("auth/resend-otp/", payload); // Call the API service
      if (response.status == 200) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };
console.log(type,">>>>>>>type")
  const onSubmit = async (data) => {
    // setLoading(true);
    try {
      const payload = {
        email: email,
        otp: data.verifyCode,
      };
      const response = await postRequest("auth/verify-otp/", payload); // Call the API service
      if (response.status == 200) {
        let responseData = await response.json();
        localStorage.setItem("user_token", responseData?.tokens?.access);
        // dispatch(loginSuccess("", responseData?.tokens?.access));
        showToast(responseData?.message, "success");
        if (!location?.pathname?.includes("/forgot-password")) {
          setStateCount(3);
        } else {
          if (type == "clinic") {
            navigate("/clinic-signup-step-two");
          } else {
            navigate(`/forgot-password/reset-password?email=${email}`);
          }
        }
      } else {
        navigate("/clinic-signup-step-two");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div>
      <section class="form_part space-cmn">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="signupTab">
                <div class="formArea border-radius-20 border-gray">
                  <a href="login.html" class="back" onClick={handleBack}>
                    <Image src="/images/backarrow.png" /> Back
                  </a>
                  <h5 class="form-head mt-4 mb-4">Confirm your e-mail</h5>
                  <p class="text-center mb-4">
                    We've sent a code to <span class="blue_txt">{email}</span>
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="row g-4">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>Verification code:</label>
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
                          Submit
                        </button>
                      </div>

                      <div class="co-md-12">
                        <a
                          href="#"
                          class="forgot text_decor"
                          onClick={resendOTP}
                        >
                          Send Again
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default VerifyCode;
