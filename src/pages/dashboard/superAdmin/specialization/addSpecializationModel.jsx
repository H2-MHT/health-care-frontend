import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { postData } from "../../../../hooks/services/services";
import { showToast } from "../../../../utils/toast";
import InputField from "../../../../components/form/InputField";
import { useTranslation } from "react-i18next";  


function AddSpecializationModel({
  setShowModal,
  showModal,
  getspecializationList
}) {
const {t} = useTranslation();
  const today = new Date().toISOString().split("T")[0];

  const schema = Yup.object().shape({
    name: Yup.string().required("name is required"),
    description: Yup.string().required("description is required"),
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

    try {
        const payload = {
          name: data?.name,
            description: data?.description,
        };
        const response = await postData(
            `MasterPanel/specialization/`, payload
        );
        if (response.status == 201) {
            let responseData = await response.json();
            showToast(responseData?.message, "success");
            setShowModal(false);
           await getspecializationList()
           reset()
        }
    } catch (error) {
        showToast(error.message, "error");
    }
};


  return (
    <>
      <Modal
        show={showModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="p-4 bg-white shadow-md rounded-lg w-80">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-4">
                <div className="form-group">
                  <label className="block text-sm font-medium mb-1">
                    {t("prescription.name")}
                  </label>
                  <InputField
                    type="text"
                    {...register("name")}
                    className="w-full rounded-md mb-4"
                  />
                  <p className="text-danger">{errors.name?.message}</p>
                </div>
                <div>
                  <label>{t("add-education.description")}</label>
                  <InputField
                    type="text"
                    {...register("description")}
                    className="w-full rounded-md mb-4"
                  />
                  <p className="text-danger">{errors.description?.message}</p>
                </div>
              </div>
              <div className="gap-2 justify-content-center d-flex w-auto mx-auto">
                <button type="submit" className="blue_btn ">
                  {t("common.save")}
                </button>
                <button
                  type="button"
                  className="blue_btn"
                  onClick={() => setShowModal(false)}
                >
                  {t("common.cancel")}
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddSpecializationModel;
