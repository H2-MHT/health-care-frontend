import React, { useState, useEffect, useCallback } from "react";
import {
  deleteData,
  fetchDataAuth,
  postData,
} from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { InputField } from "../../../components/form/InputField";
import { useNavigate } from "react-router-dom";
import { dayOptions } from "../../../utils/constants";
import Select from "../../../components/form/Select";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const AppointmentManage = ({ConsultationDetails}) => {
  const{t} = useTranslation("appointment-manage")
  const navigate = useNavigate();
  const profileData = useSelector((state) => state?.userProfile?.userProfile);
  const dashboardData = useSelector(
    (state) => state?.doctorDashboard?.dashboard
  );

  const [getAppointmentData, setgetAppointmentData] = useState([]);
  const [formData, setFormData] = useState({
    appointmentType: "Urgent",
    days: "",
    startTime: "",
    endTime: "",
  });

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
      const response = await fetchDataAuth(
        `doctors/doctor-schedule/${dashboardData?.doctor_id}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const data = await response.json();
      setgetAppointmentData(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const accountDelete = useCallback(async (data, event) => {
    event.preventDefault();
    try {
      const response = await deleteData(`doctors/delete-appointment/?appointment_id=${data?.id}`);
      if (response?.status === 200 || response?.status === 204) {
        showToast("Preference successfully deleted", "success");

        // Update state properly
        setgetAppointmentData((prevData) => ({
          ...prevData,
          data: prevData?.data?.filter((item) => item?.id !== data?.id) || [],
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

  const isSlotOverlapping = (allSlots, newSlot) => {
    const newStart = new Date(`1970-01-01T${newSlot.start_time}`);
    const newEnd = new Date(`1970-01-01T${newSlot.end_time}`);

    for (let slot of allSlots) {
      if (slot.days === newSlot.days) {
        // Check only for the same day
        const slotStart = new Date(`1970-01-01T${slot.start_time}`);
        const slotEnd = new Date(`1970-01-01T${slot.end_time}`);

        // Check if new slot overlaps with existing slot
        if (
          (newStart >= slotStart && newStart < slotEnd) || // Start in range
          (newEnd > slotStart && newEnd <= slotEnd) || // End in range
          (newStart <= slotStart && newEnd >= slotEnd)
        ) {
          // Completely covers existing slot
          throw new Error(
            `Slot overlaps with an existing slot on ${slot.days} (${slot.start_time} - ${slot.end_time})`
          );
        }
      }
    }

    return "Slot can be added";
  };

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
      doctor: dashboardData?.doctor_id,
      user_id: profileData?.id,
    };

    try {
      isSlotOverlapping(getAppointmentData, payload);
    } catch (error) {
      showToast("Slot already exist in between this time range", "error");
      return;
    }

    try {
      const response = await postData(
        "doctors/create-appointment-and-generate-slot/",
        payload
      );
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
            options={dayOptions}
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
        <button
          className={`addingBtn height-57${
            !ConsultationDetails ? "disabled-add-btn" : ""
          }`}
          title={`${!ConsultationDetails ? "Please choose session first" : ""}`}
          type="submit"
          onClick={handleSubmit}
          disabled={!ConsultationDetails}
        >
          {t("appointment-manage.add")}
        </button>
      </div>
      <div className="fixedTimingBox">
        {getAppointmentData?.length > 0 &&
          getAppointmentData?.map((item) => (
            <div key={item?.id} className="fixedTiming">
              <p>{item?.appointment_type}</p>
              <p>{item?.days}</p>
              <p>
                {item?.start_time} - {item?.end_time}
              </p>
              <a href="#" onClick={(event) => accountDelete(item, event)}>
                X
              </a>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AppointmentManage;
