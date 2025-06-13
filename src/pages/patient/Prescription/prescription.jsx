import React, { useEffect, useState } from "react";
import { fetchData } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
// import "../doctor-dashboard/dashboard.css";
import { Loader } from "../../../components/ui/loader/loader";
import { useSelector } from "react-redux";
import { showToast } from "../../../utils/toast";
import { useTranslation } from "react-i18next";

const PatientPrescription = () => {
  const navigate = useNavigate();
   const { t } = useTranslation("edit-profile");
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      // setLoading(true);
      const response = await fetchData(
        "consultation/prescription-list/",
        navigate
      );
      const data = await response.json();
      if (response.ok) {
        setPrescriptions(data.prescriptions);
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      // setLoading(false);
    }
  };

  const handlePdfDownload = async (appointmentId) => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      console.error("User is not logged in or no token available.");
      return;
    }

    let pdfUrl = `consultation/prescription_template/?appointment_id=${appointmentId}`;

    try {
      const response = await fetchData(pdfUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the PDF");
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "prescription.pdf"; // Set the desired filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up the Blob URL after a short delay
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error("Error downloading the PDF:", error);
    }
  };
  return (
    <div class="rightContent rightsidefull">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div class="profileMobile">
            <div class="nameMobile">{`Hello,  ${isProfiledata?.first_name} ${isProfiledata.last_name}!`}</div>
            <div class="profileImgMobile">
              <img src="../images/profile-sample.png" class="img-fluid" />
            </div>
          </div>

          <div class="preinscriptions">
            <div class="pateintData">
              <div class="tabPrt">
                <a href="#" class="bg-darkgreen">
                   {t("edit-profile.prescriptions")}
                </a>
              </div>
              <div class="preinscriptionsOuter">
                <div class="treatmentData">
                  {prescriptions && prescriptions?.length > 0 ? (
                    prescriptions?.map((prescription) => (
                      <div
                        className="patientDetail"
                        key={prescription?.appointment_id}
                      >
                        <div className="treatmentDeatil col-12">
                          <div className="flex-profile col-3">
                            <img
                              src="../images/profile-sample.png"
                              className="img-fluid"
                              alt="Patient profile"
                            />
                            {prescription?.patient.name}
                          </div>
                          <div className="main-blue-text col-3">
                            {`Dr. ${prescription?.doctor?.name}`} <br />
                            {prescription?.doctor?.email}
                          </div>
                          <div className="file col-3">
                            <a
                              href="#"
                              data-tooltip="Download Prescription"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePdfDownload(prescription?.appointment_id);
                              }}
                            >
                              <img
                                src="../images/verification.svg"
                                className="img-fluid"
                                alt="Download prescription"
                              />
                            </a>
                          </div>
                          <div className="doubleLine col-3">
                            <span> {t("edit-profile.created-date")}</span>{" "}
                            {prescription?.created_date}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="treatmentContainer">
                      <div className="no-appointments">
                         {t("edit-profile.prescription-found")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PatientPrescription;
