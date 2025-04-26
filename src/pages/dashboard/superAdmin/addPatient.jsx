import CommonModal from "../../../components/form/Modal";
import { postData } from "../../../hooks/services/services";
import { InputField } from "../../../components/form/InputField";
import { useState } from "react";
import { showToast } from "../../../utils/toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AddPatient({ open, setOpen }) {
  const{t} = useTranslation();
  const navigate = useNavigate();

  const [patientData,setPatientData] = useState({
    first_name:"",
    last_name:"",
    email:"",
    phone_number:""
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const payload = patientData;
        console.log("payload", payload);

        const response = await postData("MasterPanel/patients/",payload);
        if (response?.status === 200) {
          setOpen(false);
          const responseData = await response.json();
          console.log("response: ", responseData);
          showToast(responseData?.status, "success");
          navigate("/superadmin/managepatient");
        }
      } catch (error) {
        showToast(error.message, "error");
      }
  };

  const closeModal = () => {setOpen(false)};

  const addPatientForm = () => {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-md-12 mb-2">
              <div className="form-group">
                <label>{t("singup.first_name")}</label>
                <InputField
                  type="text"
                  name="first_name"
                  placeholder="John"
                  value={patientData.first_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-12 mb-2">
              <div className="form-group">
                <label>{t("singup.Last_name")}</label>
                <InputField
                  type="text"
                  name="last_name"
                  placeholder="Don"
                  value={patientData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-12 mb-2">
              <div className="form-group">
                <label>{t("edit-profile.email-address")}</label>
                <InputField
                  type="email"
                  name="email"
                  placeholder="patient@mail.com"
                  value={patientData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-12 mb-2">
              <div className="form-group">
                <label>{t("edit-profile.phone-number")}</label>
                <InputField
                  type="text"
                  name="phone_number"
                  placeholder="+1234567890"
                  value={patientData.phone_number}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              type="submit"
              className="transparent_btn mt-4 w-full mx-auto"
            >
              {t("superadmin.submit-patient-details")}
            </button>
          </div>
        </form>
      </div>
    );
  };
  return (
    <CommonModal
      size="lg"
      show={open}
      title={"Add Patient Form"}
      body={addPatientForm()}
      onHide={closeModal}
    ></CommonModal>
  );
}
