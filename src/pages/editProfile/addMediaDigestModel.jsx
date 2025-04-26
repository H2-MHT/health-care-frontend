import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import InputField from "../../components/form/InputField";
import { showToast } from "../../utils/toast";
import { AddFormData, postData } from "../../hooks/services/services";
import FileUpload from "../../components/form/FileUpload";

function AddMediaDigestModel({ setModelOpenMediaDigest, modelOpenMediaDigest,getMediaDigest }) {
  // Validation Schema
  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  });

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });



  const onSubmit = async (data) => {
    console.log(data, ">>>>>>> Submitted Data");

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("attachment_file", data.attachment_file); // Append file correctly
    
      
      const response = await AddFormData("doctors/media-digest-document/", formData);

      if (response?.status === 201) {
        let responseData = await response.json();
        showToast(responseData?.msg, "success");
        setModelOpenMediaDigest(false);
        getMediaDigest()
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };



  

  return (
    <>
      <Modal
        show={modelOpenMediaDigest}
        backdrop="static"
        keyboard={false}
        onHide={() => setModelOpenMediaDigest(false)}
        size="lg"
        className="familymemb"
      >
        <Modal.Body>
          <div className="modal-content">
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    {/* File Input */}
                    
                    <div
                    className="addFamilyProfile"
                  >
                    <FileUpload
                        name="attachment_file"
                        label="Upload Profile Picture"
                        control={control}
                    />
                  </div>

                    {/* Title Input */}
                    <div className="form-group">
                      <label>Title</label>
                      <InputField type="text" {...register("title")} />
                      <p className="text-danger">{errors.title?.message}</p>
                    </div>

                    {/* Description Input */}
                    <div className="form-group">
                      <label>Description</label>
                      <InputField type="text" {...register("description")} />
                      <p className="text-danger">{errors.description?.message}</p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="d-flex gap-2 justify-content-center mt-5 mb-5">
                      <button type="submit" className="blue_btn">Save changes</button>
                      <button type="button" className="transparent_btn" onClick={() => setModelOpenMediaDigest(false)}>Cancel</button>
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

export default AddMediaDigestModel;







