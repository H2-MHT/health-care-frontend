import React, { useEffect, useState } from "react";
import Select from "../../../components/form/Select";
import { showToast } from "../../../utils/toast";
import { fetchDataAuth, postData } from "../../../hooks/services/services";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";

const SessionLengths = ({ setConsultationDetails, ConsultationDetails }) => {
  const { t } = useTranslation("session-length");
  const [formData, setFormData] = useState({
    planned_session: "",
    urgent_session: "",
    planned_session_length: "15",
    urgent_session_length: "30",
    buffer_time: "",
    planned_fee: "",
    urgent_fee: "",
  });

  const plannedSessionOptions = [
    { label: "Planned", value: "Planned" },
    { label: "None", value: "None" },
  ];

  const urgentSessionOptions = [
    { label: "Urgent call", value: "Urgent call" },
    { label: "None", value: "None" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSessionChange1 = (e) => {
    const selectedValue = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      planned_session: selectedValue,
      urgent_session:
        prevData.urgent_session === selectedValue
          ? ""
          : prevData.urgent_session,
    }));
  };

  const handleSessionChange2 = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      urgent_session: e.target.value,
    }));
  };

  const getConsultationData = async () => {
    try {
      const response = await fetchDataAuth(`doctors/consultation-settings/`);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }

      const getData = await response.json();

      // Check for nested `data` array
      if (getData?.data?.length > 0) {
        const consultationData = getData.data[0]; // Access the first item inside `data`
        setConsultationDetails(consultationData);
        // Update form data with the fetched consultation settings
        setFormData((prevState) => ({
          ...prevState,
          planned_session: consultationData?.planned_session || "",
          urgent_session: consultationData?.urgent_session || "",
          planned_session_length:
            consultationData?.planned_session_length?.toString() || "",
          urgent_session_length:
            consultationData?.urgent_session_length?.toString() || "",
          buffer_time:
            `${consultationData?.buffer_time.split(":")[1]}:${
              consultationData?.buffer_time.split(":")[2]
            }` || "",
          planned_fee: consultationData?.planned_fees || "",
          urgent_fee: consultationData?.urgent_fees || "",
        }));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getConsultationData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = {
        buffer_time: formData.buffer_time,
        planned_fees: formData.planned_fee,
        urgent_fees: formData.urgent_fee,
      };
      if (formData.urgent_session !== "None") {
        payload.urgent_session_length = formData.urgent_session_length;
        payload.urgent_session = formData.urgent_session;
      }
      if (formData.planned_session !== "None") {
        payload.planned_session_length = formData.planned_session_length;
        payload.planned_session = formData.planned_session;
      }

      let response = "";
      response = await postData(`doctors/consultation-settings/`, payload);
      if (response.status === 201 || response.status === 200) {
        const responseJson = await response.json();
        setConsultationDetails(responseJson?.data);
        showToast(responseJson?.message, "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="col-md-6">
      <p>{t("session.session-lengths")}</p>

      {/* First Session Selection */}
      <div className="d-flex align-items-center gap-4 mt-3">
        <div className="form-group w-50">
          <Select
            options={plannedSessionOptions}
            name="planned_session"
            value={formData.planned_session}
            onChange={handleSessionChange1}
          />
        </div>
        <div className="form-group">
          {formData?.planned_session !== "None" && (
            <div className="genderCheck d-flex align-items-center gap-3">
              <div className="radiotype d-flex align-items-center gap-2">
                <input
                  type="radio"
                  id="radio15min"
                  name="planned_session_length"
                  value="15"
                  checked={formData.planned_session_length === "15"}
                  onChange={handleInputChange}
                />
                <label htmlFor="radio15min" className="mb-0">
                  15 min
                </label>
              </div>
              <div className="radiotype d-flex align-items-center gap-2">
                <input
                  type="radio"
                  id="radio30min"
                  name="planned_session_length"
                  value="30"
                  checked={formData.planned_session_length === "30"}
                  onChange={handleInputChange}
                />
                <label htmlFor="radio30min" className="mb-0">
                  30 min
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Second Session Selection */}
      {/* <div className="d-flex align-items-center gap-4 mt-3">
        <div className="form-group w-50">
          <Select
            options={urgentSessionOptions}
            name="urgent_session"
            value={formData.urgent_session}
            onChange={handleSessionChange2}
          />
        </div>
        <div className="form-group">
          <div className="genderCheck d-flex align-items-center gap-3">
            {formData?.urgent_session !== "None" && (
              <>
                <div className="radiotype d-flex align-items-center gap-2">
                  <input
                    type="radio"
                    id="radio15min2"
                    name="urgent_session_length"
                    value="15"
                    checked={formData.urgent_session_length === "15"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="radio15min2" className="mb-0">
                    15 min
                  </label>
                </div>

                <div className="radiotype d-flex align-items-center gap-2">
                  <input
                    type="radio"
                    id="radio30min2"
                    name="urgent_session_length"
                    value="30"
                    checked={formData.urgent_session_length === "30"}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="radio30min2" className="mb-0">
                    30 min
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div> */}

      {/* Buffer Time */}
      <div className="d-flex gap-3 mt-4 align-items-center">
        <p className="mb-0">{t("session.buffer-time")}</p>
        <div className="form-group w-25">
          <input
            type="time"
            placeholder="hh - hh"
            className="w-100"
            onChange={handleInputChange}
            name="buffer_time"
            value={formData.buffer_time}
          />
        </div>
      </div>

      {/* Consultation Fees */}
      <p className="mt-4">{t("session.consultation-fees")} :</p>
      <div className="d-flex gap-3 mt-3 align-items-center">
        <p className="mb-0">{t("appointment-manage.planned-consultation")}</p>
        <i
          class="fa-solid fa-circle-info"
          title="If you want to update your hourly rate, please create a support ticket"
        ></i>
        <div className="form-group w-auto">
          <input
            type="text"
            placeholder="--$"
            name="planned_fee"
            onChange={handleInputChange}
            value={formData.planned_fee}
            disabled={ConsultationDetails?.planned_fees}
            className={
              ConsultationDetails?.planned_fees ? "disabled-field" : ""
            }
            data-tooltip="View Patient"
          />
        </div>
        <p className="mb-0">per {formData.planned_session_length} min</p>
      </div>

      {/* <div className="d-flex gap-3 mt-3 align-items-center">
        <p className="mb-0">{t("appointment-manage.urgent-call")}</p>
        <div className="form-group w-auto">
          <input
            type="text"
            placeholder="--$"
            name="urgent_fee"
            onChange={handleInputChange}
            value={formData.urgent_fee}
            disabled={ConsultationDetails?.urgent_fees}
            className={ConsultationDetails?.urgent_fees ?  "disabled-field" : ""}

          />
        </div>
        <p className="mb-0">per {formData.urgent_session_length} min</p>
      </div> */}

      <button className="blue_btn" type="submit" onClick={handleSubmit}>
        {t("common.save")}
      </button>
    </div>
  );
};

export default SessionLengths;
