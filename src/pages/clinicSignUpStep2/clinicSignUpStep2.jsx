import React, { useEffect, useState } from "react";
import Header from "../../components/ui/header/header";
import { Footer } from "../../components/ui/footer/footer";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { showToast } from "../../utils/toast";
import { InputField } from "../../components/form/InputField";
import MultiSelectDropdown from "../../components/form/multiSelectDropdown";
import { useNavigate } from "react-router-dom";
import { fetchDataAuth, postData } from "../../hooks/services/services";
import Select from "../../components/form/Select";
import "../signup/signup.css";
import { InputComponent } from "../../components/form/InputComponent";
import { useTranslation } from "react-i18next";

function ClinicSignUpStepTwo() {
   const { t } = useTranslation();
  const navigate = useNavigate();
  const [languageOptions, setLanguageOptions] = useState([]);
  const [languageData, setLanguageData] = useState();
  const [providedOptions, setProvidedOptions] = useState([]);
  const [providedData, setProvidedData] = useState();
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const schema = Yup.object().shape({
    clinic_address: Yup.string().required("Clinic address is required"),
    contact_email: Yup.string()
      .email("Enter a valid email address")
      .required("Contact email is required"),
    contact_phone: Yup.string()
      .matches(
        /^[0-9]{10,15}$/,
        "Contact phone must be between 10 to 15 digits"
      )
      .required("Contact phone is required"),
    administrator_name: Yup.string().required("Administrator name is required"),
    administrator_email: Yup.string()
      .email("Enter a valid email address")
      .required("Administrator email is required"),
  });

  const getProvidData = async () => {
    try {
      const response = await fetchDataAuth(
        "clinics/services_provided",
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      const formattedData = getData?.map((item) => ({
        name: item.title,
        id: item.id,
      }));
      setProvidedData(formattedData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getLanguageData = async () => {
    try {
      const response = await fetchDataAuth("clinics/languages", navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      const formattedData = getData?.map((item) => ({
        name: item.title,
        id: item.id,
      }));
      setLanguageData(formattedData);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getProvidData();
    getLanguageData();
  }, []);

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file);
      setSelectedImagePreview(imageUrl);
    } else {
      showToast("Please upload a valid image file.", "error");
    }
  };

  const onSubmit = async (data) => {
    console.log("Form Submitted:", data);
    try {
      const payload = {
        address: data.clinic_address,
        website: data.website_url,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        services_provided: JSON.stringify(
          providedOptions.map((item) => item.id)
        ),
        file: selectedImage,
        languages: JSON.stringify(languageOptions.map((item) => item.id)),
        working_time: data.working_time,
        working_hours: data.working_hours,
        administrator_name: data.administrator_name,
        administrator_email: data.administrator_email,
      };

      const response = await postData("clinics/clinic_register/", payload);
      console.log(">>>>>>>response ", response);
      if (response?.status === 201) {
        const responseData = await response.json();
        localStorage.setItem("user_data", JSON.stringify(responseData?.user));
        showToast(responseData?.message, "success");
        navigate("/clinic-dashboard/dashboard");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div>
      <Header />
      <section className="form_part space-cmn">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="signupTab">
                <div className="formArea border-radius-20 border-gray">
                  <div className="d-flex gap-5 w-100 mt-4 mb-4 justify-content-center">
                    <h5 className="form-head">
                      {t("clinic-signup.clinic-registration")}
                    </h5>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-4">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>{t("clinic-signup.clinic-address")}</label>
                          <Controller
                            name="clinic_address"
                            control={control}
                            render={({ field }) => (
                              <InputField
                                type="text"
                                {...field}
                                error={errors?.clinic_address?.message}
                              />
                            )}
                          />
                        </div>
                        <div className="form-group mt-4">
                          <label>
                            {t("clinic-signup.website")} (
                            {t("clinic-signup.optional")})
                          </label>
                          <Controller
                            name="website_url"
                            control={control}
                            render={({ field }) => (
                              <InputComponent type="text" {...field} />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{t("clinic-signup.contact-email")}</label>
                          <Controller
                            name="contact_email"
                            control={control}
                            render={({ field }) => (
                              <InputComponent
                                type="email"
                                {...field}
                                error={errors?.contact_email?.message}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{t("clinic-signup.contact-phone")}</label>
                          <Controller
                            name="contact_phone"
                            control={control}
                            render={({ field }) => (
                              <InputComponent
                                type="text"
                                {...field}
                                error={errors?.contact_phone?.message}
                                maxLength="15"
                                minLength="10"
                                pattern="\d{10,15}"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <p>{t("clinic-signup.service-provider")}</p>
                          <MultiSelectDropdown
                            options={providedData}
                            selectedValues={providedOptions}
                            name="service_provided"
                            onChange={setProvidedOptions}
                            register={register}
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{t("singup.licenses_certifications")}</label>
                        <div className="fileupload">
                          <img
                            src={
                              selectedImagePreview || "images/uploadfile.png"
                            }
                            alt="Upload Preview"
                            className="img-fluid"
                            onClick={handleImageClick}
                          />
                          <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          {errors?.uploadFile && (
                            <span className="error">
                              {errors.uploadFile.message}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <p>{t("singup.languages_lable")}</p>
                        <MultiSelectDropdown
                          options={languageData || []}
                          selectedValues={languageOptions || []}
                          name="language"
                          onChange={setLanguageOptions}
                          register={register}
                          className="input-wrapper"
                          style={{ width: "100%" }}
                        />
                      </div>
                      {/* <div className="col-md-12">
                        <div className="form-group">
                          <div className="row">
                            <div className="col-md-6">
                              <Controller
                                name="working_time"
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    label="Working Time"
                                    options={days}
                                    placeholder="Days"
                                    error={errors?.working_time?.message}
                                  />
                                )}
                              />
                            </div>
                            <div className="col-md-6 workinghours-align">
                              <Controller
                                name="working_hours"
                                control={control}
                                render={({ field }) => (
                                  <InputComponent type="time" {...field} error={errors?.working_hours?.message}/>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div> */}
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{t("clinic-signup.administrator-name")}</label>
                          <Controller
                            name="administrator_name"
                            control={control}
                            render={({ field }) => (
                              <InputComponent
                                type="text"
                                {...field}
                                error={errors?.administrator_name?.message}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            {t("clinic-signup.administrator-email")}
                          </label>
                          <Controller
                            name="administrator_email"
                            control={control}
                            render={({ field }) => (
                              <InputComponent
                                type="email"
                                {...field}
                                error={errors?.administrator_email?.message}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-12 mb-5">
                        <button type="submit" className="black_btn">
                          {t("clinic-signup.submit-registration")}
                        </button>
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

export default ClinicSignUpStepTwo;
