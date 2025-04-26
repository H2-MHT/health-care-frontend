import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import MembershipPlanPop from "./membershipPlanPop";
import { Navigate } from "react-router-dom";
import { InputField } from "../../../../components/form/InputField";
import { fetchDataAuth } from "../../../../hooks/services/services";
import { useTranslation } from "react-i18next";


const MembershipPlan = () => {
  const{t} = useTranslation();
  const [modelOpen, setModelOpen] = useState(false);
  const [MemberShipPlanDetails, setMemberShipPlanDetails] = useState(null);
  const [formData, setFormData] = useState({
    selectedPlan: "basic", // Default selected plan
  });

  const handleRadioChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedPlan: e.target.value,
    }));
  };

  const getMemberShipPlan = async () => {
    try {
      const response = await fetchDataAuth(
        `doctors/select-membership/`,
        Navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setMemberShipPlanDetails(getData);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getMemberShipPlan();
  }, []);

  useEffect(() => {
    if (MemberShipPlanDetails) {
      setFormData((prevState) => ({
        ...prevState,
        selectedPlan: MemberShipPlanDetails.membership_type || "basic",
      }));
    }
  }, [MemberShipPlanDetails]);

  const handleSubscribe = () => {
    setModelOpen(true);
  };


  return (
    <div className="col-md-12">
      <div className="memberPlans bg-white border-radius-20 padding-20">
        <div className="leftSide">
          <div className="d-flex align-items-center gap-3 mb-4">
            <InputField
              type="radio"
              value="basic"
              checked={formData.selectedPlan === "basic"}
              onChange={handleRadioChange}
            />
            <h4 className="mb-0">{t("membership.basic-membership-plan")}</h4>
          </div>
          <ul>
            <li>Options</li>
            <li>Basic Options</li>
            <li>Basic Plan</li>
          </ul>
        </div>

        <div className="rightSide">
          <div className="d-flex align-items-center gap-3 mb-4">
            <InputField
              type="radio"
              value="premium"
              checked={formData.selectedPlan === "premium"}
              onChange={handleRadioChange}
            />
            <h4 className="mb-0">{t("membership.premium-member")}</h4>
          </div>
          <ul>
            <li>Especial Options</li>
            <li>Benefits and Options</li>
            <li>Special Plan</li>
          </ul>
          <a href="#" className="subscribeBtn mt-4" onClick={handleSubscribe}>
            {t("common.subscribe-now")}
          </a>
        </div>
      </div>
      <MembershipPlanPop
        setModelOpen={setModelOpen}
        modelOpen={modelOpen}
        Modal={Modal}
        formData={formData}
      />
    </div>
  );
};

export default MembershipPlan;
