import React from "react";
import Header from "../../components/ui/header/header";
import { Footer } from "../../components/ui/footer/footer";
import Image from "../../components/form/Image"
import '../signup/signup.css'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RegistrationConfirmation = () => {
     const { t } = useTranslation();
    const navigate = useNavigate();
    return (
      <div>
        <Header />
        <section class="form_part space-cmn">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="signupTab">
                  <div class="formArea border-radius-20 border-gray">
                    <div className="w-100 mt-4 mb-4 p-4 pb-0">
                      <a href="#" class="back">
                        <Image src="/images/backarrow.png" />{" "}
                        {t("singup.back_lable")}
                      </a>
                      <h5 class="form-head mt-4 mb-4 text-center">
                        {t("clinic-signup.registration-confirmation")}
                      </h5>
                      <p class="text-center mb-4 text-center">
                        {t("clinic-signup.registration-notice")}
                      </p>
                    </div>
                    <form className="mt-5 p-4">
                      <div class="row g-4">
                        <div class="col-md-12">
                          <a
                            href="#"
                            class="transparent_black_lg mx-auto"
                            onClick={() => navigate("/clinic-signup")}
                          >
                            {t("clinic-signup.return-homepage")}
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
}

export default RegistrationConfirmation
