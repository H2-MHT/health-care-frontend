
import { showToast } from "../utils/toast";
export async function getFitbitData(endpoint) {
    let accessToken = localStorage.getItem("access_token1");
    let refreshAccessToken = localStorage.getItem("refresh-token1");
    if (!accessToken) {
        console.error("No access token found. User might need to log in.");
       // showToast("Fitbit access token not found.");
        return null;
    }
    try {
        const response = await fetch(`https://api.fitbit.com/1/user/-/${endpoint}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (response.status === 401) {
            console.log("Access token expired. Trying to refresh...");
            const result = await refreshAccessToken(); 

            if (result && result.access_token) {
                accessToken = result.access_token; 
                const retryResponse = await fetch(`https://api.fitbit.com/1/user/-/${endpoint}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                return await retryResponse.json();
            } else {
            //    showToast("Failed to refresh access token");
                console.error("Failed to refresh access token");
                return null;
            }
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching Fitbit data", error);
        showToast("Error fetching Fitbit data");
        return null;
    }
}
