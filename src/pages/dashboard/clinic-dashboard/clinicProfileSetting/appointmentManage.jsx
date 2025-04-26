import React, { useState, useEffect, useCallback } from "react";
import {
  deleteData,
  fetchDataAuth,
  postData,
} from "../../../../hooks/services/services";
import { showToast } from "../../../../utils/toast";
import { InputField } from "../../../../components/form/InputField";
import { useNavigate } from "react-router-dom";
import { dayOptions } from "../../../../utils/constants";
import Select from "../../../../components/form/Select";
import { useTranslation } from "react-i18next";


const AppointmentManage = () => {
    const{t} = useTranslation();
  const navigate = useNavigate();
  const [getAppointmentData, setgetAppointmentData] = useState([]);
  const [formData, setFormData] = useState({
    appointmentType: "Urgent",
    days: "",
    startTime: "",
    endTime: "",
  });

  const translatedDays = dayOptions.map((day) => ({
    label: t(`appointment-manage.day-options.${day.value}`),
    value: day.value,
  }));
  

  useEffect(() => {
    const fetchData = async () => {
      await getAllAppointmentData();
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? (prevData[name] === value ? "" : value) : value,
    }));
  };

  const getAllAppointmentData = async () => {
    try {
      const response = await fetchDataAuth(`doctors/preferences/`, navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const data = await response.json();
      setgetAppointmentData(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const accountDelete = useCallback(async (id, event) => {
    event.preventDefault();
    try {
      let payload = { pk: id };
      const response = await deleteData("doctors/preferences/", payload);

      if (response?.status === 200 || response?.status === 204) {
        showToast("Preference successfully deleted", "success");

        // Update state properly
        setgetAppointmentData((prevData) => ({
          ...prevData,
          data: prevData?.data?.filter((item) => item?.id !== id) || [],
        }));

        // Re-fetch updated data from API
        await getAllAppointmentData();
      } else {
        showToast("Failed to delete preference", "error");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      showToast("Failed to delete preference", "error");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form submission behavior
    if (
      !formData.appointmentType ||
      !formData.days ||
      !formData.startTime ||
      !formData.endTime
    ) {
      return;
    }

    if (formData.endTime < formData.startTime) {
      showToast("End time should be greater than to start time", "error");
      return;
    } 
    const payload = {
      appointment_type: formData?.appointmentType,
      days: formData?.days,
      start_time: formData?.startTime,
      end_time: formData?.endTime,
    };

    try {
      const response = await postData("doctors/preferences/", payload);
      if (response?.status === 201) {
        showToast("Appointment preference successfully added", "success");
        await getAllAppointmentData(); // Refresh data after successful post
        setFormData({
          appointmentType: "Urgent",
          days: "",
          startTime: "",
          endTime: "",
        });
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="col-md-6">
      <p>{t("appointment-manage.choose-appointment-types")}</p>
      <div className="form-group">
        <div className="genderCheck d-flex align-items-center gap-4">
          <div className="radiotype d-flex align-items-center gap-2">
            <InputField
              type="radio"
              name="appointmentType"
              value="Planned"
              checked={formData?.appointmentType === "Planned"}
              onChange={handleInputChange}
            />
            <label className="mb-0">
              {t("appointment-manage.planned-consultation")}
            </label>
          </div>
          <div className="radiotype d-flex align-items-center gap-2">
            <InputField
              type="radio"
              name="appointmentType"
              value="Urgent"
              checked={formData?.appointmentType === "Urgent"}
              onChange={handleInputChange}
            />
            <label className="mb-0">
              {t("appointment-manage.urgent-call")}
            </label>
          </div>
        </div>
      </div>
      <div className="d-flex gap-2 mt-3">
        <div className="form-group w-fill">
          <Select
            name="days"
            placeholder={t("appointment-manage.select-days")}
            onChange={handleInputChange}
            value={formData?.days}
            options={translatedDays}
          />
        </div>
        <div className="form-group w-fill">
          <input
            type="time"
            name="startTime"
            className="w-100"
            value={formData?.startTime}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group w-fill">
          <input
            type="time"
            name="endTime"
            className="w-100"
            value={formData?.endTime}
            onChange={handleInputChange}
          />
        </div>
        <button className="addingBtn" type="submit" onClick={handleSubmit}>
          {t("common.add")}
        </button>
      </div>
      <div className="fixedTimingBox">
        {getAppointmentData?.data?.length > 0 &&
          getAppointmentData?.data?.map((item) => (
            <div key={item?.id} className="fixedTiming">
              <p>{item?.appointment_type}</p>
              <p>{item?.days}</p>
              <p>
                {item?.start_time} - {item?.end_time}
              </p>
              <a href="#" onClick={(event) => accountDelete(item?.id, event)}>
                X
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AppointmentManage;
