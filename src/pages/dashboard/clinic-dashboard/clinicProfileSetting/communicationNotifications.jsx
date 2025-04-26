import React, { useEffect, useState } from "react";
import { showToast } from "../../../../utils/toast";
import { fetchDataAuth, putData } from "../../../../hooks/services/services";
import { useTranslation } from "react-i18next";

const CommunicationNotifications = () => {
  const{t} = useTranslation();
  const [communicationDetails, setCommunicationDetails] = useState();
  const [formData, setFormData] = useState({
    appointment_reminders: false,
    patient_messages: false,
    other_important_updates: false,
    email: false,
    whatsapp: false,
    platform_messenger: false,
  });

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getCommunicationData = async () => {
    try {
      const response = await fetchDataAuth(
        `doctors/communication-preferences/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }

      const getData = await response.json();

      // if (getData && getData.length > 0) {
      const communicationData = getData; // Assuming you want the first item in the array
      setCommunicationDetails(communicationData); // Store data for future reference (optional)
      // Update form data with the fetched consultation settings
      setFormData((prevState) => ({
        ...prevState,
        appointment_reminders: communicationDetails?.appointment_reminders,
        patient_messages: communicationDetails?.patient_messages,
        other_important_updates: communicationDetails?.other_important_updates,
        email: communicationDetails?.email,
        whatsapp: communicationDetails?.whatsapp,
        platform_messenger: communicationDetails?.platform_messenger,
      }));
      // }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getCommunicationData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        appointment_reminders: formData?.appointment_reminders,
        email: formData?.email,
        other_important_updates: formData?.other_important_updates,
        patient_messages: formData?.patient_messages,
        platform_messenger: formData?.platform_messenger,
        whatsapp: formData?.whatsapp,
      };
      const response = await putData(
        "doctors/communication-preferences/",
        JSON.stringify(payload)
      );
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
        <h3 className="text-darkgreen mb-5">{t("communication.comms")}</h3>
        <div className="row g-4">
          <div className="col-md-6">
            <h5 className="mb-4">{t("communication.notif-pref")}:</h5>
            {["appointment-reminders", "patient-msgs", "important-updates"].map(
              (name) => (
                <div className="form-group mt-2" key={name}>
                  <div className="genderCheck d-flex align-items-center gap-4">
                    <div className="radiotype d-flex align-items-center gap-2">
                      <input
                        type="checkbox"
                        name={name}
                        checked={formData[name]}
                        onChange={handleInputChange}
                      />
                      <label className="mb-0">
                        {" "}
                        {t(`communication.${name}`)}
                      </label>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="col-md-6">
            <h5 className="mb-4">{t("communication.channel-pref")}:</h5>
            {["email", "whatsapp", "platform-messenger"].map((name) => (
              <div className="form-group mt-2" key={name}>
                <div className="genderCheck d-flex align-items-center gap-4">
                  <div className="radiotype d-flex align-items-center gap-2">
                    <input
                      type="checkbox"
                      name={name}
                      checked={formData[name]}
                      onChange={handleInputChange}
                    />
                    <label className="mb-0">{t(`communication.${name}`)}</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="blue_btn" type="submit" onClick={handleSubmit}>
          {t("common.save")}
        </button>
      </div>
    </div>
  );
};

export default CommunicationNotifications;
