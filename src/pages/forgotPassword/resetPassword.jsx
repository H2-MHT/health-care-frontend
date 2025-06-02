import React, { useState } from "react";
import Header from "../../components/ui/header/header";
import { Footer } from "../../components/ui/footer/footer";
import { InputField } from "../../components/form/InputField";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { showToast } from "../../utils/toast";
import { useLocation, useNavigate } from "react-router-dom";
import Image from "../../components/form/Image";
import { postData } from "../../hooks/services/services";
import LoadingButton from "../../components/ui/loader/LoadingButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email"); // Get 'email' query parameter

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const schema = Yup.object().shape({
    newPassword: Yup.string()
      .required("Field is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one symbol"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Field is required"),
  });

  const handleBack = (event) => {
    event.preventDefault();
    navigate(`/forgot-password/verify-code?email=${email}`);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        new_password: data?.newPassword,
      };
      const response = await postData("auth/reset-password/", payload);
      if (response.status === 200) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        navigate("/login");
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <section class="form_part space-cmn">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="signupTab">
                <div class="formArea border-radius-20 border-gray">
                  <a href="login.html" class="back" onClick={handleBack}>
                    <Image src="/images/backarrow.png" /> Back
                  </a>
                  <h5 class="form-head mt-4 mb-5">Forgot password?</h5>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="row g-4">
                      <div class="col-md-12">
                        <div
                          class="form-group"
                          style={{ position: "relative" }}
                        >
                          <label>Create New Paasword</label>
                          <InputField
                            type={showPasswordConfirm ? "text" : "password"}
                            name="newPassword"
                            register={register}
                            error={errors?.newPassword?.message}
                          />
                          <FontAwesomeIcon
                            icon={showPasswordConfirm ? faEyeSlash : faEye}
                            onClick={() => setShowPasswordConfirm((prev) => !prev)}
                            style={{
                              position: "absolute",
                              top: "45px",
                              right: "10px",
                              cursor: "pointer",
                              color: "#888",
                              fontSize: "18px",
                            }}
                          />
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group" style={{ position: "relative" }}>
                          <label>Confirm New Password</label>
                          <InputField
                           type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            register={register}
                            error={errors?.confirmPassword?.message}
                          />
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                              position: "absolute",
                              top: "45px",
                              right: "10px",
                              cursor: "pointer",
                              color: "#888",
                              fontSize: "18px",
                            }}
                          />
                        </div>
                      </div>
                      <div class="col-md-12">
                        <LoadingButton
                          loading={loading}
                          type="submit"
                          className="black_btn" // Pass the existing class
                          buttonText="Confirm"
                        ></LoadingButton>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default ResetPassword;
