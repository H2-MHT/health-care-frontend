import { postData } from "../hooks/services/services";
const detectDeviceName = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();
  if (userAgent.includes("iphone")) return "Apple iPhone";
  if (userAgent.includes("ipad")) return "Apple iPad";
  if (userAgent.includes("android")) {
    let match = userAgent.match(/android\s([\d.]+);?\s([a-zA-Z0-9\s-]+)\sbuild/);
    return match ? `${match[2]} Android Device` : "Android Device";
  }
  if (platform.includes("win32") || platform.includes("win64")) return "Windows Device";
  if (platform.includes("mac")) return "Mac Device";
  if (platform.includes("linux")) return "Linux Device";
  return "Unknown Device";
};
const generateDeviceFingerprint = (userId) => {
  const fingerprint = `${userId}-${navigator.userAgent}-${navigator.platform}-${window.screen.width}x${window.screen.height}`;
  return btoa(fingerprint); // Base64 encode the fingerprint
};
export const trackDeviceAccess = async (userId) => {
  try {
    console.log("trackDeviceAccess function called");
    let accessToken = localStorage.getItem("user_token");
    if (!accessToken) {
      console.error("User is not logged in.");
      return;
    }
    const deviceFingerprint = generateDeviceFingerprint(userId);
    console.log("Generated Device Fingerprint:", deviceFingerprint);
    
   // Prevent duplicate session entry in the same browser
    if (localStorage.getItem("device_fingerprint") === deviceFingerprint) {
      console.log("⚠ Session already recorded in this browser. Skipping duplicate entry.");
      return;
    }

    let location = "Unknown";
    let ipAddress = "Unknown";
    const deviceName = detectDeviceName();
    try {
      const geoResponse = await fetch("https://ipapi.co/json/");
      const geoData = await geoResponse.json();
      location = `${geoData.city}, ${geoData.country_name}`;
      ipAddress = geoData.ip;
    } catch (error) {
      console.warn("⚠ Could not detect location:", error);
    }

    const payload = {
      user: userId,
      location_name: location,
      ip_address: ipAddress,
      logged_in_time: "10:30:00",
      platform: deviceName,
      active_sessions: true,
    };

    console.log("Device Payload:", payload);

    const response = await postData("user/device-access/", payload);
    console.log("Device Access Response:", response);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
 //   localStorage.setItem("device_fingerprint", deviceFingerprint); // Store fingerprint to prevent duplicates
    localStorage.setItem("session_id", responseData?.id);
    console.log("✅ Device access recorded successfully:", responseData);
  } catch (error) {
    console.error("❌ Error tracking device access:", error);
  }
};

