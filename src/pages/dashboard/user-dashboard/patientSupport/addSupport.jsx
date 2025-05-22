import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AddFormData } from "../../../../hooks/services/services";
import InputField from "../../../../components/form/InputField";
import { showToast } from "../../../../utils/toast";
import FileUpload from "../../../../components/form/FileUpload";
const AddSupport = ({ addDoctorModel, setAddDoctorModel,fetchadminList }) => {
  // Validation Schema
  const schema = Yup.object().shape({
    title: Yup.string().required("title is required"),
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
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("attachment", data.attachment_file); // Append file correctly
      const response = await AddFormData("user/support/", formData);
      if (response?.status === 201) {
        let responseData = await response.json();
        showToast(responseData?.msg, "success");
        await fetchadminList()
        setAddDoctorModel(false);
        reset();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <>
      <Modal
        show={addDoctorModel}
        backdrop="static"
        keyboard={false}
        onHide={() => setAddDoctorModel(false)}
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
                        name="attachment_file"
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
                        onClick={() => setAddDoctorModel(false)}
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

export default AddSupport;
