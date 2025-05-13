import React from "react";
import "../../../../components/ui/footer/footer.css";
import { useTranslation } from "react-i18next";
export const Footer = () => {
  const { t } = useTranslation("footer");
  return (
    <footer className="footer2">
      <div className="f-top">
        <img src="../images/footer-h2.webp" />
        <p>H2.doctor is a digital health platform that connects users with independent healthcare professionals for secure remote consultations and advisory services. The platform does not provide medical diagnosis or treatment and is not liable for any medical outcomes resulting from the consultation.</p>
      </div>
      <div class="footer_bottom">
              <div class="left">
                <ul>
                  <li>
                    <a href="#">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Security & Governance</a>
                  </li>
                  <li>
                    <a href="#">Cookie Policy</a>
                  </li>
                </ul>
              </div>
              <div class="right">
                <p> &copy; {t("footer.footer-bottom-text")}</p>
              </div>
            </div>
    </footer>
    // <footer>
    //   <div class="chatting">
    //     <img src="/images/doctor-dashboard/chat-2.svg" />
    //   </div>
    //   <div class="container-fluid">
    //     <div class="row">
    //       <div class="col-md-12">
    //         <div class="footer_data">
    //           <a href="#" class="footer_logo">
    //             sdsf
    //             <img src="/images/logo.png" class="img-fluid" />
    //           </a>
    //           <div class="links">
    //             <h4> {t("footer.links")}</h4>
    //             <ul>
    //               <li>
    //                 <a href="https://www.my-health.today/" target="_blank"> {t("ui_header.home_lable")}</a>
    //               </li>
    //               <li>
    //                 <a href="#">{t("ui_header.myApp_guest")}</a>
    //               </li>
    //               <li>
    //                 <a href="/alldoctors" target="_blank">
    //                   {t("ui_header.find_doctor")}
    //                 </a>
    //               </li>
    //               <li>
    //                 <a href="/allclinics" target="_blank">
    //                   {t("ui_header.clinics_lable")}
    //                 </a>
    //               </li>
    //               <li>
    //                 <a
    //                   href="https://www.my-health.today/"
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                 >
    //                   {t("ui_header.about_us")}
    //                 </a>
    //               </li>
    //               <li>
    //                 <a
    //                   href="https://www.my-health.today/contact"
    //                   target="_blank"
    //                   rel="noopener noreferrer"
    //                 >
    //                   {t("ui_header.contact_us")}
    //                 </a>
    //               </li>
    //             </ul>
    //           </div>
    //           <div class="adress">
    //             <h4>{t("footer.add-head")}</h4>
    //             <p>
    //               {t("footer.add-text")} <br />
    //               {t("footer.add-text-cn")}
    //             </p>
    //           </div>
    //           <div class="social-media">
    //             <a href="#">
    //               <img src="/images/whatsapp.png" class="img-fluid" />
    //             </a>
    //             <a href="#">
    //               <img src="/images/facebook.png" class="img-fluid" />
    //             </a>
    //             <a href="#">
    //               <img src="/images/instagram.png" class="img-fluid" />
    //             </a>
    //             <a href="#">
    //               <img src="/images/google.png" class="img-fluid" />
    //             </a>
    //             <a href="#">
    //               <img src="/images/globe.png" class="img-fluid" />
    //             </a>
    //           </div>
    //           <div class="getapp">
    //             <h4>{t("footer.get-app")}</h4>
    //             <div class="download">
    //               <a href="#" target="">
    //                 <img src="/images/applestore.png" class="img-fluid" />
    //               </a>
    //               <a href="#" target="">
    //                 <img src="/images/googleplay.png" class="img-fluid" />
    //               </a>
    //             </div>
    //           </div>
    //           <div class="newsLetter">
    //             <h4>{t("footer.subs-newsletter")}</h4>
    //             <input type="text" placeholder="Enter your email" />
    //             <button type="submit" class="blue_btn">
    //               {t("common.submit")}
    //             </button>
    //             <div class="subscheck">
    //               <input type="checkbox" />
    //               {t("footer.subs-check")}
    //             </div>
    //           </div>
    //         </div>

    //         <div class="footer_bottom">
    //           <div class="left">
    //             <ul>
    //               <li>
    //                 <a href="#">{t("footer.legal-notice")}</a>
    //               </li>
    //               <li>
    //                 <a href="#">{t("footer.dmca")}</a>
    //               </li>
    //               <li>
    //                 <a href="#">{t("footer.terms-of-service")}</a>
    //               </li>
    //               <li>
    //                 <a href="#">{t("footer.cookie-policy")}</a>
    //               </li>
    //             </ul>
    //           </div>
    //           <div class="right">
    //             <p> &copy; 2024 {t("footer.footer-bottom-text")}</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </footer>
  );
};
