import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { patchFormData, updateData } from "../../../../hooks/services/services";
import InputField from "../../../../components/form/InputField";
import { showToast } from "../../../../utils/toast";
import FileUpload from "../../../../components/form/FileUpload";
import { useEffect, useState } from "react";
const EditSupport = ({
  setEditDoctorModel,
  editDoctorModel,
  editSupportData,
  fetchadminList,
}) => {
  const { t } = useTranslation();

  const schema = Yup.object().shape({
    title: Yup.string().required("title is required"),
    description: Yup.string().required("Description is required"),
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (editSupportData) {
      reset({
        title: editSupportData?.title || "",
        description: editSupportData?.description || "",
        attachment: editSupportData?.attachment || "",
      });
      if (editSupportData?.attachment) {
        setPreviewImage(editSupportData?.attachment); // must be a full URL
        setSelectedImage(editSupportData?.attachment);
      }
    }
  }, [editSupportData, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("attachment", selectedImage);
      const response = await patchFormData(
        `user/support/?ticket_id=${editSupportData?.ticket_id}`,
        formData
      );
      if (response?.status === 200) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        await fetchadminList();
        setEditDoctorModel(false);
        reset();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <>
      <Modal
        show={editDoctorModel}
        backdrop="static"
        keyboard={false}
        onHide={() => setEditDoctorModel(false)}
        size="lg"
        className="familymemb"
      >
        <Modal.Body>
          <div className="modal-content">
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    encType="multipart/form-data"
                  >
                    <div className="form-group">
                      <label>{t("support.support-title")}</label>
                      <InputField type="text" {...register("title")} />
                      <p className="text-danger">{errors.title?.message}</p>
                    </div>
                    <div className="form-group">
                      <label>{t("add-education.description")}</label>
                      <InputField type="text" {...register("description")} />
                      <p className="text-danger">
                        {errors.description?.message}
                      </p>
                    </div>
                    <div className="form-group">
                      <label>{t("support.your-document")}</label>
                      <InputField
                        type="file"
                        {...register("attachment_file")}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setSelectedImage(file);
                            setPreviewImage(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                    {previewImage && (
                      <div className="form-group mt-3">
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{
                            maxWidth: "200px",
                            maxHeight: "200px",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                            padding: "5px",
                          }}
                        />
                      </div>
                    )}
                    <div className="d-flex gap-2 justify-content-center mt-5 mb-5">
                      <button type="submit" className="blue_btn">
                        {t("common.save-changes")}
                      </button>
                      <button
                        type="button"
                        className="transparent_btn"
                        onClick={() => setEditDoctorModel(false)}
                      >
                        {t("common.cancel")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditSupport;
