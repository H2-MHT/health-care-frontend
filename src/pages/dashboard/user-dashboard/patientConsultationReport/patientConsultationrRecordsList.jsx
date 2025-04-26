import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchData } from "../../../../hooks/services/services";

const PatientConsultationRecordsList=()=> {
  const [patientList, setPatientList] = useState();
  const navigate = useNavigate();
  
  const consultationList = async () => {
    const response = await fetchData("consultation/prescription-list/", navigate);
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
      <div class="rightContent">
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
            <Link  class="bg-darkgreen">
              Records
            </Link>
            <Link  class="bg-blue" >
              Reports
            </Link>
          </div>
          <div class="drAppointmentReportInner">
            <div class="left bg-white">
              <div class="lastReport bg-none shadow-none border-radius-none">
                <div class="lastReportFix h-100">
                  {patientList?.map((item) => {
                    return (
                      <div className="reportDetail" key={item.id}>
                        <div className="img-prt">
                          {/* <img
                            src={item?.patient?.}
                            className="img-fluid"
                            alt="Patient"
                          /> */}
                          {item?.patient?.name} {item?.patient?.last_name}
                        </div>
                        <div className="red-green">
                          {item.status === "Completed" ? (
                            <img
                              src="../images/greencircle.png"
                              className="img-fluid"
                              alt="Status"
                            />
                          ) : (
                            <img
                              src="../images/redcircle.png"
                              className="img-fluid"
                              alt="Status"
                            />
                          )}
                        </div>
                        <div className="text-weight-bold">
                          {item?.created_date                          }{" "}
                          <span className="text-weight-normal">
                            {item?.slot}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div class="right bg-black-transparent padding-20">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PatientConsultationRecordsList;






