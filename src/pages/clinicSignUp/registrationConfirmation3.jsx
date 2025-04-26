import React from "react";
import Header from "../../components/ui/header/header";
import { Footer } from "../../components/ui/footer/footer";
import '../signup/signup.css';
import { useTranslation } from "react-i18next";

const RegistrationConfirmation3 = () => {
    const { t } = useTranslation();
    return (
      <div>
        <Header />
        <section class="form_part space-cmn">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="signupTab">
                  <div class="formArea border-radius-20 border-gray">
                    <div className="w-100 mt-4 mb-4 px-4 pb-0">
                      <h5 class="form-head mt-4 mb-4 text-center">
                        {t("clinic-signup.almost-there")}
                      </h5>
                      <p class="text-center mb-4 text-center">
                        {t("clinic-signup.one-step-away")}
                      </p>
                    </div>
                    <form className="mt-5 p-4">
                      <div class="row g-4">
                        <div class="col-md-12">
                          <a href="#" class="transparent_black_lg mx-auto">
                            {t("clinic-signup.continue-profile")}
                          </a>
                        </div>
                        <div class="co-md-12">
                          <a href="#" class="forgot text_decor">
                            {t("clinic-signup.go-to-dashboard")}
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

export default RegistrationConfirmation3
