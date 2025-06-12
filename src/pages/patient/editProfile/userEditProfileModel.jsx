import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/toast";
import { putData } from "../../../hooks/services/services";
import InputField from "../../../components/form/InputField";
import { useTranslation } from "react-i18next";

function UserEditProfileModel({
  setUserEditOpenModel,
  userEditOpenModel,
  editAllergie,
  getAllergiedData,
}) {
  const { t } = useTranslation("edit-profile");
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
    if (editAllergie) {
      reset({
        file_name: editAllergie?.name || "",
        url: editAllergie?.document_link || "",
      });
    }
  }, [editAllergie, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        id: editAllergie?.id,
        name: data?.file_name,
        document_link: data?.url,
      };
      const response = await putData(
        `patient/upload/allergy-document/${editAllergie?.id}/`,
        JSON.stringify(payload)
      );
      if (response.status == 200) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        setUserEditOpenModel(false);
        await getAllergiedData();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <>
      <Modal
        show={userEditOpenModel}
        backdrop="static"
        keyboard={false}
        onHide={() => setUserEditOpenModel(false)}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="p-4 bg-white shadow-md rounded-lg w-80">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
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
                    className="w-full p-2  rounded-md mb-4"
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
                {t("common.save")}
              </button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserEditProfileModel;
