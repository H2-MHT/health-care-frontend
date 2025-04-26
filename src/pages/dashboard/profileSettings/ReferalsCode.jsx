import React, { useState, useEffect } from "react";
import { fetchDataAuth } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { InputField } from "../../../components/form/InputField";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ReferalsCode = () => {
  const{t} = useTranslation("referrals");
  const navigate = useNavigate();
  const [copied, setCopied] = useState({ personal: false, registry: false });
  const [referalsCodeDetails, setReferalsCodeDetails] = useState();

  const copyToClipboard = async (text, type) => {
    if (!text) {
      showToast("No text to copy", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [type]: true });
      setTimeout(() => setCopied({ ...copied, [type]: false }), 1000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  const getReferalsCode = async () => {
    try {
      const response = await fetchDataAuth(
        `doctors/referral/generate/`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }

      const getData = await response.json();
      setReferalsCodeDetails(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getReferalsCode();
  }, []);

  return (
    <div class="col-md-12">
      <div class="settingBox bg-white border-radius-20 padding-20">
        <h3 class="text-darkgreen">{t("referrals.your-referrals")}</h3>
        <p class="text-darkgreen">
          {t("referrals.referrals-txt")}{" "}
          <a href="#" class="main-blue-text text-decoration-underline">
            {" "}
            {t("referrals.how-it-works")}
          </a>
        </p>

        <div class="mainRefferal">
          <div class="refferalCode">
            <p>{t("referrals.personal-code")}</p>{" "}
            <InputField
              type="text"
              placeholder="0987652"
              class="w-25"
              disabled
              value={referalsCodeDetails?.personal_code}
              name="Personal_code"
            />{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                copyToClipboard(
                  referalsCodeDetails?.personal_code || "",
                  "personal"
                );
              }}
            >
              <img src="../images/doctor-dashboard/copy.webp" width="25" />
            </a>{" "}
            {copied.personal && (
              <span style={{ color: "green", marginLeft: "10px" }}>
                Copied!
              </span>
            )}
          </div>
          <div class="refferalCode">
            <p>{t("referrals.registry-link")}</p>{" "}
            <InputField
              type="text"
              placeholder=""
              class="w-50"
              disabled
              value={referalsCodeDetails?.registration_link}
              name="registry_link"
            />{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                copyToClipboard(
                  referalsCodeDetails?.registration_link || "",
                  "registry"
                );
              }}
            >
              <img src="../images/doctor-dashboard/copy.webp" width="25" />
            </a>
            {copied.registry && (
              <span style={{ color: "green", marginLeft: "10px" }}>
                Copied!
              </span>
            )}
          </div>
        </div>

        <div class="mainRefferal mt-3 mb-5">
          <div class="refferalCode">
            <div class="pointsNumber">
              {referalsCodeDetails?.referral_points}
            </div>{" "}
            <p>{t("referrals.points-on-account")}</p>{" "}
          </div>
          <div class="refferalCode">
            <div class="pointsNumber">
              {referalsCodeDetails?.invited_users_count}
            </div>{" "}
            <p>{t("referrals.users-invited")}</p>{" "}
          </div>
          <a href="#" class="transparent_btn">
            {t("referrals.redeem-bonuses")}
          </a>
        </div>

        <h3 class="text-darkgreen">{t("referrals.was-invited")}</h3>
        <p class="text-darkgreen">{t("referrals.unique-ref-txt")}</p>

        <div class="mainRefferal">
          <div class="refferalCode">
            <p>{t("referrals.invitation-code")}</p>{" "}
            <input
              type="text"
              placeholder="0987652"
              className="w-25"
              name="invitation_code"
              disabled
              value={referalsCodeDetails?.personal_code}
            />
          </div>
        </div>
        <div></div>
        <p class="text-darkgreen mt-5">{t("referrals.bonus-point-txt")}</p>
      </div>
    </div>
  );
};

export default ReferalsCode;
