import React, { useState, useEffect, use } from "react";
import { fetchDataAuth, postData } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import MultiSelectDropdown from "../../../components/form/multiSelectDropdown";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from 'moment-timezone';
import Select from "react-select";
import AutoSelect from "../../../components/form/AutoSelect";

const TimeLanguage = () => {
  const{t} = useTranslation("time-language");

  const [languageOptions, setLanguageOptions] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    timezone: "",
    language: "",
    use_system_timezone: false,
    use_system_language: false,
  });
  const [timeZones, setTimeZones] = useState([]);
  const [languagesOptions, setLanguagesOptions] = useState([]);

  useEffect(() => {
    const zones = moment.tz.names(); // All timezones

    const formattedZones = zones.map((zone) => {
      const offset = moment.tz(zone).utcOffset(); // offset in minutes
      const sign = offset >= 0 ? "+" : "-";
      const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
      const minutes = String(Math.abs(offset) % 60).padStart(2, "0");
      const gmtOffset = `GMT${sign}${hours}:${minutes}`;

      return {
        label: `(${gmtOffset}) ${zone}`,
        value: zone,
      };
    });

    setTimeZones(formattedZones);
  }, []);

  useEffect(() => {
    fetch('https://libretranslate.com/languages')
      .then(res => res.json())
      .then(data => {
        const langOptions = data.map(lang => ({
          label: lang.name,
          value: lang.code
        }));
        setLanguagesOptions(langOptions);
      })
      .catch(err => {
        console.error("Error fetching languages:", err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, checked, value, type } = e.target;
    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (name === 'use_system_timezone') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        timezone: checked ? currentTimeZone : prev.timezone, // Clear timezone if checkbox is checked
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleChange = (option, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: option?.value,
    }));
  };

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
          language: preferenceData?.languages[0] || prevState.language,
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

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0]; // "en" from "en-US"
    const match = languagesOptions.find(lang => lang.value === browserLang);
    if (match) {
      setFormData((prevState) => ({
        ...prevState,
        ['language']: browserLang,
      }));
    }
    },[formData?.use_system_language])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        timezone: formData?.timezone,
        languages: [formData?.language],
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
                    {t("time-language.system-timezone")}
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-3 w-100">
              <div className="form-group w-100">
                <AutoSelect
                  name="timezone"
                  value={formData.timezone}
                  onChange={(option)=>handleChange(option, "timezone")}
                  options={timeZones}
                  placeholder="Select Timezone"
                  disabled={formData.use_system_timezone}
                  isSearchable={true}
                />
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
              <div>
              <p className="mb-0">{t("time-language.preferred-language")} :</p>
              </div>
              <div className="form-group w-100">
                <AutoSelect
                  name="language"
                  value={formData.language}
                  onChange={(option)=>handleChange(option, "language")}
                  options={languagesOptions}
                  placeholder="Select Languages"
                  disabled={formData.use_system_language}
                  isSearchable={true}
                  width="60%"
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
