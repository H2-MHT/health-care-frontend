import React from 'react'
import '../../../../components/ui/footer/footer.css';
import { useTranslation

 } from 'react-i18next';
export const Footer = () => {
   const{t} = useTranslation("footer");
  return (
    <footer>
      <div class="chatting">
        <img src="/images/doctor-dashboard/chat-2.svg" />
      </div>
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <div class="footer_data">
              <a href="#" class="footer_logo">
                <img src="/images/logo.png" class="img-fluid" />
              </a>
              <div class="links">
                <h4> {t("footer.links")}</h4>
                <ul>
                  <li>
                    <a href="#"> {t("ui_header.home_lable")}</a>
                  </li>
                  <li>
                    <a href="#">{t("ui_header.myApp_guest")}</a>
                  </li>
                  <li>
                    <a href="#">{t("ui_header.find_doctor")}</a>
                  </li>
                  <li>
                    <a href="#">{t("ui_header.clinics_lable")}</a>
                  </li>
                  <li>
                    <a href="#">{t("ui_header.about_us")}</a>
                  </li>
                  <li>
                    <a href="#">{t("ui_header.contact_us")}</a>
                  </li>
                </ul>
              </div>
              <div class="adress">
                <h4>{t("footer.add-head")}</h4>
                <p>
                  {t("footer.add-text")} <br />
                  {t("footer.add-text-cn")}
                </p>
              </div>
              <div class="social-media">
                <a href="#">
                  <img src="/images/whatsapp.png" class="img-fluid" />
                </a>
                <a href="#">
                  <img src="/images/facebook.png" class="img-fluid" />
                </a>
                <a href="#">
                  <img src="/images/instagram.png" class="img-fluid" />
                </a>
                <a href="#">
                  <img src="/images/google.png" class="img-fluid" />
                </a>
                <a href="#">
                  <img src="/images/globe.png" class="img-fluid" />
                </a>
              </div>
              <div class="getapp">
                <h4>{t("footer.get-app")}</h4>
                <div class="download">
                  <a href="#" target="_blank">
                    <img src="/images/applestore.png" class="img-fluid" />
                  </a>
                  <a href="#" target="">
                    <img src="/images/googleplay.png" class="img-fluid" />
                  </a>
                </div>
              </div>
              <div class="newsLetter">
                <h4>{t("footer.subs-newsletter")}</h4>
                <input type="text" placeholder="Enter your email" />
                <button type="submit" class="blue_btn">
                  {t("common.submit")}
                </button>
                <div class="subscheck">
                  <input type="checkbox" />
                  {t("footer.subs-check")}
                </div>
              </div>
            </div>

            <div class="footer_bottom">
              <div class="left">
                <ul>
                  <li>
                    <a href="#">{t("footer.legal-notice")}</a>
                  </li>
                  <li>
                    <a href="#">{t("footer.dmca")}</a>
                  </li>
                  <li>
                    <a href="#">{t("footer.terms-of-service")}</a>
                  </li>
                  <li>
                    <a href="#">{t("footer.cookie-policy")}</a>
                  </li>
                </ul>
              </div>
              <div class="right">
                <p> &copy; 2024 {t("footer.footer-bottom-text")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
