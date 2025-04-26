import React, { useState, useEffect } from "react";
import { InputField } from "../../../components/form/InputField";
import { showToast } from "../../../utils/toast";
import { fetchDataAuth, postData } from "../../../hooks/services/services";
import { useTranslation } from "react-i18next";


const CancellationPolicy = () => {
  const{t} = useTranslation("cancellation")

  const [formData, setFormData] = useState({
    no_fee_cancellation_period: "",
    fee_percentage: "",
    chargeable_cancellation_period: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getConsultationData = async () => {
    try {
      const response = await fetchDataAuth(`doctors/cancellation-policy/`);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      const CancellationData = getData;
      setFormData({
        no_fee_cancellation_period:
          CancellationData?.no_fee_cancellation_period || "",
        fee_percentage: CancellationData?.fee_percentage || "",
        chargeable_cancellation_period:
          CancellationData?.chargeable_cancellation_period || "",
      });
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
      const payload = {
        no_fee_cancellation_period: formData?.no_fee_cancellation_period,
        fee_percentage: formData?.fee_percentage,
        chargeable_cancellation_period:
          formData?.chargeable_cancellation_period,
      };

      const response = await postData(`doctors/cancellation-policy/`, payload);

      if (response.status === 200) {
        const responseJson = await response.json();
        showToast(responseJson?.message, "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="col-md-12">
      <div className="settingBox bg-white border-radius-20 padding-20">
        <h3 className="text-darkgreen mb-5">{t("cancellation.policy")}</h3>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="d-flex gap-3 mt-3 align-items-center">
              <p className="mb-0">{t("cancellation.no-fee")} </p>
              <div className="form-group w-auto">
                <InputField
                  type="time"
                  placeholder="hh-mm"
                  name="no_fee_cancellation_period"
                  value={formData.no_fee_cancellation_period}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="d-flex align-items-center gap-4 mt-3 cPolicy">
              <div className="d-flex align-items-center gap-2">
                <div className="form-group width-150">
                  <InputField
                    type="text"
                    placeholder="-- % fee"
                    name="fee_percentage"
                    value={formData.fee_percentage}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="mb-0"> {t("cancellation.notice")} </p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="form-group width-150">
                  <InputField
                    type="time"
                    placeholder="hh-mm"
                    name="chargeable_cancellation_period"
                    value={formData.chargeable_cancellation_period}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="mb-0">{t("cancellation.time-before")} </p>
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

export default CancellationPolicy;
