import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchDataAuth, updateData } from "../../../../hooks/services/services";
import { showToast } from "../../../../utils/toast";
import CommonModal from "../../../../components/form/Modal";
import { getFormattedDate } from "../../../../utils/common";
import { useTranslation } from "react-i18next";

function ConsultationReport() {
  const { id } = useParams();
  const navigate = useNavigate();
    const { t } = useTranslation();
  const [consultationData, setConsultationData] = useState();
  const [recommendation, setRecommendation] = useState();
  const [consultation, setConsultation] = useState();

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchConsulationData();
  }, [id]);

  useEffect(() => {
    setConsultation(consultationData?.doctor_translated_text);
    setRecommendation(consultationData?.recommendation);
  }, [consultationData]);

  const fetchConsulationData = async () => {
    try {
      const response = await fetchDataAuth(
        `consultation/consultation-report/?appointment_id=${id}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setConsultationData(getData?.consultation[0]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getForm = () => {
    return (
      <>
        <div>
          <label> {t("appointment-list.consultation-report")}</label>
          <input
            type="text"
            value={consultation}
            onChange={(e) => setConsultation(e.target.value)}
            required
          />
        </div>
        <div className="mt-3">
          <label> {t("support.recommendation")}</label>
          <input
            type="text"
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            required
          />
        </div>
      </>
    );
  };

  const handleSubmit = async () => {
    try {
      
      const payload = {
        doctor_translated_text: consultation,
        recommendation: recommendation,
      };
      const response = await updateData(
        `consultation/update-consultation-report/?consultation_id=${consultationData?.id}`,
        JSON.stringify(payload)
      );
      if (response.status === 200) {
        const responseData = await response.json();
        showToast(responseData?.message, "success");
        closeModal();
        fetchConsulationData();
      }
    } catch (error) {
      showToast(error?.message, "error");
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <div class="rightContent rightsidefull">
        <div class="profileMobile">
          <div class="nameMobile">Hello, dr,Ava Williams!</div>
          <div class="profileImgMobile">
            <img src="/images/profile-sample.png" class="img-fluid" />
          </div>
        </div>

        <div class="drAppointmentReport">
          <div class="tabPrt">
            <Link class="bg-darkgreen" to="/doctor/consultation-recordslist">
               {t("appointment-list.records")}
            </Link>
            <Link class="bg-blue">{t("support.reports")}</Link>
          </div>
          <div class="drAppointmentReportInner">
            <div class="left bg-white-transparent padding-20">
              <div class="reportContent border-radius-20 border-gray padding-20">
                <div class="seal">
                  <img src="/images/checkSeal.svg" />
                </div>
                <h6>
                 {t("appointment-list.consultation-report")}{" "}
                  <span onClick={() => setOpenModal(true)}>
                    <img src="/images/edit-dark.svg" />
                  </span>
                </h6>
                <b>Doctor (me):</b>
                <p>{consultationData?.doctor_translated_text}</p>
                <b>Patient:</b>
                <p>{consultationData?.patient_translated_text}</p>
              </div>

              <div class="treatmentPlan border-radius-20 border-gray padding-20">
                <h6>{t("support.treatment-plan")}</h6>
                {consultationData?.prescription ? (
                  <div class="treatmentPlanDeatil border-radius-20 border-gray">
                    <div>
                     {t("support.dr")}  {consultationData?.prescription?.doctor?.name}
                    </div>
                    <div>
                    {t("support.for")}  {consultationData?.prescription?.patient?.name}
                    </div>
                    <div class="clockCalenderPrt dark-tex">
                      <img src="/images/doctor-dashboard/dark-clock.svg" />
                      <span>{consultationData?.prescription?.slot}</span>
                    </div>
                    <div class="clockCalenderPrt dark-tex">
                      <img src="/images/doctor-dashboard/dark-calender.svg" />
                      <span>
                        {getFormattedDate(
                          consultationData?.prescription?.created_date
                        )}
                      </span>
                    </div>
                    <div class="file">
                      <a
                        href={consultationData?.prescription?.pdf_url}
                        download="Prescription.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src="/images/verification.svg"
                          className="img-fluid"
                          alt="Download prescription"
                        />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="treatmentContainer">
                    <div className="no-appointments">
                      <p>{"No prescription found"}</p>
                    </div>
                  </div>
                )}
              </div>

              <div class="reportContent border-radius-20 border-gray padding-20">
                <h6>
                  {t("user-dashboard.reccomendations")}
                  <span onClick={() => setOpenModal(true)}>
                    <img src="/images/edit-dark.svg" />
                  </span>
                </h6>
                {consultationData?.recommendation ? (
                  <p>{consultationData?.recommendation}</p>
                ) : (
                  <div className="treatmentContainer">
                    <div className="no-appointments">
                      <p>
                        {"The doctor has not provided any recommendations."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* <div class="right bg-black-transparent padding-20">
                <div class="videoPart">
                  <img src="../images/video-img.svg" class="img-fluid w-100" />
                </div>
  
                <div class="videoProfileName">
                  <div class="flex-profile">
                    <img src="/images/profile-sample.png" class="img-fluid" />
                    Jenny Leibovitz
                  </div>
                  <p>
                    Thu, Sept 12, 2020 <span>12:30 pm - 13:12 pm</span>
                  </p>
                </div>
  
                <div class="thumbmnailBox">
                  <div class="thumbnailpart">
                    <div class="videothumb">
                      <img src="../images/thumb.svg" class="img-fluid w-100" />
                    </div>
                    <h5>
                      Main tag <span>short resume</span>
                    </h5>
                    <a href="#">
                      <img src="../images/videoicon.svg" />
                    </a>
                  </div>
                  <div class="thumbnailpart">
                    <div class="videothumb">
                      <img src="../images/thumb.svg" class="img-fluid w-100" />
                    </div>
                    <h5>
                      Main tag <span>short resume</span>
                    </h5>
                    <a href="#">
                      <img src="../images/videoicon.svg" />
                    </a>
                  </div>
                  <div class="thumbnailpart">
                    <div class="videothumb">
                      <img src="/images/thumb.svg" class="img-fluid w-100" />
                    </div>
                    <h5>
                      Main tag <span>short resume</span>
                    </h5>
                    <a href="#">
                      <img src="../images/videoicon.svg" />
                    </a>
                  </div>
                  <div class="thumbnailpart">
                    <div class="videothumb">
                      <img src="../images/thumb.svg" class="img-fluid w-100" />
                    </div>
                    <h5>
                      Main tag <span>short resume</span>
                    </h5>
                    <a href="#">
                      <img src="/images/videoicon.svg" />
                    </a>
                  </div>
                </div>
              </div> */}
          </div>
        </div>
        <CommonModal
          title={"Update Consultation"}
          show={openModal}
          size="lg"
          body={getForm()}
          onHide={() => setOpenModal(false)}
          footerButtons={[
            {
              label: "Save",
              onClick: handleSubmit,
              className: "transparent_btn",
            },
            { label: "Cancel", onClick: closeModal, className: "blue_btn" },
          ]}
        />
      </div>
    </>
  );
}

export default ConsultationReport;
