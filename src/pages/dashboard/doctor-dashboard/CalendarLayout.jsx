import React, { useEffect, useState } from "react";
import { Header } from "./header/header";
import { Drawer } from "./aside-drawer/drawer";
import "./dashboard.css";
import { Footer } from "./footer/footer";
import IncomingCall from "./Calls/IncomingCall";
import { ClinicDrawer } from "./aside-drawer/ClinicDrawer";
import { PatientDrawer } from "../../patient/drawer";
import { SuperAdminDrawer } from "../superAdmin/superAdminDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  getDoctorProfileFailure,
  getDoctorProfileRequest,
  getDoctorProfileSuccess,
} from "../../../redux/actions/doctor/getDoctorProfileAction";
import { fetchDataAuth } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../../components/ui/loader/loader";
import { loginSuccess } from "../../../redux/actions/authActions";
import { SuperAdminHeader } from "../superAdmin/superAdminHeader";
import VideoCallNotification from "../doctorChat/notification";
import { onMessageListener } from "../doctorChat/firebase";
import { getDocumentVerificationSuccess } from "../../../redux/actions/doctor/documentVerificationAction";
export const CalendarLayout = ({ children }) => {
  let { user, token } = useSelector((state) => state.auth);
  const [userRole, setUserRole] = useState(user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isVideoActive = localStorage.getItem("isVideoActive")
    ? localStorage.getItem("isVideoActive")
    : false;

  useEffect(() => {
    if (!user) {
      getProfile();
    } else {
      setUserRole(user);
    }
    getLicensesData();
  }, []);

  const [incomingCall, setIncomingCall] = useState();

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        console.log("New Notification Received:", payload);
        console.log("payload.data?.type:", payload.data?.type);
        if (payload.data?.type === "incoming_call") {
          setIncomingCall({
            caller: payload.data.caller,
            ringing: true,
            senderUserId: payload.data.senderUserId,
            receiverUserId: payload.data.receiverUserId,
          });
        }
      })
      .catch((err) => console.error("Failed to receive message", err));
  });

  const getProfile = async () => {
    setLoading(true);
    await getDoctorProfileRequest();
    try {
      const response = await fetchDataAuth("auth/view-profile/", navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setUserRole(getData?.data?.role);
      dispatch(getDoctorProfileSuccess(getData.data));
      dispatch(loginSuccess(getData?.data?.role, token));
    } catch (error) {
      dispatch(getDoctorProfileFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  const getLicensesData = async () => {
    try {
      const response = await fetchDataAuth(
        `doctors/licence-certificate/`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      dispatch(getDocumentVerificationSuccess(getData.data));
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDrawer = () => {
    return (
      <>
        {user === "Doctor" && <Drawer />}
        {user === "Clinic" && <ClinicDrawer />}
        {user === "Patient" && <PatientDrawer />}
        {user === "SuperAdmin" && <SuperAdminDrawer />}
      </>
    );
  };
  return (
    <>
      <main>
        {user === "SuperAdmin" ? <SuperAdminHeader /> : <Header />}
        <section class="main-content">
          <div class="dash-content">
            {loading ? (
              <Loader />
            ) : (
              <>
                {getDrawer()}
                {children}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
      {incomingCall &&
        (isVideoActive === "false" || isVideoActive === false) && (
          <VideoCallNotification
            incomingCall={incomingCall}
            setIncomingCall={setIncomingCall}
          />
        )}
    </>
  );
};
