import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForTokens } from "./fitbitAuth";

const FitbitCallback = () => {
  const navigate = useNavigate();
  console.log(">>>>>>>>>>>>>>>>FitbitCallback");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log(">>>>>>>>>>>>>>ifffffff");

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log(">>>>>>>>>>>>>>>jjjjj", code);
    if (code) {
      console.log(">>>>>>>>>>>>>>ifffffff");
      exchangeCodeForTokens(code)
        .then((result) => {
          if (window.opener) {
            window.opener.postMessage(
              { type: "fitbit-login-success", payload: result },
              "*"
            );
          }
          window.close();
        })
        .catch((error) => {
          console.error("Error during Fitbit token exchange", error);
        });
    }
  }, []);

  return <div>Processing Fitbit Authentication...</div>;
};

export default FitbitCallback;
