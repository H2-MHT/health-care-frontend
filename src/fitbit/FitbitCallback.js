import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForTokens } from "./fitbitAuth";

const FitbitCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            exchangeCodeForTokens(code)
              .then(() => {
                if (window.opener) {
                  window.opener.postMessage("fitbit-login-success", "*");
                }
                window.close();
              })
              .catch((error) => {
                console.error("Error during Fitbit token exchange", error);
              });
          }
    }, [navigate]);

    return <div>Processing Fitbit Authentication...</div>;
};

export default FitbitCallback;
