import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AddFormData } from "../../../../hooks/services/services";
import InputField from "../../../../components/form/InputField";
import { showToast } from "../../../../utils/toast";
import FileUpload from "../../../../components/form/FileUpload";
function AddMyVerifcationModel({ setOpenModel, openModel, getLicensesData }) {
  // Validation Schema
   const [previewImage, setPreviewImage] = useState(null);
   const [image,setImage]=useState()
  const schema = Yup.object().shape({
    date: Yup.string().required("date is required"),
    name: Yup.string().required("name is required"),
    description: Yup.string().required("Description is required"),
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
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
      formData.append("attachment",image)
      
      const response = await AddFormData(
        "doctors/licence-certificate/",
        formData
      );
      if (response?.status === 201) {
        let responseData = await response.json();
        showToast(responseData?.msg, "success");
        setOpenModel(false);
        getLicensesData();
        reset();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <>
      <Modal
        show={openModel}
        backdrop="static"
        keyboard={false}
        onHide={() => setOpenModel(false)}
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

                    {/* <div
                    className="addFamilyProfile"
                  >
                    <FileUpload
                        name="attachment_file"
                        label="Upload Profile Picture"
                        control={control}
                    />
                  </div> */}
                    <div className="form-group">
                      <label>Name</label>
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
                      <InputField type="text" {...register("description")} />
                      <p className="text-danger">
                        {errors.description?.message}
                      </p>
                    </div>
                    <div className="form-group">
                      <label>Upload Your Document</label>
                      <InputField
                        type="file"
                        {...register("attachment_file")}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setImage(file)
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
                    {/* Submit Buttons */}
                    <div className="d-flex gap-2 justify-content-center mt-5 mb-5">
                      <button type="submit" className="blue_btn">
                        Save changes
                      </button>
                      <button
                        type="button"
                        className="transparent_btn"
                        onClick={() => setOpenModel(false)}
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

export default AddMyVerifcationModel;
