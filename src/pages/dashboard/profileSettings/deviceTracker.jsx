import React, { useEffect , useState} from "react";
import { fetchData } from "../../../hooks/services/services";
import { useTranslation } from "react-i18next";

const DeviceTracker = () => {
  const {t} = useTranslation("device-tracker");
  // useEffect(() => {
  //   const trackDevice = async () => {
  //     const deviceInfo = {
  //       userAgent: navigator.userAgent,
  //       platform: navigator.platform,
  //       screenSize: `${window.screen.width}x${window.screen.height}`,
  //       timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //       uniqueId: localStorage.getItem("deviceToken") || generateDeviceToken(),
  //     };

  //     if (!localStorage.getItem("deviceToken")) {
  //       localStorage.setItem("deviceToken", deviceInfo.uniqueId);
  //     }

  //     try {
  //       // await postData("/api/devices", deviceInfo);
  //       console.log("Device tracked successfully");
  //     } catch (error) {
  //       console.error("Error tracking device:", error);
  //     }
  //   };

  //   trackDevice();
  // }, []);

  // const generateDeviceToken = () => {
  //   return `device-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
  // };

  const [sessions, setActiveSessions] = useState([]);
const [inactivesessions, setInactiveSessions] = useState([]);
const [loadingActive, setLoadingActive] = useState(true);
const [loadingInactive, setLoadingInactive] = useState(true);

const fetchActiveSessions = async () => {
  setLoadingActive(true);
  try {
    const response = await fetchData("user/device-access/?active=True");
    if (!response.ok) throw new Error("Failed to fetch active sessions");

    const data = await response.json();
    setActiveSessions(data);
  } catch (error) {
    console.error("Error fetching active sessions:", error);
  } finally {
    setLoadingActive(false);
  }
};

const fetchInactiveSessions = async () => {
  setLoadingInactive(true);
  try {
    const response = await fetchData("user/device-access/?active=False");

    if (!response.ok) throw new Error("Failed to fetch inactive sessions");

    const data = await response.json();
    
    setInactiveSessions(data);
    console.log("Ya",inactivesessions)
  } catch (error) {
    console.error("Error fetching inactive sessions:", error);
  } finally {
    setLoadingInactive(false);
  }
};

useEffect(() => {
  fetchActiveSessions();
  fetchInactiveSessions();
}, []);



  return (
    <div class="col-md-12">
      <div class="settingBox bg-white border-radius-20 padding-20">
        <h3 class="text-darkgreen mb-5">
          {" "}
          {t("device-tracker.access-history")} :
        </h3>
        <div class="row g-4">
          <div className="col-md-6">
            <p className="mb-3">{t("device-tracker.current")} :</p>
            <div className="recentAct">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <div key={session.id} className="mobileBox border-radius-20">
                    <div className="mobileSide">
                      <img
                        src="../images/doctor-dashboard/mobile.webp"
                        width="40"
                      />
                      <div>
                        <h6>{session.platform}</h6>
                        <p>
                          {session.location_name}{" "}
                          <span>{session.logged_in_time}</span>
                        </p>
                      </div>
                    </div>
                    <a href="#">
                      <img
                        src="../images/doctor-dashboard/shareCircle.webp"
                        width="50"
                      />
                    </a>
                  </div>
                ))
              ) : (
                <p>{t("device-tracker.no-active-session")}</p>
              )}
            </div>
          </div>

          <div class="col-md-6">
            <p class="mb-3">{t("device-tracker.recent")} :</p>
            <div className="recentAct">
              {inactivesessions.length > 0 ? (
                inactivesessions.map((session) => (
                  <div key={session.id} class="mobileBox border-radius-20">
                    <div class="mobileSide">
                      <img
                        src="../images/doctor-dashboard/mobile.webp"
                        width="40"
                      />
                      <div>
                        <h6>{session.platform}</h6>
                        <p>
                          {session.location_name}{" "}
                          <span>{session.logged_in_time}</span>
                        </p>
                      </div>
                    </div>
                    <a href="#">
                      <img
                        src="../images/doctor-dashboard/shareCircle.webp"
                        width="50"
                      />
                    </a>
                  </div>
                ))
              ) : (
                <div>{t("device-tracker.no-activity-found")}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceTracker;
