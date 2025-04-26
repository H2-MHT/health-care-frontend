import React from 'react';
import { useTranslation } from "react-i18next";

function DoctorChatVideoCall() {
   const { t } = useTranslation();
  return (
    <div class="rightContent">
      <div class="profileMobile">
        <div class="nameMobile">Hello, dr,Ava Williams!</div>
        <div class="profileImgMobile">
          <img
            src="images/doctor-dashboard/profile-sample.png"
            class="img-fluid"
          />
        </div>
      </div>

      <div class="chatArea">
        <div class="videoChatBg">
          <img
            src="images/doctor-dashboard/video-img.svg"
            class="img-fluid w-100"
          />
        </div>

        <div class="videoRecoringBtn">
          <a href="#">
            <img src="images/doctor-dashboard/callRecording.webp" />
          </a>
          <p>03:36</p>
        </div>

        <div class="chatPart">
          <div class="firstBox bg-white border-radius-20 padding-20">
            <div class="boxHead">
              <img src="images/Info.svg" />
              <h6>{t("doctor-chat.meeting-ready")}</h6>
              <a href="#">
                <img src="images/doctor-dashboard/cross.svg" />
              </a>
            </div>
            <h5>{t("doctor-chat.add-patient")}</h5>
            <div class="callAddLink">
              <div class="callAdd">
                <a href="#">+</a>
                <div class="img-parallel">
                  <img
                    src="images/doctor-dashboard/profile-sample.png"
                    class="img-fluid"
                  />
                  <p>Jenny Leibovitz</p>
                </div>
              </div>
              <h4>Or</h4>
              <a href="#" class="main-blue-text">
                {t("doctor-chat.share-link")}{" "}
              </a>
            </div>
          </div>

          <div class="secondBox">
            <a href="#">
              <img src="images/doctor-dashboard/mic.webp" />
            </a>
            <a href="#">
              <img src="images/doctor-dashboard/callCut.webp" />
            </a>
            <a href="#">
              <img src="images/doctor-dashboard/videoCall.webp" />
            </a>
          </div>

          <div class="thirdBox">
            <div class="chatBoxMain bg-white-transparent border-radius-20">
              <div class="chatTop">
                Chat{" "}
                <img
                  src="images/doctor-dashboard/arrowDownLight.webp"
                  style={{ width: "18px" }}
                />
              </div>
              <div class="chatAreaTying"></div>
              <div class="chatType">
                <input type="text" placeholder="Type your text here..." />
                <a href="#">
                  <img src="images/doctor-dashboard/chatSend.webp" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorChatVideoCall