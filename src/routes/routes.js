import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CalendarLayout } from "../pages/dashboard/doctor-dashboard/CalendarLayout";
import ClinicSignUp from "../pages/clinicSignUp/clinicSignUp";
import Unauthorized from "../pages/unauthorized/unauthorized";
import { SocketProvider } from "../utils/socketContext";
import ClinicEditProfile from "../pages/editProfile/clinicEditProfile";
import ClinicDoctorList from "../pages/dashboard/clinic-dashboard/clinicDoctorList";
import UserCalenderView from "../pages/dashboard/user-dashboard/UserCalenderView";
import UserReviews from "../pages/dashboard/user-dashboard/userReviews";
import UserAppointmentList from "../pages/dashboard/user-dashboard/userAppointmentList";
import ClinicPublicView from "../pages/dashboard/clinic-dashboard/clinicpublicview";
import { Loader, LoaderHome } from "../components/ui/loader/loader";
import PatientProfileSetting from "../pages/dashboard/user-dashboard/patientSetting/patientProfileSetting";
import ClinicSeeUser from "../pages/dashboard/clinic-dashboard/clinicSeeUser";
import DoctorPrescription from "../pages/dashboard/doctorPrescription/doctorPrescription";
import ClinicCalendarView from "../pages/dashboard/clinic-dashboard/clinicCalendarView";
import AllDoctorList from "../pages/dashboard/user-dashboard/bookAppointmenet/allDoctorList";
import AllFavDoctor from "../pages/dashboard/user-dashboard/bookAppointmenet/allFavDoctor";
import PatientSupport from "../pages/dashboard/user-dashboard/patientSupport/patientSupport";
import FavClinicPublicView from "../pages/dashboard/user-dashboard/favClinicPublicView";
import PrescriptionView from "../pages/patient/Prescription/prescriptionView";
import ClinicProfileSetting from "../pages/dashboard/clinic-dashboard/clinicProfileSetting/profileSetting";
import UserDashboard from "../pages/dashboard/user-dashboard/userDashboard";
import AllClinic from "../pages/dashboard/user-dashboard/allClinic";
import AllFavClinic from "../pages/dashboard/user-dashboard/allFavClinic";
import MyVerification from "../pages/dashboard/doctor-dashboard/myVerification/myVerification";
import DoctorSupport from "../pages/dashboard/doctor-dashboard/doctorSupport/doctorSupport";
import ClinicSupport from "../pages/dashboard/clinic-dashboard/clinicSupport/clinicSupport";
import UserView from "../pages/dashboard/user-dashboard/userView";
import FamilyMemberProfileDashboard from "../pages/dashboard/user-dashboard/addFamilyMember/familyMemberProfileDashboard";
import UserHealthDataCenter from "../pages/dashboard/user-dashboard/userhealthdatacenter";
import FitbitCallback from "../fitbit/FitbitCallback";
import { useSelector } from "react-redux";
import SuperAdminDashboard from "../pages/dashboard/superAdmin/superAdminDashboard";
import ManagePatient from "../pages/dashboard/superAdmin/managePatient";
import Specialization from "../pages/dashboard/superAdmin/specialization/specialization";
import ManageDoctors from "../pages/dashboard/superAdmin/manageDoctors";
import ManageClinic from "../pages/dashboard/superAdmin/manageClinic";
import ManageReview from "../pages/dashboard/superAdmin/manageReview";
import ManageReviewAdmin from "../pages/dashboard/superAdmin/manageReviewAdmin/manageReviewAdmin";
import MyDocumentVerification from "../pages/dashboard/superAdmin/myDocumentVerification";
import CreateAdmin from "../pages/dashboard/superAdmin/createAdmin/createAdmin";
import PatientEditProfile from "../pages/patient/editProfile/editProfile";
import VideoCall2 from "../pages/dashboard/doctorChat/VideoCall2";
import PaymentHistory from "../pages/dashboard/user-dashboard/paymentHistory";
import SuperAdminLogin from "../pages/dashboard/superAdmin/superAdminLogin";
import PatientPrescription from "../pages/patient/Prescription/prescription";
import FindDoctor from "../pages/dashboard/doctor-dashboard/find-doctor";
import ConsultationrRecordsList from "../pages/dashboard/doctor-dashboard/consultationReport/consultationrRecordsList";
import PatientConsultationReport from "../pages/dashboard/user-dashboard/patientConsultationReport/patientConsultationReport";
import PatientConsultationrRecordsList from "../pages/dashboard/user-dashboard/patientConsultationReport/patientConsultationrRecordsList";
import ConsultationReport from "../pages/dashboard/doctor-dashboard/consultationReport/consultationReport";
import DoctorView from "../pages/editProfile/doctorView";
const PatientInfo = lazy(() =>
  import("../pages/dashboard/superAdmin/patientInfo")
);
const DoctorInfo = lazy(() =>
  import("../pages/dashboard/superAdmin/doctorInfo")
);
const ClinicInfo = lazy(() =>
  import("../pages/dashboard/superAdmin/clinicInfo")
);
const ManagePayment = lazy(() =>
  import("../pages/dashboard/superAdmin/managePayment")
);

const ClinicDashboard = lazy(() =>
  import("../pages/dashboard/clinic-dashboard/dashboard")
);
const DoctorPublicView = lazy(() =>
  import(
    "../pages/dashboard/clinic-dashboard/doctorPublicView/doctorPublicView"
  )
);
const ConfirmEmail = lazy(() => import("../pages/clinicSignUp/confirmEmail"));
const ClinicSignUpStepTwo = lazy(() =>
  import("../pages/clinicSignUpStep2/clinicSignUpStep2")
);
const RegistrationConfirmation = lazy(() =>
  import("../pages/clinicSignUp/registrationConfirmation")
);
const RegistrationConfirmation2 = lazy(() =>
  import("../pages/clinicSignUp/registrationConfirmation2")
);

const ClinicReviews = lazy(() =>
  import("../pages/dashboard/clinic-dashboard/clinicReviews")
);

const RegistrationConfirmation3 = lazy(() =>
  import("../pages/clinicSignUp/registrationConfirmation3")
);
const Signup = lazy(() => import("../pages/signup/signup"));
const CalendarView = lazy(() =>
  import("../pages/dashboard/doctor-dashboard/CalendarView")
);
const AppointmentList = lazy(() =>
  import("../pages/dashboard/doctor-dashboard/AppointmentList")
);
const VerifyCode = lazy(() => import("../pages/forgotPassword/verifyCode"));
const ResetPassword = lazy(() =>
  import("../pages/forgotPassword/resetPassword")
);
const Stripe = lazy(() =>
  import("../pages/dashboard/doctorWallet/stripe/stripe")
);
const ProfileSetting = lazy(() =>
  import("../pages/dashboard/profileSettings/profileSetting")
);

const CheckoutForm = lazy(() =>
  import("../pages/dashboard/doctorWallet/stripe/checkoutForm")
);
const DoctorChat = lazy(() =>
  import("../pages/dashboard/doctorChat/doctorChat")
);
const CompletePage = lazy(() =>
  import("../pages/dashboard/doctorWallet/stripe/completePage")
);
const ForgotPassword = lazy(() =>
  import("../pages/forgotPassword/forgotPassword")
);
const EditProfile = lazy(() => import("../pages/editProfile/editProfile"));
const PatientPublicView = lazy(() =>
  import("../pages/patient/editProfile/patientPublicView")
);
const Review = lazy(() => import("../pages/dashboard/reviews/reviews"));
const DoctorWallet = lazy(() =>
  import("../pages/dashboard/doctorWallet/doctorWallet")
);
const Login = lazy(() => import("../pages/login/login"));
const Dashboard = lazy(() =>
  import("../pages/dashboard/doctor-dashboard/dashboard")
);
const AllClinicPublic = lazy(() => import("../pages/home/allClinicPublic"));
const AllDoctorPublic = lazy(() => import("../pages/home/allDoctorPublic"));
const PublicClinicView = lazy(() => import("../pages/home/publicClinicView"));
const PublicDoctorView = lazy(() => import("../pages/home/publicDoctorView"));

