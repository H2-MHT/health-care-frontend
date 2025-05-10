import { API_URL } from "../hooks/services/apiUrl";
import { generateCodeVerifier, generateCodeChallenge } from "./pkceUtils";
const CLIENT_ID = "23QB7R";
const REDIRECT_URI = "https://h2.doctor/callback";
const SCOPES = "activity heartrate sleep weight profile nutrition";
const TOKEN_URL = "https://api.fitbit.com/oauth2/token";
export async function redirectToFitbitAuth() {
    const codeVerifier = generateCodeVerifier();
    localStorage.setItem("code_verifier", codeVerifier);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const authUrl = `https://www.fitbit.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=${encodeURIComponent(SCOPES)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    const loginWindow = window.open(authUrl, "_blank");
  setTimeout(() => {
    if (loginWindow) {
      loginWindow.close();
    }
  }, 10000);
}
export async function exchangeCodeForTokens(code) {
    const codeVerifier = localStorage.getItem("code_verifier");
    const data = new URLSearchParams({
        client_id: CLIENT_ID,
        code,
        code_verifier: codeVerifier,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI
    });
    try {
        const response = await fetch(TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data
        });
        const result = await response.json();
        if (result.access_token) {
            if (result.access_token) {
                console.log("Fitbit Access Token received:", result.access_token);  // Debug log
                localStorage.setItem("access_token1", result.access_token);  
                localStorage.setItem("refresh_token1", result.refresh_token); 
                localStorage.setItem("user_id1", result.user_id);  
            } else {
                console.error("No access token received", result);
            }  
        }
        return result;
    } catch (error) {
        console.error("Token exchange failed", error);
    }
}
