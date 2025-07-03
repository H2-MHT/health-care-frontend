import React, { useEffect, useState } from "react";
import { fetchData } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import "../doctor-dashboard/dashboard.css";
import { Loader } from "../../../components/ui/loader/loader";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import PrescriptionForm from "./prescription";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const DoctorPrescription = () => {
  const { t } = useTranslation("prescription");
  const navigate = useNavigate();
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  const [prescriptionForm, setPrescriptionForm] = useState(false);
  const [patientList, setPatientList] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedPatientObject, setSelectedPatientObject] = useState({});

  const getPatientList = async () => {
    setLoading(true);
    const response = await fetchData("doctors/appointment-list/", navigate);
    if (!response.ok) {
      throw new Error("Failed to fetch data from the server.");
    }
    const list = await response.json();
    setLoading(false);
    setPatientList(list?.data);
  };

  useEffect(() => {
    getPatientList();
  }, []);

  const getPatientDetails = (patientObject) => {
    setPrescriptionForm(true);
    setSelectedPatientObject(patientObject);
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
    <>
      {loading ? (
        <Loader />
      ) : (
        <div class="rightContent rightsidefull">
          <div class="profileMobile">
            <div class="nameMobile">{`Hello, Dr ${isProfiledata?.first_name} ${isProfiledata?.last_name}!`}</div>
            <div class="profileImgMobile">
              <img src="images/profile-sample.png" class="img-fluid" />
            </div>
          </div>

          <div class="sortSearchArea">
            <div class="search">
              <input type="search" placeholder="search" />
              <a href="#">
                <img src="../images/search-dark.svg" />
              </a>
            </div>
            <div class="sorting">
              <select>
                <option>Sort by</option>
                <option>Sort by</option>
              </select>
            </div>
          </div>

          <div class="preinscriptions">
            <div class="pateintData">
              <div class="tabPrt">
                {/* <a href="#" class="bg-pink">
                Treatment Plan
              </a>
              <a href="#" class="bg-blue">
                Requests
              </a> */}
                <a href="#" class="bg-darkgreen">
                  {t("prescription.patient")}
                </a>
              </div>
              <div class="preinscriptionsOuter">
                <div class="treatmentData">
                  {patientList?.length === 0 ? (
                    <h4 className="no-data-message">
                      No prescription list found.
                    </h4>
                  ) : (
                    patientList?.map((patientObject, index) => (
                      <div className="patientDetail" key={index}>
                        <div className="treatmentDeatil col-12">
                          <div className="flex-profile col-3">
                            <img
                              src={
                                patientObject?.Patient?.profile_picture ||
                                "../images/profile-sample.png"
                              }
                              className="img-fluid"
                              alt="Patient"
                            /><b>Patient:{" "}</b>
                            {patientObject?.Patient?.first_name}{" "}
                            {patientObject?.Patient?.last_name}
                          </div>
                          {/* <div className="main-blue-text col-3">
                            Amoxicilina
                          </div> */}
                          {/* <div className="file col-3">
                            <img
                              src="images/verification.svg"
                              className="img-fluid"
                              alt="Verification"
                            />
                          </div> */}
                          <div className="skillEdit">
                            <a
                              href="#"
                              data-tooltip="Add/Edit Prescription"
                              onClick={(e) => {
                                e.preventDefault();
                                getPatientDetails(patientObject);
                              }}
                            >
                              <img
                                src="../images/doctor-dashboard/edit-skill.webp"
                                alt="Edit"
                              />
                            </a>
                          </div>
                          <div className="file col-3">
                            <a
                              href="#"
                              data-tooltip="Download Prescription"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePdfDownload(patientObject?.appointment_id);
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
                            {dayjs(patientObject?.date).format(
                              "ddd, MMM D, YYYY"
                            )}{" "}
                            <span>{patientObject?.slot}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              {/* {console.log(">>>>>>>>>>prescriptionForm", prescriptionForm)} */}
              {prescriptionForm && (
                <PrescriptionForm
                  open={prescriptionForm}
                  setOpen={setPrescriptionForm}
                  patientDetailsObject={selectedPatientObject}
                  profileData={isProfiledata}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorPrescription;
