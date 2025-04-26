import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const AppointmentDetailsPop = () => {
   const { t } = useTranslation();
  const [supportTeam, setSupportTeam] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSupportTeam((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


   const onSubmit = async (data) => {
      console.log(data, ">>>>>>>>>>>>>");
      try {
        const payload = {
          supportTeam: data?.mediaFiles,
        
        };
        console.log(payload, ">>>>>delhi");
        // Add your API call or processing logic here
      } catch (error) {
        console.log(error,">>>>")
        // showToast(error.message, "error");
      }
    };

 

  return (
    <>
      <div
        className="modal fade reschduleModal"
        id="supportModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5
                className="modal-title text-center marginleftauto"
                id="exampleModalLabel"
              >
                {t("appointment-list.appointment-details")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="appointPopup">
                <div className="status align-items-center">
                  <p style={{ color: "#666666" }} className="mb-0">
                    {t("appointment-list.leave-message")}
                  </p>
                </div>
                <div className="status">
                  <textarea
                    id="example-textarea"
                    className="styled-textarea"
                    rows="5"
                    cols="5"
                    placeholder="Type your message here..."
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="status"></div>

                <div className="rescduleBtns flex-column">
                  <button type="button" className="blue_lg" onSubmit={onSubmit}>
                    {t("appointment-list.send-email")}
                  </button>
                  <div>or</div>
                  <button
                    type="button"
                    className="transparent_blue_lg"
                    data-bs-toggle="modal"
                    data-bs-target="#reschdule2"
                  >
                    {t("appointment-list.go-to-chat")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentDetailsPop;
