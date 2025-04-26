import React, { useState, useEffect } from "react";
import { InputField } from "../../../components/form/InputField";
import { showToast } from "../../../utils/toast";
import { fetchDataAuth, postData } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ReschedulePolicy = () => {
  const{t} = useTranslation("reschedule");
  const navigate = useNavigate()
  const [posibility, setPosibility] = useState(false);
  const [reschedule, setReschedule] = useState();
  const [formData, setFormData] = useState({
    max_reschedules: "",
    reschedule_days: "",
    reschedule_time_range: "",
  });

  // Handle input change for form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getRescheduleData = async () => {
    try {
      const response = await fetchDataAuth(`doctors/reschedule-policies/`, navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
  
      const getData = await response.json();
  
      if (getData?.data?.length > 0) {
        const RescheduleData = getData.data[0]; // Access the first item in the data array
        setReschedule(RescheduleData);
  
        // Use RescheduleData instead of reschedule for form data update
        setFormData((prevState) => ({
          ...prevState,
          posibility: RescheduleData?.allow_reschedule || false,
          max_reschedules: RescheduleData?.max_reschedules || "",
          reschedule_days: RescheduleData?.reschedule_days || "",
          reschedule_time_range: RescheduleData?.reschedule_time_range || "",
        }));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  


  useEffect(() => {
    getRescheduleData();
  }, []);


  // Handle checkbox change and update both posibility state and formData
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setPosibility(checked); // Update the posibility state
    setFormData((prevState) => ({
      ...prevState,
      posibility: checked, // Update formData with the checkbox value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!posibility){
      return
    }
    try {
      const payload = {
        allow_reschedule: posibility,
        max_reschedules: formData?.max_reschedules,
        reschedule_days: formData?.reschedule_days,
        reschedule_time_range: formData?.reschedule_time_range,
      };
      const response = await postData(`doctors/reschedule-policies/`, payload);

      if (response.status === 200) {
        const responseJson = await response.json();
        showToast(responseJson?.message, "success");
      }
      // showToast("Reschedule Policy add successfully.", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="col-md-12">
      <div className="settingBox bg-white border-radius-20 padding-20">
        <h3 className="text-darkgreen mb-5">
          {t("reschedule.reschedule-policy")}
        </h3>
        <div className="row g-4">
          <div className="col-md-12">
            <div className="form-group">
              <div className="genderCheck d-flex align-items-center gap-4">
                <div className="radiotype d-flex align-items-center gap-2">
                  <InputField
                    class=""
                    type="checkbox"
                    name="posibility"
                    checked={posibility} // Use the posibility state to control checkbox
                    onChange={handleCheckboxChange} // Update state on change
                  />
                  <label className="mb-0">
                    {t("reschedule.possibility-of-reschedule")}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Show these fields only when posibility is true */}
          <>
            <div className="col-md-6 d-flex gap-3 align-items-center">
              <p className="mb-0">{t("reschedule.limit")} : </p>
              <div className="form-group min-width-150">
                <InputField
                  type="text"
                  placeholder="NN"
                  class=""
                  disabled={!posibility} // Disable the field if posibility is false
                  name="max_reschedules"
                  onChange={handleInputChange}
                  value={formData.max_reschedules}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center gap-2">
                <p className="mb-0">{t("reschedule.reschedule-period")} :</p>
                <div className="form-group d-flex gap-2">
                  <select
                    class=""
                    name="reschedule_days"
                    onChange={handleInputChange}
                    value={formData.reschedule_days}
                    disabled={!posibility} // Disable the select field if posibility is false
                  >
                    <option value="">Select Days</option>
                    <option value="Mon">Mon</option>
                    <option value="Tue">Tue</option>
                    <option value="Wed">Wed</option>
                    <option value="Thu">Thu</option>
                    <option value="Fri">Fri</option>
                    <option value="Sat">Sat</option>
                    <option value="Sun">Sun</option>
                  </select>
                  <InputField
                    type="time"
                    placeholder="hh - hh"
                    class=""
                    name="reschedule_time_range"
                    onChange={handleInputChange}
                    value={formData.reschedule_time_range}
                    disabled={!posibility} // Disable the input field if posibility is false
                  />
                </div>
              </div>
            </div>
          </>
        </div>

        <button className="blue_btn" type="submit" onClick={handleSubmit}>
          {t("common.save")}
        </button>
      </div>
    </div>
  );
};

export default ReschedulePolicy;