const AppRoutes = () => {
  let { user, token } = useSelector((state) => state.auth);

  const routeList = [
    {
      path: "/",
      element: <Signup />,
      exact: true,
      layout: false,
      allowedRoles: ["Doctor", "Patient", "Clinic"],
    },
    {
      path: "/login",
      element: <Login />,
      exact: true,
      layout: false,
      allowedRoles: ["Doctor", "Patient", "Clinic"],
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      exact: true,
      layout: true,
      context: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/signup",
      element: <Signup />,
      exact: true,
      layout: false,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
      exact: true,
      layout: false,
      allowedRoles: ["Doctor"],
    },

    {
      path: "/doctor/consultation-recordslist",
      element: <ConsultationrRecordsList />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/doctor/consultation-report/:id",
      element: <ConsultationReport />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/verify-otp",
      element: <VerifyCode />,
      exact: true,
      layout: false,
      allowedRoles: ["Doctor", "Clinic"],
    },
    {
      path: "/forgot-password/verify-code",
      element: <VerifyCode />,
      exact: true,
      layout: false,
      allowedRoles: ["Doctor", "Clinic"],
    },
    {
      path: "/allclinics",
      element: <AllClinicPublic />,
      exact: false,
      layout: false,
    },
    {
      path: "/alldoctors",
      element: <AllDoctorPublic />,
      exact: true,
      layout: false,
    },
    {
      path: "/public-doctor-view",
      element: <PublicDoctorView />,
      exact: true,
      layout: false,
    },
    {
      path: "/public-clinic-view",
      element: <PublicClinicView />,
      exact: true,
      layout: false,
    },
    {
      path: "/clinic/Reviews",
      element: <ClinicReviews />,
      exact: true,
      layout: true,
      allowedRoles: ["Clinic"],
    },
    {
      path: "/clinic/support",
      element: <ClinicSupport />,
      exact: true,
      layout: true,
      allowedRoles: ["Clinic"],
    },

    {
      path: "/clinic/ProfileSetting",
      element: <ClinicProfileSetting />,
      exact: true,
      layout: true,
      allowedRoles: ["Clinic"],
    },
    {
      path: "/patient/calender-view",
      element: <UserCalenderView />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/patient/paymenthistory",
      element: <PaymentHistory />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/prescription-view",
      element: <PrescriptionView />,
      exact: true,
      layout: false,
    },
    {
      path: "/patient/appointment-list",
      element: <UserAppointmentList />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/doctorPublicView", // Accepts an ID in the URL
      element: <DoctorPublicView />,
      exact: true,
      layout: true,
      allowedRoles: ["Clinic"],
    },
    {
      path: "/forgot-password/reset-password",
      element: <ResetPassword />,
      exact: true,
      layout: false,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/doctor/public-view",
      element: <DoctorView />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/doctor/myVerification",
      element: <MyVerification />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/doctor/support",
      element: <DoctorSupport />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/calendar-view",
      element: <CalendarView />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/calender-appointment-list",
      element: <AppointmentList />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/doctor/editprofile",
      element: <EditProfile />,

      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/patient/editprofile",
      element: <PatientEditProfile />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/patient/public-view",
      element: <PatientPublicView />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/videocall",
      element: <VideoCall2 />,
      exact: true,
      layout: true,
      context: true,
      allowedRoles: ["Doctor", "Patient"],
    },
    {
      path: "/review",
      element: <Review />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor", "Clinic"],
    },
    {
      path: "/doctorwallet",
      element: <DoctorWallet />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },

    {
      path: "/stripe",
      element: <Stripe />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/CheckoutForm",
      element: <CheckoutForm />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/CompletePage",
      element: <CompletePage />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/doctorchat",
      element: <DoctorChat />,
      exact: true,
      layout: true,
      context: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/doctor/Profilesetting",
      element: <ProfileSetting />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/clinic-signup",
      element: <ClinicSignUp />,
      exact: true,
      layout: false,
      allowedRoles: ["Clinic", "Doctor"],
    },
    {
      path: "/clinic-signup-step-two",
      element: <ClinicSignUpStepTwo />,
      exact: true,
      layout: false,
      allowedRoles: ["Clinic"],
    },
    {
      path: "/confirm-email",
      element: <ConfirmEmail />,
      exact: true,
      layout: false,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/registration-confirmation",
      element: <RegistrationConfirmation />,
      exact: true,
      layout: false,
      allowedRoles: ["Clinic"],
    },
    {
      path: "/registration-confirmation-2",
      element: <RegistrationConfirmation2 />,
      exact: true,
      layout: false,
      allowedRoles: ["Clinic"],
    },
    {
      path: "/registration-confirmation-3",
      element: <RegistrationConfirmation3 />,
      exact: true,
      layout: false,
      allowedRoles: ["Clinic"],
    },
    {
      path: "/clinic-dashboard/dashboard",
      element: <ClinicDashboard />,
      exact: true,
      layout: true,
      allowedRoles: ["Clinic"],
    },
    {
      path: "/unauthorized",
      element: <Unauthorized />,
      exact: true,
      layout: false,
      allowedRoles: ["Doctor", "Patient", "Clinic"],
    },
    {
      path: "/Patient/reviews",
      element: <UserReviews />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/patient/consultationreport/:id",
      element: <PatientConsultationReport />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/patient/support",
      element: <PatientSupport />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/patient/consultationrecordsList",
      element: <PatientConsultationrRecordsList />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/patient/family-member-profile",
      element: <FamilyMemberProfileDashboard />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/patient/FavClinicPublicView",
      element: <FavClinicPublicView />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/patient/profileSetting",
      element: <PatientProfileSetting />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/patient/allDoctorlist",
      element: <AllDoctorList />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/patient/FavDoctor",
      element: <AllFavDoctor />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/clinic-edit-profile",
      element: <ClinicEditProfile />,
      exact: true,
      layout: true,
      allowedRoles: ["Clinic"],
    },
    {
      path: "/clinicDoctorList",
      element: <ClinicDoctorList />,
      exact: true,
      layout: true,
      allowedRoles: ["Clinic", "Doctor"],
    },
    {
      path: "/clinicpublicview/:id",
      element: <ClinicPublicView />,
      exact: true,
      layout: true,
      allowedRoles: ["Clinic", "Doctor"],
    },
    {
      path: "/clinicSeeUser",
      element: <ClinicSeeUser />,
      exact: true,
      layout: true,
      allowedRoles: ["Clinic", "Doctor"],
    },
    {
      path: "/doctorprescription",
      element: <DoctorPrescription />,
      exact: true,
      layout: true,
      allowedRoles: ["Doctor"],
    },
    {
      path: "/clinic/calendar-view",
      element: <ClinicCalendarView />,
      exact: true,
      layout: true,
      allowedRoles: ["Clinic"],
    },
    {
      path: "/clinic/doctorInfo",
      element: <ClinicCalendarView />,
      exact: true,
      layout: true,
      allowedRoles: ["Clinic"],
    },
    {
      path: "/patient/dashboard",
      element: <UserDashboard />,
      exact: true,
      layout: true,
      allowedRoles: ["Patient"],
    },
    {
      path: "/patient/allcliniclist",
      element: <AllClinic />,
      exact: true,
      layout: true,
    },
    {
      path: "/patient/FavClinic",
      element: <AllFavClinic />,
      exact: true,
      layout: true,
    },
    {
      path: "/patient/userview/:id",
      element: <UserView />,
      exact: true,
      layout: true,
    },
    {
      path: "/patient/healthdatacenter",
      element: <UserHealthDataCenter />,
      exact: true,
      layout: true,
    },
    {
      path: "/callback",
      element: <FitbitCallback />,
      exact: true,
      layout: false,
    },
    {
      path: "/superadmin/login",
      element: <SuperAdminLogin />,
      exact: true,
      layout: false,
      allowedRoles: ["SuperAdmin"],
    },
    {
      path: "/superadmin/dashboard",
      element: <SuperAdminDashboard />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/managepatient",
      element: <ManagePatient />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/specialization",

      element: <Specialization />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/manage/review",
      element: <ManageReviewAdmin />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/create/admin",
      element: <CreateAdmin />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/managedoctor",
      element: <ManageDoctors />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/manageclinic",
      element: <ManageClinic />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/document/verification",
      element: <MyDocumentVerification />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/patient-info/:id",
      element: <PatientInfo />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/doctor-info/:id",
      element: <DoctorInfo />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/clinic-info/:id",
      element: <ClinicInfo />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/managepayment",
      element: <ManagePayment />,
      exact: true,
      layout: true,
    },
    {
      path: "/superadmin/managereview",
      element: <ManageReview />,
      exact: true,
      layout: true,
    },
    {
      path: "/prescription-list",
      element: <PatientPrescription />,
      exact: true,
      layout: true,
    },
    {
      path: "/finddoctor",
      element: <FindDoctor />,
      exact: true,
      layout: true,
    },
  ];

  return (
    <Suspense fallback={<LoaderHome />}>
      <SocketProvider>
        <Router>
          <Routes>
            {routeList?.map(({ path, element, layout, allowedRoles }) => {
              const isUnauthorized =
                token && (!user || !allowedRoles?.includes(user));

              return (
                <Route
                  key={path}
                  path={path}
                  element={
                    isUnauthorized ? (
                      <Navigate to="/unauthorized" replace />
                    ) : layout ? (
                      <CalendarLayout>{element}</CalendarLayout>
                    ) : (
                      element
                    )
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </SocketProvider>
    </Suspense>
  );
};

export default AppRoutes;
