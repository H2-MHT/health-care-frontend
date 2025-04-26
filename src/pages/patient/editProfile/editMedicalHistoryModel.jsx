import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/toast";
import { AddFormData, putData } from "../../../hooks/services/services";
import InputField from "../../../components/form/InputField";

function EditMedicalHistoryModel({setUserEditHistoryModel, userEditHistoryModel,editMedicalDocument,getMedicalDocumentsData }) {
  const schema = Yup.object().shape({
    file_name: Yup.string().required("Name is required"),
    url: Yup.string().required("Url is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

   useEffect(() => {
      if (editMedicalDocument) {
        reset({
          file_name: editMedicalDocument?.name || "",
          url: editMedicalDocument?.document_link || "",
        });
      }
    }, [editMedicalDocument, reset]);


  const onSubmit = async (data) => {
    try {
      const payload = {
        id: editMedicalDocument?.id,
        name: data?.file_name,
        document_link: data?.url,
      };
      const response = await putData(`patient/upload/medical-document/${editMedicalDocument?.id}/`,JSON.stringify(payload));
      if (response?.status === 200) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        setUserEditHistoryModel(false)
      await getMedicalDocumentsData()
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <>
      <Modal
        show={userEditHistoryModel}
        backdrop="static"
        keyboard={false}
        onHide={() => setUserEditHistoryModel(false)}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="p-4 bg-white shadow-md rounded-lg w-80">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-4">
                <div className="form-group">
                  <label className="block text-sm font-medium mb-1">
                    File name
                  </label>
                  <InputField
                    type="text"
                    {...register("file_name")}
                    className="w-full p-2 border rounded-md mb-4"
                  />
                  <p className="text-danger">{errors.file_name?.message}</p>
                </div>
                <div>
                  <label>URL</label>
                  <InputField
                    type="text"
                    {...register("url")}
                    className="w-full p-2 border rounded-md mb-4"
                  />
                  <p className="text-danger">{errors.url?.message}</p>
                </div>
                {/* <div>
                  <label>description</label>
                  <InputField
                    type="text"
                    {...register("description")}
                    className="w-full p-2 border rounded-md mb-4"
                  />
                </div> */}
              </div>

              <button type="submit" className="blue_btn mx-auto mt-4">
                Save
              </button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditMedicalHistoryModel;
