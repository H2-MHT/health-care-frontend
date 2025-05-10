import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { putData } from "../../../../hooks/services/services";
import { showToast } from "../../../../utils/toast";
import InputField from "../../../../components/form/InputField";
import { useTranslation } from "react-i18next";

function EditSpecializationModel({
  setShowEditModal,
  showEditModal,
  getspecializationList,
  editDetails,
}) {
  const {t} = useTranslation();
  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
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
    if (editDetails) {
      reset({
        name: editDetails?.name || "",
        description: editDetails?.description || "",
      });
    }
  }, [editDetails, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        description: data?.description,
        specialization_id: editDetails?.id,
      };
      const response = await putData(
        "MasterPanel/specialization/",
        JSON.stringify(payload)
      );

      if (response.status === 200) {
        const responseData = await response.json();
        showToast(responseData?.message, "success");
        setShowEditModal(false);
        await getspecializationList();
        reset();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <Modal
      show={showEditModal}
      backdrop="static"
      keyboard={false}
      onHide={() => setShowEditModal(false)}
      size="lg"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="p-4 bg-white shadow-md rounded-lg w-80">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-4">
              <div className="form-group">
                <label>{t("prescription.name")}</label>
                <InputField
                  type="text"
                  {...register("name")}
                  className="w-full p-2 border rounded-md mb-4"
                />
                <p className="text-danger">{errors.name?.message}</p>
              </div>
              <div className="form-group">
                <label>{t("add-education.description")}</label>
                <InputField
                  type="text"
                  {...register("description")}
                  className="w-full p-2 border rounded-md mb-4"
                />
                <p className="text-danger">{errors.description?.message}</p>
              </div>
            </div>
            <div className="gap-2 justify-content-center d-flex w-auto mx-auto">
              <button type="submit" className="blue_btn">
                {t("common.save")}
              </button>
              <button
                type="button"
                className="blue_btn"
                onClick={() => setShowEditModal(false)}
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default EditSpecializationModel;
