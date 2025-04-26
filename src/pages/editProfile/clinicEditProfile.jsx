import React, { useState, useEffect } from "react";
import "../dashboard/doctor-dashboard/dashboard.css";
import { fetchDataAuth, putFormData } from "../../hooks/services/services";
import { InputField } from "../../components/form/InputField";
import TextArea from "../../components/form/TextArea";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "../../utils/toast";
import Select from "../../components/form/Select";
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "../../components/form/multiSelectDropdown";
import { days, clinicType, city } from "../../utils/constants";
import { InputComponent } from "../../components/form/InputComponent";
import FileUpload from "../../components/form/FileUpload";
import { getDoctorProfileSuccess } from "../../redux/actions/doctor/getDoctorProfileAction";
import { useDispatch } from "react-redux";
import LoadingButton from "../../components/ui/loader/LoadingButton";
import { useTranslation } from "react-i18next";

const ClinicEditProfile = () => {
  const { t } = useTranslation("edit-clinic-profile");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [isProfileData, setIsProfileData] = useState();
  const [languageData, setLanguageData] = useState();
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedClinicType, setSelectedClinicType] = useState(0);

const translatedDays = days.map((day) => ({
  label: t(`clinic-edit-profile.days.${day.value}`),
  value: day.value,
}));

  // Set default value from isProfiledata when it loads
  useEffect(() => {
    if (isProfileData?.clinic_type) {
      setSelectedClinicType(isProfileData.clinic_type);
    }
  }, [isProfileData]);

  const handleClinicTypeChange = (event) => {
    setSelectedClinicType(Number(event.target.value));
  };

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: {
      working_time: isProfileData?.working_time,
      clinic_type: isProfileData?.clinic_type ? isProfileData?.clinic_type : "",
      email: isProfileData?.email ? isProfileData?.email : "",
      country: isProfileData?.country ? isProfileData?.country : "",
      city: isProfileData?.city ? isProfileData?.city : "",
    },
  });

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
      setLanguageOptions(formattedData);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getLanguageData();
  }, []);

  useEffect(() => {
    getProfileUpdate();
  }, [languageOptions]);

  const getProfileUpdate = async () => {
    try {
      const response = await fetchDataAuth("clinics/clinic_info/");
      if (!response.ok) {
        throw new Error("Failed to fetch clinic data.");
      }
      const getData = await response.json();
      setIsProfileData(getData);
      let filteredLanguage = languageOptions?.filter((option) =>
        getData?.languages?.includes(option?.id)
      );
      setLanguageData(filteredLanguage);
      reset({
        organisation_name: getData?.organisation_name,
        license_number: getData?.license_number,
        email: getData?.email,
        phone_number: getData?.phone_number,
        country: getData?.country,
        city: getData?.city,
        website: getData?.website,
        public_name: getData?.public_name,
        bio: getData?.bio,
        expertise: getData?.expertise,
        working_time: getData?.working_time,
        clinic_type: getData?.clinic_type,
      });
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    const allValues = getValues(); // Get current values of the form
    const updatedFields = Object.keys(dirtyFields).reduce((acc, field) => {
      acc[field] = allValues[field]; // Add only changed fields
      return acc;
    }, {});
    const fields = {
      organisation_name: updatedFields?.organisation_name,
      bio: updatedFields?.bio,
      email: updatedFields?.email,
      city: updatedFields?.city,
      country: updatedFields?.country,
      dob: updatedFields?.dob,
      expertise: updatedFields?.expertise,
      website: updatedFields?.website,
      public_name: updatedFields?.public_name,
      clinic_type: JSON.stringify(selectedClinicType),
      phone_number: updatedFields?.phone_number,
      license_number: updatedFields?.license_number,
      working_time: updatedFields?.working_time,
      profile_picture: updatedFields?.uploadPhoto,
    };
    try {
      const formData = new FormData();
      let lang = languageData?.map((item) => item?.id);
      formData.append("languages", lang ? JSON.stringify(lang) : null);
      Object.keys(fields).forEach((key) => {
        if (fields[key]) {
          formData.append(key, fields[key]);
        }
      });

      const response = await putFormData("clinics/clinic_info/", formData);
      if (response.status === 200) {
        const responseData = await response.json();
        dispatch(getDoctorProfileSuccess(responseData?.data));
        showToast(responseData?.message, "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
    setLoading(false);
  };

  return (
    <div class="rightContent">
      <div class="doc_info">
        <div class="">
          <form className="row g-4" onSubmit={handleSubmit(onSubmit)}>
            <div class="col-md-12">
              <div class="profileView padding-inner border-radius-20 bg-white">
                <div className="profileForm">
                  <div>
                    <div className="row g-4">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>
                            {t("clinic-edit-profile.organisation-name")}
                          </label>
                          <Controller
                            name="organisation_name"
                            control={control}
                            defaultValue={
                              isProfileData?.organisation_name || ""
                            }
                            render={({ field }) => (
                              <InputComponent type="text" {...field} />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>
                            {t("clinic-edit-profile.license-number")}
                          </label>
                          <Controller
                            name="license_number"
                            control={control}
                            defaultValue={isProfileData?.license_numbers || ""}
                            render={({ field }) => (
                              <InputComponent type="text" {...field} />
                            )}
                          />
                        </div>
                      </div>

                      <div className="form-group">
  <label>{t("clinic-edit-profile.clinic-type")}</label>
  <div className="genderCheck d-flex align-items-center justify-content-between mt-4 mb-3">
    {clinicType.map((item) => (
      <div
        key={item.value}
        className="radiotype d-flex align-items-center gap-2"
      >
        <Controller
          name="clinic_type"
          control={control}
          render={({ field }) => (
            <InputComponent
              type="radio"
              {...field}
              value={item.value}
              checked={selectedClinicType === item.value}
              onChange={(e) => {
                handleClinicTypeChange(e);
              }}
            />
          )}
        />
        <label className="mb-0">{t(`clinic-edit-profile.clinic-types.${item.value}`)}</label>
      </div>
    ))}
  </div>
</div>


                      <div className="col-md-12">
                        <div className="form-group">
                          <label>{t("clinic-edit-profile.website")}</label>
                          <Controller
                            name="website"
                            control={control}
                            render={({ field }) => (
                              <InputComponent type="text" {...field} />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>{t("clinic-edit-profile.email")}</label>
                          <Controller
                            name="email"
                            control={control}
                            defaultValue={isProfileData?.email || ""}
                            render={({ field }) => (
                              <InputComponent
                                type="email"
                                {...field}
                                disabled
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <label>{t("edit-profile.phone-number")}</label>
                          <Controller
                            name="phone_number"
                            control={control}
                            defaultValue={isProfileData?.phone_number}
                            render={({ field }) => (
                              <InputComponent
                                type="text"
                                {...field}
                                maxLength="15"
                                minLength="10"
                                pattern="\d{10,15}"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{t("edit-profile.country")}</label>
                          <Controller
                            name="country"
                            control={control}
                            defaultValue={isProfileData?.country}
                            render={({ field }) => (
                              <InputComponent type="text" {...field} />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>{t("edit-profile.city")}</label>
                          <Controller
                            name="city"
                            control={control}
                            defaultValue={isProfileData?.city}
                            render={({ field }) => (
                              <InputComponent type="text" {...field} />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="profileViewPrt">
                  <div class="profileViewTop">
                    <a href="#">{t("edit-profile.public-view")}</a>
                    <div class="profileviewImg">
                      <FileUpload
                        src={
                          isProfileData?.profile_picture
                            ? isProfileData?.profile_picture
                            : "images/sample.png"
                        }
                        name="uploadPhoto"
                        label="Upload Profile Picture"
                        control={control}
                      />
                    </div>
                  </div>
                  <div>
                    <div class="row g-4">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>
                            {t("clinic-edit-profile.clinic-public-name")}
                          </label>
                          <Controller
                            name="public_name"
                            control={control}
                            defaultValue={isProfileData?.public_name}
                            render={({ field }) => (
                              <InputField type="text" {...field} />
                            )}
                          />
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{t("edit-profile.bio")}</label>
                          <Controller
                            name="bio"
                            control={control}
                            defaultValue={isProfileData?.bio || ""} // Ensuring bio is always initialized
                            render={({ field, fieldState: { error } }) => (
                              <TextArea field={field} rows="3" error={error} />
                            )}
                          />
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{t("edit-profile.areas-of-expertise")}</label>
                          <Controller
                            name="expertise"
                            control={control}
                            defaultValue={isProfileData?.expertise || ""}
                            render={({ field, fieldState: { error } }) => (
                              <TextArea field={field} rows="3" error={error} />
                            )}
                          />
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <div class="d-flex gap-3">
                            <label>
                              {t("clinic-edit-profile.working-time")}
                            </label>
                            <Controller
                              name="working_time"
                              control={control}
                              defaultValue={isProfileData?.working_time}
                              render={({ field }) => (
                                <Select
                                  options={translatedDays}
                                  {...field}
                                  placeholder="Days"
                                  width="150px"
                                />
                              )}
                            />
                            <Controller
                              name="hours"
                              control={control}
                              render={({ field }) => (
                                <InputField type="time" {...field} />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{t("edit-profile.languages")}</label>
                          <MultiSelectDropdown
                            options={languageOptions || []}
                            selectedValues={languageData || []}
                            name="languages"
                            onChange={setLanguageData}
                            register={register}
                          />
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="d-flex gap-3 justify-content-center">
                          <LoadingButton
                            loading={loading}
                            type="submit"
                            className="blue_btn"
                            buttonText={t("common.save-changes")}
                          ></LoadingButton>
                          <button type="button" class="transparent_btn">
                            {t("common.cancel")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClinicEditProfile;
