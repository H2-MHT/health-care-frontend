import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// import "../../../../signup.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoadingButton from "../../../../components/ui/loader/LoadingButton";
import { postRequest } from "../../../../hooks/services/services";
import { showToast } from "../../../../utils/toast";
import InputField from "../../../../components/form/InputField";


const CreateAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("login");
  const [stateCount, setStateCount] = useState(1);
  const [email, setEmail] = useState();
  const [role, setRole] = useState("Admin");
  const schema = Yup.object().shape({
    firstName: Yup.string().required("Field is required"),
    lastName: Yup.string().required("Field is required"),
    healthEmail: Yup.string()
      .email("Invalid email format")
      .required("Field is required"),
    healthPassword: Yup.string()
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
      .oneOf([Yup.ref("healthPassword"), null], "Passwords must match")
      .required("Field is required"),
    acceptTerms: Yup.boolean().oneOf(
      [true],
      "You must accept the terms and conditions"
    ),
  });

  // assign the default values to the fields
  const getDefaultValues = () => {
    return {
      member: "Doctor",
    };
  };

  // Initialize React Hook Form with the Yup resolver
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(),
  });

  const goToClinic = () => {
    navigate("/clinic-signup");
  };
  const formValues = getValues();
  // Handle form submission
  const onSubmit = async (data) => {
    console.log(data,">>>>>>>Admin")
    setLoading(true);
    try {
      const payload = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.healthEmail,
        password: data.healthPassword,
        confirm_password: data.confirmPassword,
      };

    //   const response = await postRequest("auth/signup/", payload); // Call the API service
    //   if (response?.status === 201) {
    //     setLoading(false);
    //     let responseData = await response.json();
    //     showToast(responseData?.message, "success");
    //     setEmail(data.healthEmail);
    //     setStateCount(2);
    //   }
    } catch (error) {
      setLoading(false);
      showToast(error.message, "error");
    }
  };

  return (
    <>
      <>
        {stateCount === 1 && (
          <>
            <section className="form_part d-flex align-items-center py-2">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <div className="signupTab">
                      <div className="formArea signupmain">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>{t("singup.first_name")}</label>
                                <InputField
                                  type="text"
                                  register={register}
                                  name="firstName"
                                  error={errors?.firstName?.message}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>{t("singup.Last_name")}</label>
                                <InputField
                                  type="text"
                                  register={register}
                                  name="lastName"
                                  error={errors?.lastName?.message}
                                />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group">
                                <label>{t("login.email_label")}</label>
                                <InputField
                                  type="email"
                                  register={register}
                                  name="healthEmail"
                                  error={errors?.healthEmail?.message}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>{t("login.password_label")}</label>
                                <InputField
                                  type="password"
                                  name="healthPassword"
                                  {...register("healthPassword", {
                                    required: "Password is required",
                                    validate: (value) =>
                                      !/\s/.test(value) ||
                                      "Password cannot contain spaces",
                                    onChange: (e) =>
                                      (e.target.value = e.target.value.replace(
                                        /\s/g,
                                        ""
                                      )), // Remove spaces while typing
                                  })}
                                  error={errors?.healthPassword?.message}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>{t("singup.Confirm_Password")}</label>
                                <InputField
                                  type="password"
                                  name="confirmPassword"
                                  {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                    validate: (value) =>
                                      !/\s/.test(value) ||
                                      "Password cannot contain spaces",
                                    onChange: (e) =>
                                      (e.target.value = e.target.value.replace(
                                        /\s/g,
                                        ""
                                      )), // Removes spaces while typing
                                  })}
                                  error={errors?.confirmPassword?.message}
                                />
                              </div>
                            </div>
                            <p>{t("singup.Password_text")}</p>
                            <div className="col-md-12">
                              <LoadingButton
                                loading={loading}
                                type="submit"
                                className="black_btn" // Pass the existing class
                                buttonText={" Create an account"}
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
          </>
        )}
      </>
    </>
  );
};

export default CreateAdmin;
