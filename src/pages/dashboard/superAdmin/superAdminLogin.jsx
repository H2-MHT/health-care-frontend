import React, { useState } from "react";
import { InputField } from "../../../components/form/InputField";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { showToast } from "../../../utils/toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/ui/header/header";
import Image from "../../../components/form/Image";
import { postRequest } from "../../../hooks/services/services";
import { useTranslation } from "react-i18next";
import LoginWithGoogle from "../../../SSOLogin/loginWithGoogle";
import "../../signup/signup.css";
import { loginFailure, loginSuccess } from "../../../redux/actions/authActions";
import { useDispatch } from "react-redux";
import { socket } from "../../../utils/config";
import LoadingButton from "../../../components/ui/loader/LoadingButton";

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Field is required"),
    password: Yup.string().required("Field is required"),
  });

  //   const getDefaultValues = () => {
  //     return {
  //       member: "Doctor",
  //     };
  //   };

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // defaultValues: getDefaultValues(),
  });

  let formValues = getValues();

  const goToForgotPage = (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    navigate("/forgot-password");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        email: data?.email,
        password: data?.password,
        role: "SuperAdmin",
      };

      const response = await postRequest("auth/signin/", payload); // Call the API service
      if (response.status === 200) {
        let responseData = await response.json();

        localStorage.setItem("user_token", responseData?.tokens?.access);
        localStorage.setItem("user_data", JSON.stringify(responseData?.user));
        showToast(responseData?.message, "success");
        socket.emit("register", { user_id: responseData?.user?.id });
        dispatch(
          loginSuccess(responseData?.user?.role, responseData?.tokens?.access)
        );
        if (responseData?.user?.role == "SuperAdmin") {
          navigate("/superadmin/dashboard");
        }
      }
    } catch (error) {
      showToast(error.message, "error");
      dispatch(loginFailure(error.message || "Login failed."));
    } finally {
      setLoading(false); // Ensures loading stops in all cases
    }
  };

  return (
    <div>
      <Header />
      <section className="form_part space-cmn">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="signupTab">
                <div className="tabPrt">
                  {/* <ul>
                    <li>
                      <a>
                        Create an account
                      </a>
                    </li>
                    <li>
                      <a className="active">
                        Admin Login
                      </a>
                    </li>
                  </ul> */}
                </div>
                <div className="formArea loginmain">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <InputField
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            register={register}
                            error={errors?.email?.message}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <InputField
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            register={register}
                            error={errors?.password?.message}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <a
                          href="forgot_password.html"
                          className="forgot"
                          onClick={goToForgotPage}
                        >
                          Forgot Password?
                        </a>
                      </div>
                      <div className="col-md-12">
                        <LoadingButton
                          loading={loading}
                          type="submit"
                          className="black_btn" // Pass the existing class
                          buttonText={"Log in"}
                        ></LoadingButton>
                      </div>
                      {/* {role !== "Clinic" && (
                        <>
                          <div className="col-md-12">
                            <div className="divider">
                              <p>OR</p>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="social">
                              <LoginWithGoogle member={role}>
                                Continue with Google
                              </LoginWithGoogle>
                              <a href="#" target="_blank" rel="noreferrer">
                                <Image
                                  src="images/apple.png"
                                  alt="Apple"
                                  className="img-fluid"
                                />{" "}
                                Continue with Apple
                              </a>
                            </div>
                          </div>
                        </>
                      )} */}
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

export default SuperAdminLogin;
