import React, { useEffect, useState } from 'react'
import { Link,useLocation,useNavigate } from 'react-router-dom'
import { fetchData } from '../../../../hooks/services/services';

function ConsultationReport() {
  const [report,setReport]=useState()
  const location = useLocation();
  const navigate= useNavigate()

 const consultationList = async () => {
    const response = await fetchData(`consultation/consultation-report/?appointment_id=${location?.state?.item}`, navigate);
    if (!response.ok) {
      throw new Error("Failed to fetch data from the server.");
    }
    const list = await response.json();
    setReport(list)
  
  };
console.log(report,">>>>>>>.report")
  useEffect(() => {
    consultationList();
  }, []);

  

  return (
  <>
  <div class="rightContent">
          <div class="profileMobile">
            <div class="nameMobile">Hello, dr,Ava Williams!</div>
            <div class="profileImgMobile">
              <img src="../../images/profile-sample.png" class="img-fluid" />
            </div>
          </div>

          <div class="drAppointmentReport">
            <div class="tabPrt">
              <Link class="bg-darkgreen" to="/../doctor/consultation-recordslist">Records</Link>
              <Link class="bg-blue">Reports</Link>
            </div>
            <div class="drAppointmentReportInner">
              <div class="left bg-white-transparent padding-20">
                <div class="reportContent border-radius-20 border-gray padding-20">
                  <div class="seal"><img src="../../images/checkSeal.svg"/></div>
                  <h6>Consultation report <span><img src="../../images/edit-dark.svg"/></span></h6>
                  <p>viverra nibh Praesent Quisque placerat placerat cursus non amet, adipiscing elit. urna nisl. viverra enim. elementum ac nec quis Nam non in lacus, id ultrices ex. at elit at, maximus non ex porta ullamcorper Nunc tortor. faucibus non, Quisque id leo. varius Nullam vehicula, vitae diam varius nisl. </p>
                  <p>faucibus non, Quisque id viverra nibh Praesent Quisque placerat placerat cursus non amet, adipiscing elit. urna nisl. viverra enim. elementum ac nec </p>
                  <p>sollicitudin. venenatis sollicitudin. at dui. urna. ullamcorper urna viverra nibh Praesent Quisque placerat placerat cursus non amet, adipiscing elit. urna nisl. viverra enim. elementum ac nec quis Nam non in lacus, id ultrices ex. at elit at, maximus non ex porta ullamcorper Nunc tortor. faucibus non, Quisque id viverra nibh Praesent Quisque placerat placerat cursus non amet, adipiscing elit. urna nisl. viverra enim. elementum ac nec </p>
                </div>

                <div class="treatmentPlan border-radius-20 border-gray padding-20">
                  <h6>Preinscriptions & treatment plan</h6>
                  <div class="treatmentPlanDeatil border-radius-20 border-gray">
                    <div>Dr. Green</div>
                    <div>for: Jenny Fox</div>
                    <div class="main-blue-text">Amoxicilina</div>
                    <div>24/09/2023</div>
                    <div class="file"><img src="../../images/verification.svg" class="img-fluid"/></div>
                  </div>
                </div>

                <div class="reportContent border-radius-20 border-gray padding-20">
                  <h6>Reccomendations <span><img src="../../images/edit-dark.svg"/></span></h6>
                  <p>viverra nibh Praesent Quisque placerat placerat cursus non amet, adipiscing elit. urna nisl. viverra enim. elementum ac nec </p>
                </div>
              </div>
              <div class="right bg-black-transparent padding-20">
                <div class="videoPart">
                  <img src="../../images/video-img.svg" class="img-fluid w-100"/>
                </div>

                <div class="videoProfileName">
                  <div class="flex-profile">
                    <img src="../../images/profile-sample.png" class="img-fluid"/>
                    Jenny Leibovitz
                  </div>
                  <p>Thu, Sept 12, 2020 <span>12:30 pm - 13:12 pm</span></p>
                </div>

                <div class="thumbmnailBox">
                  <div class="thumbnailpart">
                    <div class="videothumb">
                      <img src="../../images/thumb.svg" class="img-fluid w-100"/>
                    </div>
                    <h5>Main tag <span>short resume</span></h5>
                    <a href="#"><img src="../../images/videoicon.svg" /></a>
                  </div>
                  <div class="thumbnailpart">
                    <div class="videothumb">
                      <img src="../../images/thumb.svg" class="img-fluid w-100"/>
                    </div>
                    <h5>Main tag <span>short resume</span></h5>
                    <a href="#"><img src="../../images/videoicon.svg" /></a>
                  </div>
                  <div class="thumbnailpart">
                    <div class="videothumb">
                      <img src="../../images/thumb.svg" class="img-fluid w-100"/>
                    </div>
                    <h5>Main tag <span>short resume</span></h5>
                    <a href="#"><img src="../../images/videoicon.svg" /></a>
                  </div>
                  <div class="thumbnailpart">
                    <div class="videothumb">
                      <img src="../../images/thumb.svg" class="img-fluid w-100"/>
                    </div>
                    <h5>Main tag <span>short resume</span></h5>
                    <a href="#"><img src="../../images/videoicon.svg" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          

        </div>
  </>
  )
}

export default ConsultationReport