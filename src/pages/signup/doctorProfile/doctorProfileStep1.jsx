import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { showToast } from "../../../utils/toast";
import "../signup.css";
import { fetchDataAuth, updateData } from "../../../hooks/services/services";
import Select from "../../../components/form/Select";
import { useTranslation } from "react-i18next";
import { InputField } from "../../../components/form/InputField";
import { Country, City } from "country-state-city";
import AutoSelect from "../../../components/form/AutoSelect";
import { Experience, Speciality } from "../../../utils/constants";
import { loginSuccess } from "../../../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import CreateSelect from "../../../components/form/CreateSelect";

const DoctorProfileStep1 = ({ setStateCount }) => {
  const dispatch = useDispatch();

  const [workPlaces, setWorkPlaces] = useState([]);
  const { t } = useTranslation("login");
  const [selectedWorkPlace, setSelectedWorkPlace] = useState("");
  let { token } = useSelector((state) => state.auth);

  const years = [];
  for (let i = 1; i <= 99; i++) {
    years.push({ label: String(i), value: String(i) });
  }

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gender: "Male",
      country: "",
      city: "",
      dob: null,
      experience: "",
      professional_stat: "",
      work_place: "",
    },
  });

  const [cities, setCities] = useState([]);

  // Watch selected country
  const selectedCountry = watch("country");

  useEffect(() => {
    if (selectedCountry) {
      const cityOptions =
        City.getCitiesOfCountry(selectedCountry)?.map((city) => ({
          value: city.name,
          label: city.name,
        })) || [];
      setCities(cityOptions);
      setValue("city", ""); // Reset city when country changes
    } else {
      setCities([]);
    }
  }, [selectedCountry, setValue]);

  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  useEffect(() => {
    const getWorkPlaces = async () => {
      try {
        const response = await fetchDataAuth("clinics/");
        if (!response.ok) throw new Error("Failed to fetch data.");

        const data = await response.json();
        setWorkPlaces([
          ...data?.data?.map((item) => ({ label: item.name, value: item.id })),
          { label: "Other", value: "other" },
        ]);
      } catch (error) {
        console.error(error.message);
      }
    };

    getWorkPlaces();
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      if (selectedWorkPlace == "other") {
        payload.clinic = selectedWorkPlace;
      }
      if (selectedWorkPlace !== "other") {
        payload.work_place = selectedWorkPlace;
      }
      const response = await updateData(
        "auth/update-profile/",
        JSON.stringify(payload)
      );

      if (response.status === 200) {
        const responseData = await response.json();
        localStorage.setItem("user_data", JSON.stringify(responseData?.data));
        dispatch(loginSuccess(responseData?.data?.role, token));
        showToast(responseData?.message, "success");
        setStateCount(4);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const selectWorkplace = (e) => {
    setSelectedWorkPlace(e.target.value);
    setValue("hospital_name", "");
    setValue("location", "");
    setValue("website", "");
  };

  return (
    <section className="form_part space-cmn">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="signupTab">
              <div className="formArea border-radius-20 border-gray">
                <h5 className="form-head mt-4 mb-5">
                  {t("singup.Complete_Information")} <span></span>{" "}
                  {t("singup.step")}
                </h5>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-4">
                    <div className="col-md-12">
                      <label>{t("singup.place_residence")}</label>
                      <div className="row">
                        <div className="col-md-6">
                          <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                              <AutoSelect
                                label="Country"
                                options={countryOptions}
                                placeholder="Select Country"
                                error={errors.country?.message}
                                value={field.value}
                                onChange={(option) =>
                                  field.onChange(option?.value)
                                }
                                isSearchable={true}
                              />
                            )}
                          />
                        </div>
                        <div className="col-md-6">
                          <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                              <AutoSelect
                                label="City"
                                options={cities}
                                placeholder="Select City"
                                error={errors.city?.message}
                                value={field.value}
                                onChange={(option) =>
                                  field.onChange(option?.value)
                                }
                                isDisabled={!cities.length}
                                isSearchable={true}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="col-md-12">
                      <label>{t("singup.date_birth")}</label>
                      <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                          <InputField type="date" {...field} />
                        )}
                      />
                    </div>

                    {/* Gender */}
                    <div className="col-md-12">
                      <label>{t("singup.Gender_lable")}</label>
                      <div className="d-flex align-items-center justify-content-between">
                        {["Male", "Female", "Other"].map((gender) => (
                          <Controller
                            key={gender}
                            name="gender"
                            control={control}
                            render={({ field }) => (
                              <div>
                                <input
                                  type="radio"
                                  id={gender}
                                  {...field}
                                  value={gender}
                                  checked={field.value === gender} // ✅ Ensures "Male" is pre-selected
                                />
                                <label htmlFor={gender}>{gender}</label>
                              </div>
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Place of Work */}
                    <div className="col-md-12">
                      <label>{t("singup.place_Work")}</label>
                      <Select
                        options={workPlaces}
                        placeholder="Hospital Name"
                        value={selectedWorkPlace}
                        onChange={selectWorkplace}
                      />
                    </div>
                    {selectedWorkPlace === "other" && (
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-6">
                            <label>Hospital Name</label>
                            <Controller
                              name="clinic_name"
                              control={control}
                              render={({ field }) => (
                                <InputField
                                  type="text"
                                  placeholder="Hospital Name"
                                  {...field}
                                />
                              )}
                            />
                          </div>
                          <div className="col-md-6">
                            <label>Website</label>
                            <Controller
                              name="clinic_website"
                              control={control}
                              render={({ field }) => (
                                <InputField
                                  type="text"
                                  placeholder="Website"
                                  {...field}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedWorkPlace === "other" && (
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-12">
                            <label>Location</label>
                            <Controller
                              name="clinic_location"
                              control={control}
                              render={({ field }) => (
                                <InputField
                                  type="text"
                                  placeholder="Location"
                                  {...field}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Professional Stats & Experience */}
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-6">
                          <label>
                            Professional Stats
                            <i
                              class="fa-solid fa-circle-info"
                              title="If you want to create new then Type text and click on create"
                            ></i>
                          </label>
                          <Controller
                            name="professional_stat"
                            control={control}
                            render={({ field }) => {
                              return (
                                <CreateSelect
                                  options={Speciality}
                                  name="professional_stat"
                                  isSearchable={true}
                                  onChange={(option) => {
                                    field.onChange(option?.value); // sends value to form
                                  }}
                                />
                              );
                            }}
                          />
                        </div>
                        <div className="col-md-6">
                          <Controller
                            name="experience"
                            control={control}
                            render={({ field }) => (
                              <Select
                                label="Experience"
                                options={years}
                                placeholder="Years of Experience"
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit & Skip */}
                    <div className="col-md-12">
                      <button type="submit" className="black_btn">
                        {t("singup.confirm_lable")}
                      </button>
                      <a
                        href="#"
                        className="back justify-content-end"
                        onClick={() => setStateCount(4)}
                      >
                        {t("singup.skip_lable")}{" "}
                        <img src="images/frontarrow.png" alt="arrow" />
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
  );
};

export default DoctorProfileStep1;
