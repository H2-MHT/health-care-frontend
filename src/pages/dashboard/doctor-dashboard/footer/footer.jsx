import React from "react";
import "../../../../components/ui/footer/footer.css";
import { useTranslation } from "react-i18next";
export const Footer = () => {
  const { t } = useTranslation("footer");
  return (
    <footer className="footer2">
      <div className="f-top">
        <img src="../../images/footer-h2.webp" />
        <p>{t("footer.footer-text")}</p>
      </div>
      <div class="footer_bottom">
              <div class="left">
                <ul>
                  <li>
                    <a href="https://docs.google.com/document/d/10X5XkhP2UbxmypMGE_k_6QQ3eAbmwcf8oCEFgXxXqqI/edit?tab=t.0#heading=h.2jn0uzy88ng1" target="_blank">{t("footer.terms-conditions")}</a>
                  </li>
                  <li>
                    <a href="https://docs.google.com/document/d/1IbM9g2H9YG1Gv2MV3kj8NJDnaHuxerl_zCe5UHePEN4/edit?tab=t.0#heading=h.smutkzy4vci4" target="_blank">{t("footer.privacy-policy")}</a>
                  </li>
                  <li>
                    <a href="https://docs.google.com/document/d/1DjXb9P8Olm4aEYxUx9V_MyCCsrc1YgVBJntdclQhM6g/edit?tab=t.0&urp=gmail_link#heading=h.uywpnfb2ft8w" target="blank">{t("footer.security-governance")}</a>
                  </li>
                  <li>
                    <a href="https://docs.google.com/document/d/1jP9QQBZDUSxHipS7BIeB5oZyoFv8HPpxHBqHZJ0vIvs/edit?tab=t.0" target="blank">{t("footer.cookie-policy")}</a>
                  </li>
                </ul>
              </div>
              <div class="right">
                <p> &copy; {t("footer.footer-bottom-text")}</p>
              </div>
            </div>
    </footer>

  );
};
