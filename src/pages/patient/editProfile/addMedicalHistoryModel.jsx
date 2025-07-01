import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/toast";
import { AddFormData, postData } from "../../../hooks/services/services";
import InputField from "../../../components/form/InputField";
import { useTranslation } from "react-i18next";

function AddMedicalHistoryModel({
  setUserMedicalHistoryModel,
  userMedicalHistoryModel,
  getMedicalDocumentsData
}) {

  const today = new Date().toISOString().split("T")[0];
  const { t } = useTranslation("edit-profile");
  
  const schema = Yup.object({
  file_name: Yup.string().required('Name is required'),
  url: Yup.string().required('Url is required'),
  date: Yup.date()
    .transform((value, originalValue) =>
      originalValue === '' ? null : value          // ignore the empty string
    )
    .nullable()                                     // allows the null we just produced
    .max(today, 'Future dates are not allowed')
    .required('Date is required'),
});
 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const date = new Date(data?.date); 
    const formattedDate = date.toISOString().split('T')[0]; 

    try {
        const payload = {
            name: data?.file_name,
            date: formattedDate, 
            document_link: data?.url,
        };
        const response = await postData(
            `patient/upload/medical-document/2/`, payload
        );
        if (response.status == 201) {
            let responseData = await response.json();
            showToast(responseData?.message, "success");
            setUserMedicalHistoryModel(false);
           await getMedicalDocumentsData()
           reset()
        }
    } catch (error) {
        showToast(error.message, "error");
    }
};


  return (
    <>
      <Modal
        show={userMedicalHistoryModel}
        backdrop="static"
        keyboard={false}
        onHide={() => setUserMedicalHistoryModel(false)}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="p-4 bg-white shadow-md rounded-lg w-80">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-4">
                <div className="form-group">
                  <label className="block text-sm font-medium mb-1">
                  {t("edit-profile.file_name")}
                  </label>
                  <InputField
                    type="text"
                    {...register("file_name")}
                    className="w-full p-2 rounded-md mb-4"
                  />
                  <p className="text-danger">{errors.file_name?.message}</p>
                </div>
                <div>
                  <label>{t("edit-profile.url")}</label>
                  <InputField
                    type="text"
                    {...register("url")}
                    className="w-full p-2 rounded-md mb-4"
                  />
                  <p className="text-danger">{errors.url?.message}</p>
                </div>
                <div>
                  <label>{t("wallet.date")}</label>
                  <InputField
                    type="date"
                    {...register("date")}
                    className="w-full p-2 rounded-md mb-4"
                    max={today} 
                  />
                   <p className="text-danger">{errors.date?.message}</p>
                </div>
              </div>

              <button type="submit" className="blue_btn mx-auto mt-4">
                {t("common.save")}
              </button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddMedicalHistoryModel;
