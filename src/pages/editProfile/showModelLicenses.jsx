import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import InputField from "../../components/form/InputField";
import { showToast } from "../../utils/toast";
import { AddFormData, postData } from "../../hooks/services/services";
import { useTranslation } from "react-i18next";
import TextArea from "../../components/form/TextArea";

function ShowModelLicenses({
  setShowModelLicenses,
  showModelLicenses,
  getLicensesData,
}) {
  // Validation Schema
  const schema = Yup.object().shape({
    date: Yup.string().required("date is required"),
    name: Yup.string().required("name is required"),
    description: Yup.string().required("Description is required"),
    attachment_file: Yup.mixed().required("Document is required"),
  });
  const [previewImage, setPreviewImage] = useState(null);
  const { t } = useTranslation();
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("date", data.date);
      formData.append("description", data.description);
      if (data.attachment_file?.length > 0) {
        formData.append("attachment", data.attachment_file[0]);
      }

      const response = await AddFormData(
        "doctors/licence-certificate/",
        formData
      );

      if (response?.status === 201) {
        let responseData = await response.json();
        showToast(responseData?.msg, "success");
        setShowModelLicenses(false);
        await getLicensesData();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <>
      <Modal
        show={showModelLicenses}
        backdrop="static"
        keyboard={false}
        onHide={() => setShowModelLicenses(false)}
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
                    {/* File Input */}

                    {/* <div className="addFamilyProfile">
                      <FileUpload
                        name="attachment_file"
                        label="Upload Profile Picture"
                        control={control}
                      />
                    </div> */}
                    <div className="form-group">
                      <label>Name </label>
                      <InputField type="text" {...register("name")} />
                      <p className="text-danger">{errors.name?.message}</p>
                    </div>
                    {/* Title Input */}
                    <div className="form-group">
                      <label>Date</label>
                      <InputField type="date" {...register("date")} />
                      <p className="text-danger">{errors.date?.message}</p>
                    </div>

                    {/* Description Input */}
                    <div className="form-group">
                      <label>Description</label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <TextArea {...field} />}
                      />
                      <p className="text-danger">
                        {errors.description?.message}
                      </p>
                    </div>

                    <div className="form-group">
                      <label>{t("support.your-document")}</label>
                      <Controller
                        name="attachment_file"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const fileList = e.target.files;
                              field.onChange(fileList);
                              const file = fileList?.[0];
                              if (file) {
                                setPreviewImage(URL.createObjectURL(file));
                              }
                            }}
                          />
                        )}
                      />
                      <p className="text-danger">
                        {errors.attachment_file?.message}
                      </p>
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

                    {/* Submit Buttons */}
                    <div className="d-flex gap-2 justify-content-center mt-5 mb-5">
                      <button type="submit" className="blue_btn">
                        Save changes
                      </button>
                      <button
                        type="button"
                        className="transparent_btn"
                        onClick={() => setShowModelLicenses(false)}
                      >
                        Cancel
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
}

export default ShowModelLicenses;
