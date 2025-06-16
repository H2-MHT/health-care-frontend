import { useForm, Controller } from "react-hook-form";
import "../signup/signup.css";
import {  updateData } from "../../hooks/services/services";
import { showToast } from "../../utils/toast";
import Select from "../../components/form/Select";
import { InputField } from "../../components/form/InputField";
import { Country, countryCityData } from "../../utils/constants";
import { useTranslation } from "react-i18next";

const PatientProfile = ({ setStateCount }) => {
  const { t } = useTranslation("edit-profile");
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gender: "Male",
      country: "",
      city: "",
      dob: null,
    },
  });

  const selectedCountry = watch("country");
  const cities = selectedCountry ? countryCityData[selectedCountry] || [] : [];


  const onSubmit = async (data) => {
    try {
      const payload = data;
      const response = await updateData(
        "auth/update-profile/",
        JSON.stringify(payload)
      );

      if (response.status === 200) {
        const responseData = await response.json();
        localStorage.setItem("user_data", JSON.stringify(responseData?.data));
        showToast(responseData?.message, "success");
          setStateCount(4);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <section className="form_part space-cmn">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="signupTab">
              <div className="formArea border-radius-20 border-gray">
                <h5 className="form-head mt-4 mb-5">
                   {t("singup.Complete_Information")}
                </h5>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-4">
                    <div className="col-md-12">
                      <label> {t("singup.place_residence")}</label>
                      <div className="row">
                        <div className="col-md-6">
                          <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                              <Select
                                label="Country"
                                options={Country}
                                placeholder="Select country"
                                error={errors.country?.message}
                                {...field}
                              />
                            )}
                          />
                        </div>
                        <div className="col-md-6">
                          <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                              <Select
                                label="City"
                                options={cities}
                                placeholder="Select city"
                                disabled={!cities.length}
                                error={errors.city?.message}
                                {...field}
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
                      <label> {t("singup.Gender_lable")}</label>
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
                         {t("singup.skip_lable")} <img src="images/frontarrow.png" alt="arrow" />
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

export default PatientProfile;
