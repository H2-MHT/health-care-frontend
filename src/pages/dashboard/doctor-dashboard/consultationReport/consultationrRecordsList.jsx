import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchData } from "../../../../hooks/services/services";
import { useSSR } from "react-i18next";

function ConsultationRecordsList() {
  const [patientList, setPatientList] = useState();
  const navigate = useNavigate();

  const consultationList = async () => {
    const response = await fetchData("doctors/appointment-list/", navigate);
    if (!response.ok) {
      throw new Error("Failed to fetch data from the server.");
    }
    const list = await response.json();
    setPatientList(list?.data);
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
            <a href="#" class="bg-darkgreen">
              Records
            </a>
            <Link  class="bg-blue">
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
                          <img
                            src={item?.patient?.profile_picture}
                            className="img-fluid"
                            alt="Patient"
                          />
                          <Link
                            to="/doctor/consultation-report/"
                            state={{ item: item?.appointment_id }}
                          >
                            {item?.patient?.first_name}{" "}
                            {item?.patient?.last_name}
                          </Link>
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
                          {item?.date}{" "}
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

export default ConsultationRecordsList;



// import React from 'react';

// const ConsultationRecordsList = ({ }) => {

//   let videoUrl = "https://healthcare4storage.blob.core.windows.net/healthcare/recordings/6cb7c644df40e3a764e8f8856784b0e3_chat_d5_yopmail_com_sakshi1_yopmail_com.m3u8?se=2025-04-24T13%3A31%3A26Z&sp=r&sv=2025-05-05&sr=b&sig=a5GlZEGOZLWnoB7wclLq42vaUSAKHoil3ztdQ5CyTwc%3D"
//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <video controls width="720">
//         <source src={videoUrl} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//     </div>
//   );
// };
// export default ConsultationRecordsList;



