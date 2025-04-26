import { useEffect, useState } from "react";
import CommonModal from "../../../components/form/Modal";
import { InputField } from "../../../components/form/InputField";
import { postData, fetchData, putData } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// import { jsPDF } from "jspdf";

const PrescriptionForm = ({
  open,
  setOpen,
  patientDetailsObject,
  functionType,
}) => {
  const{t} = useTranslation("prescription");
  const navigate = useNavigate();
  const [prescriptionData, setPrescriptionData] = useState();
  const [prescription, setPrescription] = useState({
    diagnosis: "",
    notes: "",
    medicines: [
      {
        name: "",
        description: "",
        quantity: "",
        time: "",
        times_per_day: "",
        duration: "",
      },
    ],
  });


  useEffect(() => {
      populateForm();
  }, [patientDetailsObject])

  const populateForm = async () => {
    const url = `consultation/prescription/?appointment_id=${patientDetailsObject.appointment_id}`;
    try {
      const response = await fetchData(url, navigate);
      if (!response.ok) throw new Error("Error Fetching Prescription Data");
      const getData = await response.json();
      console.log(getData);
      const getPrescriptionData = getData.prescriptions[0];
      setPrescriptionData(getData.prescriptions)
      setPrescription({ diagnosis: getPrescriptionData.diagnosis, notes: getPrescriptionData.notes, medicines: getPrescriptionData.medicines });
    } catch (error) {
      console.error("Error Fetching Prescription Data ", error);
    }
  };

  const handleChange = (e, index = null, field = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedMedicines = [...prescription.medicines];
      updatedMedicines[index][field] = value;
      setPrescription({ ...prescription, medicines: updatedMedicines });
    } else {
      setPrescription({ ...prescription, [name]: value });
    }
  };

  const addMedicine = () => {
    setPrescription({
      ...prescription,
      medicines: [
        ...prescription.medicines,
        {
          name: "",
          description: "",
          quantity: "",
          time: "",
          times_per_day: "",
          duration: "",
        },
      ],
    });
  };

  const closeModal = () => {
    setOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
     
    if (prescription?.medicines?.length === 0) {
      showToast("Please add at least one medicine before submitting the prescription.", "error");
      return;
    }
    const isInvalidMedicine = prescription.medicines.some((medicine) =>
      !medicine.name ||
      !medicine.description ||
      !medicine.quantity ||
      !medicine.time ||
      !medicine.times_per_day ||
      !medicine.duration
    );
    if (!prescription.diagnosis || !prescription.notes || isInvalidMedicine) {

      showToast("Please fill out all required fields for the diagnosis and medicines.", "error");
      return;
    }
    try {
      const payload = {
        appointment_id: patientDetailsObject.appointment_id,
        ...prescription,
        recipient_email: patientDetailsObject.email,
      };
      if (prescriptionData && prescriptionData?.length) {
        const response = await putData(
          `consultation/prescription/?appointment_id=${patientDetailsObject.appointment_id}`,
          JSON.stringify(payload)
        );
        if (response?.status === 200) {
          setOpen(false);
          const responseData = await response.json();
          showToast("Prescription updated successfully", "success");
          navigate("/doctorprescription");
        }
      }else{
        const response = await postData("consultation/prescription/", payload);
        if (response?.status === 201) {
          setOpen(false);
          const responseData = await response.json();
          showToast(responseData.message, "success");
          navigate("/doctorprescription");
        }
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const handleDeleteMedicine = (id) => {
    const medicineArray = prescription.medicines;
    // console.log(medicineArray);
    const newMedicines = medicineArray.filter((med, idx) => idx !== id);
    // console.log(newMedicines);
    setPrescription({ ...prescription, medicines: newMedicines });
  };

  const getPrescriptionForm = () => {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-lg">
        {/* <h2 className="text-xl font-bold mb-4">Prescription Form</h2>
          <input placeholder="Patient Name" name="patientName" value={prescription.patientName} onChange={handleChange} className="mb-2" />
          <input placeholder="Age" name="age" value={prescription.age} onChange={handleChange} className="mb-2" />
          <input placeholder="Diagnosis" name="diagnosis" value={prescription.diagnosis} onChange={handleChange} className="mb-2" />
        <h3 className="font-semibold">Diagnosis</h3> */}
        <form onSubmit={handleSubmit}>
          <div className="col-md-12 mb-2">
            <div className="form-group">
              <label>{t("prescription.diagnosis")}</label>
              <InputField
                type="text"
                name="diagnosis"
                placeholder="Eg- Bird Flu"
                value={prescription.diagnosis}
                onChange={handleChange}
              />
            </div>
          </div>
          <hr />
          {prescription.medicines.map((med, index) => (
            <div key={index} className="row g-2">
              <div className="d-flex flex-row justify-content-between">
                <h5>{`${index + 1}. ${t("prescription.medicine")}`}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => handleDeleteMedicine(index)}
                ></button>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>{t("prescription.name")}</label>
                  <InputField
                    type="text"
                    name="name"
                    placeholder="Name of the Medicine"
                    value={med.name}
                    onChange={(e) => handleChange(e, index, "name")}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>{t("add-education.description")}</label>
                  <InputField
                    type="text"
                    name="description"
                    placeholder="Eg- Pain Relieving Medicine"
                    value={med.description}
                    onChange={(e) => handleChange(e, index, "description")}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>{t("prescription.quantity")}</label>
                  <InputField
                    type="text"
                    name="quantity"
                    placeholder="10mg"
                    value={med.quantity}
                    onChange={(e) => handleChange(e, index, "quantity")}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>{t("prescription.time-of-the-day")}</label>
                  <InputField
                    type="text"
                    name="time"
                    placeholder="Morning, Night"
                    value={med.time}
                    onChange={(e) => handleChange(e, index, "time")}
                  />
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="form-group">
                  <label>{t("prescription.times")}</label>
                  <InputField
                    type="text"
                    name="times_per_day"
                    placeholder="2"
                    value={med.times_per_day}
                    onChange={(e) => handleChange(e, index, "times_per_day")}
                  />
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="form-group">
                  <label>{t("prescription.duration")}</label>
                  <InputField
                    type="text"
                    name="duration"
                    placeholder="5 days"
                    value={med.duration}
                    onChange={(e) => handleChange(e, index, "duration")}
                  />
                </div>
              </div>
              <hr />
              {/* <input placeholder="Name" value={med.name} onChange={(e) => handleChange(e, index, "name")} />
              <input placeholder="Dosage" value={med.dosage} onChange={(e) => handleChange(e, index, "dosage")} />
              <input placeholder="Frequency" value={med.frequency} onChange={(e) => handleChange(e, index, "frequency")} /> */}
            </div>
          ))}
          <button
            onClick={addMedicine}
            type="button"
            className="transparent_btn mb-3"
          >
            {t("prescription.add-medicine")}
          </button>
          <div className="col-md-12 mb-4">
            <div className="form-group">
              <label>{t("prescription.additional-instruction")}</label>
              <InputField
                type="text"
                placeholder="Additional Instructions"
                name="notes"
                value={prescription.notes}
                onChange={handleChange}
                className="mt-4"
              />
            </div>
          </div>
          {/* <input
        type="text"
          placeholder="Additional Instructions"
          name="notes"
          value={prescription.notes}
          onChange={handleChange}
          className="mt-4"
        /> */}

          <button type="submit" className="transparent_btn mt-4 w-full mx-auto">
            {t("common.save")}
          </button>
        </form>
      </div>
    );
  };

  // const generatePDF = () => {
  //   const doc = new jsPDF();
  //   doc.text(`Patient: ${prescription.patientName} (Age: ${prescription.age})`, 10, 10);
  //   doc.text(`Diagnosis: ${prescription.diagnosis}`, 10, 20);
  //   doc.text("Medicines:", 10, 30);
  //   prescription.medicines.forEach((med, index) => {
  //     doc.text(`${index + 1}. ${med.name} - ${med.dosage} - ${med.frequency}`, 10, 40 + index * 10);
  //   });
  //   doc.text(`Instructions: ${prescription.notes}`, 10, 60);
  //   doc.save("prescription.pdf");
  // };

  return (
    <CommonModal
      size="xl"
      show={open}
      title={t("prescription.add-prescription")}
      body={getPrescriptionForm()}
      onHide={closeModal}
      className="prescriptionModal"
    ></CommonModal>
  );
};

export default PrescriptionForm;
