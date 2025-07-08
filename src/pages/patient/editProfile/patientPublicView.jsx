import React, { useEffect, useState } from "react";
import "../../dashboard/clinic-dashboard/clinicDashboard.css";
import { fetchDataAuth } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../../components/ui/loader/loader";
import Flag from 'react-world-flags';
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
function PatientPublicView() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("edit-profile");
  const [patientDetails, setPatientDetails] = useState({});
  const [medicalDocumentDetails, setMedicalDocumentDetails] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [allergyDetails, setAllergyDetails] = useState([]);
  const [showAllergy, setShowAllergy] = useState(false);
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  const [showAllMedicalHistory, setShowAllMedicalHistory] = useState(false);
  const navigate = useNavigate();

  const getLanguageData = async () => {
      try {
        const response = await fetchDataAuth("clinics/languages", navigate);
        if (!response.ok) {
          throw new Error("Failed to fetch data from the server.");
        }
        const getData = await response.json();
        const formattedData = getData?.map((item) => ({
          name: item.title,
          id: item.id,
        }));
        setLanguageOptions(formattedData);
      } catch (error) {
        console.log(error.message);
      }
    };

  // const doctorsWithLanguageNames = isProfiledata?.map((doctor) => {
    const languageNames = isProfiledata?.languages
      ?.map((id) => languageOptions?.find((lang) => lang.id === id))
      .filter(Boolean)
      .map((lang) => lang.name);

  //   return {
  //     ...doctor,
  //     languages: languageNames, // now it's an array of language names
  //   };
  // });

  const getMedicalDocumentsData = async () => {
    try {
      const response = await fetchDataAuth(
        `patient/upload/medical-document/`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setMedicalDocumentDetails(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllergiesData = async () => {
    try {
      const response = await fetchDataAuth(
        `patient/upload/allergy-document/`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setAllergyDetails(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getMedicalDocumentsData();
    getAllergiesData();
    getLanguageData();
  },[]);

 
  return loading ? (
    <Loader />
  ) : (
 
      <div class="clinic_see_user bg-white border-radius-20 padding-20 pb-5 w-100">
        <div class="clinicUser">
          <div class="left">
            {/* <a href="#" class="blue_btn d-flex align-items-center gap-3">
               {t("clinic-see-user.contact-patient")} 
            </a> */}
          </div>
          <div class="right">
            <div class="docNameImg">
              <div>
                <h1>{isProfiledata?.first_name} {isProfiledata?.last_name}</h1>
                <div class="dcDetails">
                  <p>{isProfiledata?.dob || 0 } {t("clinic-see-user.years-old")}</p>
                  <img src="../images/clinic-dashboard/gender.svg" />
                </div>
                <div class="dcDetails">
                  {languageNames?.map(item=>{
                    return <div class="langs">
                    {item}
                    {/* <Flag code={countries[3].languageCode} /> */}
                  </div>})}
                </div>
                <div class="dcDetails">
                  <p>
                    {isProfiledata?.city || "Leon"},{" "}
                    {isProfiledata?.country || "France"}
                  </p>
                  {/* <Flag code={"in"} /> */}
                  {/* <img src="../images/clinic-dashboard/flag.svg" /> */}
                </div>
              </div>
              <div class="img-part">
                <img
                  src={isProfiledata?.profile_picture}
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="clinicUserData">
          <div class="clinicUserDataInner">
            <div class="left">
              <h5>  Email: {isProfiledata?.email }</h5>
              <h5>Phone Number: {isProfiledata?.phone_number}</h5>
            </div>
            <div class="right"></div>
          </div>

          <p class="mt-5">
            
          {isProfiledata?.bio}
          </p>
        </div>

        <div class="row mt-5">
          <div class="col-md-12 mt-3">
            <div class="padding-inner border-radius-20 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="docinfohead"> {t("edit-profile.allergies")}</h3>
              </div>
              <div className="allergiesMain">
                {allergyDetails?.slice(0, 2).map((item) => (
                  <div
                    className="licenses border-gray allr mb-3"
                    key={item.id}
                  >
                    <div className="form-group w-50 d-flex">
                      <p className="mb-0">{t("edit-profile.allergies-name")}</p>
                      {item?.name}
                    </div>
                    <div className="d-flex  gap-3 w-50 d-flex">
                      <p className="mb-0">{t("edit-profile.document-link")}</p>
                      {item?.document_link}
                    </div>
                  </div>
                ))}
                {showAllergy &&
                  allergyDetails.slice(2).map((item) => (
                    <div
                      className="licenses border-gray allr mb-3"
                      key={item.id}
                    >
                      <div className="form-group w-50 d-flex">
                        <p className="mb-0"> {t("edit-profile.allergies-name")}</p> {item?.name}
                      </div>
                      <div className="d-flex gap-3 w-50 d-flex">
                        <p className="mb-0"> {t("edit-profile.document-link")}</p>{" "}
                        {item?.document_link}
                      </div>
                    </div>
                  ))}
              </div>
              {allergyDetails.length > 2 && (
                <a className="downopen" onClick={() => setShowAllergy(!showAllergy)}>
                  <img
                    src="../images/downopen.svg"
                    alt="toggle"
                    style={{
                      transform: showAllergy ? "rotate(180deg)" : "rotate(0deg)", // Rotate icon
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                </a>
              )}
            </div>
          </div>
          <div class="col-md-12 mt-3">
            <div class="padding-inner border-radius-20 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="docinfohead">{t("edit-profile.medical-history")}</h3>
              </div>
              <div className="allergiesMain">
                {medicalDocumentDetails?.slice(0, 2).map((item) => (
                  <div
                    className="licenses border-gray allr mb-3"
                    key={item.id}
                  >
                    <div className="form-group w-50 d-flex">
                      <p className="mb-0"> {t("edit-profile.allergies-name")}</p>
                      {item?.name}
                    </div>
                    <div className="d-flex  gap-3 w-50 d-flex">
                      <p className="mb-0">{t("edit-profile.document-link")}</p>
                      {item?.document_link}
                    </div>
                  </div>
                ))}

                {showAllMedicalHistory &&
                  medicalDocumentDetails?.slice(2).map((item) => (
                    <div
                      className="licenses border-gray allr mb-3"
                      key={item.id}
                    >
                      <div className="form-group w-50 d-flex">
                        <p className="mb-0"> {t("edit-profile.medical-history")}</p> {item?.name}
                      </div>
                      <div className="d-flex gap-3 w-50 d-flex">
                        <p className="mb-0">{t("edit-profile.document-lin")}</p>{" "}
                        {item?.document_link}
                      </div>
                    </div>
                  ))}
              </div>

              {medicalDocumentDetails?.length > 2 && (
                <a
                  className="downopen"
                  onClick={() =>
                    setShowAllMedicalHistory(!showAllMedicalHistory)
                  }
                >
                  <img
                    src="../images/downopen.svg"
                    alt="toggle"
                    style={{
                      transform: showAllMedicalHistory
                        ? "rotate(180deg)"
                        : "rotate(0deg)", // Rotate icon
                      transition: "transform 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
   
  );
}

export default PatientPublicView;
