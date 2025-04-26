import React, { useEffect, useState } from "react";
import "../../dashboard/clinic-dashboard/clinicDashboard.css";
import { fetchDataAuth } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../../components/ui/loader/loader";
import Flag from 'react-world-flags';

function PatientPublicView() {
  const [loading, setLoading] = useState(false);
  const [patientDetails, setPatientDetails] = useState({});
  const [medicalDocumentDetails, setMedicalDocumentDetails] = useState([]);
  const [allergyDetails, setAllergyDetails] = useState([]);
  const [showAllergy, setShowAllergy] = useState(false);
    const [showAllMedicalHistory, setShowAllMedicalHistory] = useState(false);
  const navigate = useNavigate();

  const countries = [
    {
      name: "United States",
      code: "US",
      language: "English",
      languageCode: "EN"
    },
    {
      name: "India",
      code: "IN",
      language: "Hindi",
      languageCode: "HI"
    },
    {
      name: "Germany",
      code: "DE",
      language: "German",
      languageCode: "DE"
    },
    {
      name: "France",
      code: "FR",
      language: "French",
      languageCode: "FR"
    },
    {
      name: "Japan",
      code: "JP",
      language: "Japanese",
      languageCode: "JA"
    },
    {
      name: "Brazil",
      code: "BR",
      language: "Portuguese",
      languageCode: "PT"
    },
    {
      name: "China",
      code: "CN",
      language: "Mandarin",
      languageCode: "ZH"
    },
    {
      name: "Russia",
      code: "RU",
      language: "Russian",
      languageCode: "RU"
    },
    {
      name: "Mexico",
      code: "MX",
      language: "Spanish",
      languageCode: "ES"
    },
    {
      name: "South Korea",
      code: "KR",
      language: "Korean",
      languageCode: "KO"
    }
  ];

  const fetchPatientDetails = async () => {
    setLoading(true);
    const url = "";
    try {
      const response = await fetchDataAuth(url, navigate);
      if (response.status === 200) {
        const data = await response.json();
        setPatientDetails(data);
      } else throw new Error("Failed to fetch Patient Details from server");
    } catch (err) {
      console.error("Error Fetching Details: ", err);
    } finally {
      setLoading(false);
    }
  };

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
    // fetchPatientDetails();
    getMedicalDocumentsData();
    getAllergiesData();
  });

  return loading ? (
    <Loader />
  ) : (
    <div>
      <div class="clinic_see_user bg-white border-radius-20 padding-20 pb-5">
        <div class="clinicUser">
          <div class="left">
            <a href="#" class="blue_btn d-flex align-items-center gap-3">
              Contact with patient
            </a>
          </div>
          <div class="right">
            <div class="docNameImg">
              <div>
                <h1>{patientDetails?.name || "Jenny Leibovitz"}</h1>
                <div class="dcDetails">
                  <p>{patientDetails?.age || "28"} years old</p>
                  <img src="../images/clinic-dashboard/gender.svg" />
                </div>
                <div class="dcDetails">
                  <div class="langs">
                    {patientDetails?.languages?.[0] || "En"}
                    {/* <img src="../images/clinic-dashboard/flag.svg" /> */}
                    <Flag code={countries[3].languageCode} />
                  </div>
                  <div class="langs">
                    {patientDetails?.languages?.[0] || "Fr"}
                    {/* <img src="../images/clinic-dashboard/flag.svg" /> */}
                    <Flag code={countries[4].languageCode} />
                  </div>
                </div>
                <div class="dcDetails">
                  <p>
                    {patientDetails?.city || "Leon"},{" "}
                    {patientDetails?.country || "France"}
                  </p>
                  <Flag code={"in"} />
                  {/* <img src="../images/clinic-dashboard/flag.svg" /> */}
                </div>
              </div>
              <div class="img-part">
                <img
                  src="../images/clinic-dashboard/user-1.svg"
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="clinicUserData">
          <div class="clinicUserDataInner">
            <div class="left">
              <h5>{patientDetails?.email_address || "Email address"}</h5>
              <h5>{patientDetails?.phone_number || "Phone Number"}</h5>
            </div>
            <div class="right"></div>
          </div>

          <p class="mt-5">
            BioNam non in lacus, id ultrices ex. at elit at, maximus non ex
            porta ullamcorper Nunc tortor. faucibus non, Quisque id leo. varius
            Nullam vehicula, vitae diam varius nisl. sollicitudin. venenatis
            sollicitudin. at dui. urna. ullamcorper urnuis Nam non in lacus, id
            ultrices ex. at elit at, maximus non ex porta ullamcorper Nunc
            tortor. faucibus non, Quisque id{" "}
          </p>
        </div>

        <div class="row mt-5">
          {/* <div class="col-md-12">
            <div class="">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="docinfohead">Allergies</h3>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <textarea
                      rows="3"
                      placeholder="medications name"
                    ></textarea>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="licenses p-0">
                    <div class="file">
                      <img
                        src="../images/clinic-dashboard/verification.svg"
                        class="img-fluid"
                      />
                    </div>
                    <div class="form-group w-100">
                      <label>name</label>
                      <input type="date" placeholder="" />
                    </div>
                  </div>
                </div>
              </div>

              <a href="#" class="downopen">
                <img src="../images/clinic-dashboard/downopen.svg" />
              </a>
            </div>
          </div>

          <hr class="mt-4 mb-4" />

          <div class="col-md-12">
            <div class="">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="docinfohead">Medical history</h3>
              </div>

              <p class="fileacces">You dont have access to this files</p>

              <a href="#" class="blue_btn btn-danger mx-auto">
                Requestion for access
              </a>
            </div>
          </div> */}

          <div class="col-md-12 mt-3">
            <div class="padding-inner border-radius-20 bg-white">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="docinfohead">Allergies</h3>
                {/* <a>
                  <img
                    src="../images/folder.svg"
                    onClick={() => setUserAddOpenModel(true)}
                  />
                </a> */}
              </div>
              <div className="allergiesMain">
                {allergyDetails?.slice(0, 2).map((item) => (
                  <div
                    className="licenses border-gray allr mb-3"
                    key={item.id}
                  >
                    <div className="form-group w-50 d-flex">
                      <p className="mb-0">Allergies name:</p>
                      {item?.name}
                    </div>
                    <div className="d-flex  gap-3 w-50 d-flex">
                      <p className="mb-0">Document Link:</p>
                      {item?.document_link}
                    </div>
                    {/* <div className="d-flex align-items-center gap-3">
                      <img
                        src="../images/edit.svg"
                        width="25"
                        onClick={() => handleEditAllergieDetails(item)}
                        alt="edit"
                      />
                      <img
                        src="../images/delete.svg"
                        width="25"
                        alt="delete"
                        onClick={() => removeAllergie(item)}
                      />
                    </div> */}
                  </div>
                ))}
                {showAllergy &&
                  allergyDetails.slice(2).map((item) => (
                    <div
                      className="licenses border-gray allr mb-3"
                      key={item.id}
                    >
                      <div className="form-group w-50 d-flex">
                        <p className="mb-0">Allergies name:</p> {item?.name}
                      </div>
                      <div className="d-flex gap-3 w-50 d-flex">
                        <p className="mb-0">Document Link:</p>{" "}
                        {item?.document_link}
                      </div>
                      {/* <div className="d-flex align-items-center gap-3">
                        <img
                          src="../images/edit.svg"
                          width="25"
                          onClick={() => handleEditAllergieDetails(item)}
                          alt="edit"
                        />
                        <img
                          src="../images/delete.svg"
                          width="25"
                          alt="delete"
                          onClick={() => removeAllergie(item)}
                        />
                      </div> */}
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
                <h3 class="docinfohead">Medical history</h3>
                {/* <a>
                  <img
                    src="../images/folder.svg"
                    onClick={() => setUserMedicalHistoryModel(true)}
                  />
                </a> */}
              </div>
              <div className="allergiesMain">
                {medicalDocumentDetails?.slice(0, 2).map((item) => (
                  <div
                    className="licenses border-gray allr mb-3"
                    key={item.id}
                  >
                    <div className="form-group w-50 d-flex">
                      <p className="mb-0">Allergies name:</p>
                      {item?.name}
                    </div>
                    <div className="d-flex  gap-3 w-50 d-flex">
                      <p className="mb-0">Document Link:</p>
                      {item?.document_link}
                    </div>
                    {/* <div className="d-flex align-items-center gap-3">
                      <img
                        src="../images/edit.svg"
                        width="25"
                        onClick={() => handleMedicalDocumentDetails(item)}
                        alt="edit"
                      />
                      <img
                        src="../images/delete.svg"
                        width="25"
                        alt="delete"
                        onClick={() => removeMedicalDocument(item)}
                      />
                    </div> */}
                  </div>
                ))}

                {showAllMedicalHistory &&
                  medicalDocumentDetails?.slice(2).map((item) => (
                    <div
                      className="licenses border-gray allr mb-3"
                      key={item.id}
                    >
                      <div className="form-group w-50 d-flex">
                        <p className="mb-0">Medical history:</p> {item?.name}
                      </div>
                      <div className="d-flex gap-3 w-50 d-flex">
                        <p className="mb-0">Document Link:</p>{" "}
                        {item?.document_link}
                      </div>
                      {/* <div className="d-flex align-items-center gap-3">
                        <img
                          src="../images/edit.svg"
                          width="25"
                          onClick={() => handleMedicalDocumentDetails(item)}
                          alt="edit"
                        />
                        <img
                          src="../images/delete.svg"
                          width="25"
                          alt="delete"
                          onClick={() => removeMedicalDocument(item)}
                        />
                      </div> */}
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
    </div>
  );
}

export default PatientPublicView;
