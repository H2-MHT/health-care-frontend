import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchData } from "../../../../hooks/services/services";
import { getFormattedDate } from "../../../../utils/common";

const PatientConsultationRecordsList = () => {
  const [patientList, setPatientList] = useState();
  const navigate = useNavigate();
  const sampleImage = "/images/sample.png";

  const consultationList = async () => {
    const response = await fetchData(
      "consultation/prescription-list/",
      navigate
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data from the server.");
    }
    const list = await response.json();
    setPatientList(list?.prescriptions);
  };

  useEffect(() => {
    consultationList();
  }, []);

  return (
    <>
      <div class="rightContent rightsidefull">
        <div class="profileMobile">
          <div class="nameMobile">Hello, dr,Ava Williams!</div>
          <div class="profileImgMobile">
            <img src="../images/profile-sample.png" class="img-fluid" />
          </div>
        </div>

        <div class="sortSearchArea">
          <div class="search">
            <input type="search" placeholder="search" />
            <a href="#">
              <img src="../images/search-dark.svg" />
            </a>
          </div>
        </div>

        <div class="drAppointmentReport">
          <div class="tabPrt">
            <Link class="bg-darkgreen">Records</Link>
            <Link class="bg-blue">Reports</Link>
          </div>
          <div class="drAppointmentReportInner">
            <div class="left bg-white">
              <div class="lastReport bg-none shadow-none border-radius-none">
                <div class="lastReportFix h-100">
                  {patientList?.length > 0 ? (
                    patientList?.map((item) => (
                      <div className="reportDetail" key={item.id}>
                        <div className="img-prt">
                          <img
                            src={item?.doctor?.profile_picture || sampleImage}
                            className="img-fluid"
                            alt="Patient"
                          />
                          <Link
                            to={`/patient/consultationreport/${item?.appointment_id}`}
                          >
                            Dr.&nbsp;{item?.doctor?.name}
                          </Link>
                        </div>

                        <div className="red-green">
                          {item?.status === "Completed" ? (
                            <img
                              src="../images/greencircle.png"
                              className="img-fluid"
                              alt="Completed"
                            />
                          ) : (
                            <img
                              src="../images/redcircle.png"
                              className="img-fluid"
                              alt="Pending"
                            />
                          )}
                        </div>

                        {/* ✅ 3. use className, not class */}
                        <div className="third">
                          <div className="clockCalenderPrt dark-text w-100">
                            <img
                              src="/images/doctor-dashboard/dark-calender.svg"
                              alt="Calendar"
                            />
                            <span>{getFormattedDate(item?.created_date)}</span>
                          </div>
                        </div>

                        <div className="third">
                          <div className="clockCalenderPrt dark-text w-100">
                            <img
                              src="/images/doctor-dashboard/dark-clock.svg"
                              alt="Clock"
                            />
                            <span>{item?.slot}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      No consultation Reports available
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* <div class="right bg-black-transparent padding-20">
              <div class="videoPart">
                <img src="../images/video-img.svg" class="img-fluid w-100" />
              </div>

              <div class="videoProfileName">
                <div class="flex-profile">
                  <img src="../images/profile-sample.png" class="img-fluid" />
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
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientConsultationRecordsList;
