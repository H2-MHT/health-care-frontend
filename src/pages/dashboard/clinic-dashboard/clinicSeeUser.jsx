import React from 'react'
import "../clinic-dashboard/clinicDashboard.css"
import { useTranslation } from "react-i18next";

function ClinicSeeUser() {
  const { t } = useTranslation();
  return (
    <div>
      <div class="clinic_see_user bg-white border-radius-20 padding-20 pb-5">
        <div class="clinicUser">
          <div class="left">
            <a href="#" class="blue_btn d-flex align-items-center gap-3">
              {t("clinic-see-user.contact-patient")}
            </a>
          </div>
          <div class="right">
            <div class="docNameImg">
              <div>
                <h1>Jenny Leibovitz</h1>
                <div class="dcDetails">
                  <p>28 {t("clinic-see-user.years-old")} </p>
                  <img src="images/clinic-dashboard/gender.svg" />
                </div>
                <div class="dcDetails">
                  <div class="langs">
                    En <img src="images/clinic-dashboard/flag.svg" />
                  </div>
                  <div class="langs">
                    Fr <img src="images/clinic-dashboard/flag.svg" />
                  </div>
                </div>
                <div class="dcDetails">
                  <p>Leon, France</p>
                  <img src="images/clinic-dashboard/flag.svg" />
                </div>
              </div>
              <div class="img-part">
                <img
                  src="images/clinic-dashboard/user-1.svg"
                  class="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="clinicUserData">
          <div class="clinicUserDataInner">
            <div class="left">
              <h5>{t("edit-profile.email-address")}</h5>
              <h5>{t("edit-profile.phone-number")}</h5>
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
          <div class="col-md-12">
            <div class="">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="docinfohead">{t("edit-profile.allergies")}</h3>
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
                        src="images/clinic-dashboard/verification.svg"
                        class="img-fluid"
                      />
                    </div>
                    <div class="form-group w-100">
                      <label>{t("prescription.name")}</label>
                      <input type="date" placeholder="" />
                    </div>
                  </div>
                </div>
              </div>

              <a href="#" class="downopen">
                <img src="images/clinic-dashboard/downopen.svg" />
              </a>
            </div>
          </div>

          <hr class="mt-4 mb-4" />

          <div class="col-md-12">
            <div class="">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="docinfohead">{t("edit-profile.medical-history")}</h3>
              </div>

              <p class="fileacces">{t("clinic-see-user.no-access")}</p>

              <a href="#" class="blue_btn btn-danger mx-auto">
                {t("clinic-see-user.request-access")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClinicSeeUser
