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

const AppointmentManage = ({ ConsultationDetails }) => {
  const { t } = useTranslation("appointment-manage");
  const navigate = useNavigate();
  const profileData = useSelector((state) => state?.userProfile?.userProfile);
  const dashboardData = useSelector(
    (state) => state?.doctorDashboard?.dashboard
  );
  const documentVerification = useSelector(
    (state) => state?.documentVerification?.documentVerification
  );

  const [getAppointmentData, setGetAppointmentData] = useState([]);
  const [formData, setFormData] = useState({
    appointmentType: "Urgent",
    days: "",
    startTime: "",
    endTime: "",
  });
  const [profileStatus, setProfileStatus] = useState("Rejected");

  useEffect(() => {
    // Determine profile status based on documentVerification
    if (Array.isArray(documentVerification) && documentVerification.length) {
      const determineStatus = () => {
        if (documentVerification.some((doc) => doc.status === "Rejected")) {
          setProfileStatus("Rejected");
        } else if (
          documentVerification.some((doc) => doc.status === "Pending")
        ) {
          setProfileStatus("Pending");
        } else if (
          documentVerification.every((doc) => doc.status === "Verified")
        ) {
          setProfileStatus("Verified");
        } else {
          setProfileStatus("Rejected"); // Default to Rejected if no clear status
        }
      };
      determineStatus();
    } else {
      setProfileStatus("Rejected"); // Default if documentVerification is empty or undefined
    }
  }, [documentVerification]);

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
      setGetAppointmentData(data);
    } catch (error) {
      console.error(error.message);
      showToast("Failed to fetch appointment data", "error");
    }
  };

  const accountDelete = useCallback(async (data, event) => {
    event.preventDefault();
    try {
      const response = await deleteData(
        `doctors/delete-appointment/?appointment_id=${data?.id}`
      );
      if (response?.status === 200 || response?.status === 204) {
        showToast("Preference successfully deleted", "success");
        setGetAppointmentData((prevData) =>
          Array.isArray(prevData)
            ? prevData.filter((item) => item?.id !== data?.id)
            : []
        );
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
        const slotStart = new Date(`1970-01-01T${slot.start_time}`);
        const slotEnd = new Date(`1970-01-01T${slot.end_time}`);
        if (
          (newStart >= slotStart && newStart < slotEnd) ||
          (newEnd > slotStart && newEnd <= slotEnd) ||
          (newStart <= slotStart && newEnd >= slotEnd)
        ) {
          throw new Error(
            `Slot overlaps with an existing slot on ${slot.days} (${slot.start_time} - ${slot.end_time})`
          );
        }
      }
    }
    return "Slot can be added";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formData.appointmentType ||
      !formData.days ||
      !formData.startTime ||
      !formData.endTime
    ) {
      showToast("Please fill all fields", "error");
      return;
    }

    if (formData.endTime <= formData.startTime) {
      showToast("End time must be greater than start time", "error");
      return;
    }

    if (profileStatus !== "Verified") {
      showToast("Profile must be verified to add appointments", "error");
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
      showToast("Slot already exists in this time range", "error");
      return;
    }

    try {
      const response = await postData(
        "doctors/create-appointment-and-generate-slot/",
        payload
      );
      if (response?.status === 201) {
        showToast("Appointment preference successfully added", "success");
        await getAllAppointmentData();
        setFormData({
          appointmentType: "Urgent",
          days: "",
          startTime: "",
          endTime: "",
        });
      } else {
        showToast("Failed to add appointment preference", "error");
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
          className={`addingBtn height-57 ${
            !ConsultationDetails || profileStatus !== "Verified"
              ? "disabled-add-btn"
              : ""
          }`}
          title={
            !ConsultationDetails
              ? "Please choose session first"
              : profileStatus !== "Verified"
              ? "Profile not verified"
              : ""
          }
          type="submit"
          onClick={handleSubmit}
          disabled={!ConsultationDetails || profileStatus !== "Verified"}
        >
          {t("appointment-manage.add")}
        </button>
      </div>
      <div className="fixedTimingBox">
        {Array.isArray(getAppointmentData) && getAppointmentData?.length > 0 ? (
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
          ))
        ) : (
          <p>No Appointments</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentManage;
