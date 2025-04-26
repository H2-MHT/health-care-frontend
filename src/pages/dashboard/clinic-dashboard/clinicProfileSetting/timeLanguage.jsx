import React, { useState, useEffect, use } from "react";
import { fetchDataAuth, postData } from "../../../../hooks/services/services";
import { showToast } from "../../../../utils/toast";
import MultiSelectDropdown from "../../../../components/form/multiSelectDropdown";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from 'moment-timezone';


const TimeLanguage = () => {
  const { t } = useTranslation();
  const [languageOptions, setLanguageOptions] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    timezone: "",
    language: "",
    use_system_timezone: false,
    use_system_language: false,
  });

  const timeZones = moment.tz.names();

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const SelectLanguage = [
    { name: "En", id: 1 },
    { name: "Fr", id: 2 },
    { name: "Es", id: 3 },
  ];

  const getTimeLanguageData = async () => {
    try {
      const response = await fetchDataAuth(
        "doctors/user-preferences/",
        navigate
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }

      const getData = await response.json();
      if (getData?.user_preference) {
        // Assuming user_preference is an object containing keys timezone, language, etc.
        const preferenceData = getData?.user_preference;

        // Update form data directly with fetched values
        setFormData((prevState) => ({
          ...prevState,
          timezone: preferenceData?.timezone || prevState.timezone,
          language: preferenceData?.language || prevState.language,
          use_system_timezone:
            preferenceData?.use_system_timezone !== undefined
              ? preferenceData.use_system_timezone
              : prevState?.use_system_timezone,
          use_system_language:
            preferenceData?.use_system_language !== undefined
              ? preferenceData.use_system_language
              : prevState.use_system_language,
        }));
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getTimeLanguageData();
  }, []);

  const handleSubmit = async (e) => {
    const formattedLanguages = languageOptions?.map((lang) =>
      lang?.name?.toLowerCase()
    );
    e.preventDefault();
    try {
      const payload = {
        timezone: formData?.timezone,
        language: formattedLanguages,
        use_system_timezone: formData?.use_system_timezone || false,
        use_system_language: formData?.use_system_language || false,
      };
      const response = await postData("doctors/user-preferences/", payload);
      if (response?.status === 200) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="col-md-12">
      <div className="settingBox bg-white border-radius-20 padding-20">
        <h3 className="text-darkgreen mb-5">
          {t("time-language.time-language")}
        </h3>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="form-group">
              <div className="genderCheck d-flex align-items-center gap-4">
                <div className="radiotype d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    name="use_system_timezone"
                    checked={formData.use_system_timezone}
                    onChange={handleInputChange}
                  />
                  <label className="mb-0">
                    {" "}
                    {t("time-language.system-timezone")}
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-3 w-100">
              <div className="form-group w-100">
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                >
                  <option value="">
                    {t("time-language.select-timezone")} (GMT +1)
                  </option>
                  <option value="1">GMT +1</option>
                  <option value="2">GMT +2</option>
                </select>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <div className="genderCheck d-flex align-items-center gap-4">
                <div className="radiotype d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    name="use_system_language"
                    checked={formData.use_system_language}
                    onChange={handleInputChange}
                  />
                  <label className="mb-0">
                    {t("time-language.language-system")}
                  </label>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 mt-3">
              <p className="mb-0">{t("time-language.preferred-language")}:</p>
              <div className="form-group w-50">
                <MultiSelectDropdown
                  options={SelectLanguage}
                  selectedValues={languageOptions}
                  name="language"
                  onChange={setLanguageOptions}
                  placeholder={t("time-language.select-option")}
                />
              </div>
            </div>
          </div>
        </div>
        <button className="blue_btn" type="submit" onClick={handleSubmit}>
          {t("common.save")}
        </button>
      </div>
    </div>
  );
};

export default TimeLanguage;
