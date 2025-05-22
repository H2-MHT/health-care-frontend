import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { patchFormData } from "../../../../hooks/services/services";
import InputField from "../../../../components/form/InputField";
import { showToast } from "../../../../utils/toast";
import FileUpload from "../../../../components/form/FileUpload";
import { useEffect } from "react";
const EditSupport = ({
  setEditDoctorModel,
  editDoctorModel,
  editSupportData,
  fetchadminList,
}) => {
  const schema = Yup.object().shape({
    title: Yup.string().required("title is required"),
    description: Yup.string().required("Description is required"),
  });

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

  useEffect(() => {
    if (editSupportData) {
      reset({
        title: editSupportData?.title || "",
        description: editSupportData?.description || "",
        attachment: editSupportData?.attachment || "",
      });
    }
  }, [editSupportData, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (data.attachment?.[0] instanceof File) {
        formData.append("attachment", data.attachment[0]);
      } else {
        console.warn("Invalid attachment:", data.attachment?.[0]);
      }
      const response = await patchFormData(
        `user/support/?ticket_id=${editSupportData?.ticket_id}`,
        formData
      );
      if (response?.status === 200) {
        let responseData = await response.json();
        showToast(responseData?.msg, "success");
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
                    {/* File Input */}

                    <div className="addFamilyProfile">
                      <FileUpload
                        name="attachment"
                        label="Upload Profile Picture"
                        control={control}
                      />
                    </div>
                    <div className="form-group">
                      <label>Title</label>
                      <InputField type="text" {...register("title")} />
                      <p className="text-danger">{errors.title?.message}</p>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <InputField type="text" {...register("description")} />
                      <p className="text-danger">
                        {errors.description?.message}
                      </p>
                    </div>
                    <div className="d-flex gap-2 justify-content-center mt-5 mb-5">
                      <button type="submit" className="blue_btn">
                        Save changes
                      </button>
                      <button
                        type="button"
                        className="transparent_btn"
                        onClick={() => setEditDoctorModel(false)}
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
};

export default EditSupport;
