import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { showToast } from "../../../../utils/toast";
import { AddFormData, postData } from "../../../../hooks/services/services";
import InputField from "../../../../components/form/InputField";
import AddFamilyMemberVerifyCodeModel from "./addFamilyMemberVerifyCodeModel";
import FileUpload from "../../../../components/form/FileUpload";
import { useSelector } from "react-redux";

function AddFamilyMemeberModel({ modelOpen, setModelOpen, getFamilyMemberDetails, setIsFamilyMemberAdded }) {
  const [verifyCodeModel, setVerifyCodeModel] = useState(false);
  const [familyMemeberId,setFamilyMemeberId]=useState(null)
  const schema = Yup.object().shape({
    member_name: Yup.string().required("Name is required"),
    family_status: Yup.string().required("Family status is required"),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("member_name", data.member_name);
      formData.append("family_status", data.family_status);
      formData.append("member_profile", data?.uploadPhoto); 
      const response = await AddFormData("patient/add-family-member/", formData);
      if (response?.status === 201) {
        let responseData = await response.json();
        setFamilyMemeberId(responseData?.family_member)
        showToast(responseData?.message, "success");
        setVerifyCodeModel(true);
        setModelOpen(false);
       await getFamilyMemberDetails()
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <>
      <Modal
        show={modelOpen}
        backdrop="static"
        keyboard={false}
        onHide={() => setModelOpen(false)}
        size="lg"
        className="familymemb"
      >
        <Modal.Header closeButton>
          <div className="modal-heading-alignment">
            <img src="../images/doctor-dashboard/Info.svg" alt="info" />
            <h5 className="modal-title text-left">
              Manage family member details
            </h5>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-content">
            <div className="modal-body">
              <div className="row">
                <div className="col-md-12">
                  {/* <div className="profileImg">
                  <img src="../images/user-dashboard/user.svg" alt="user" />
                  <div className="editDelete">
                    <img src="../../images/edit.svg" alt="edit" />
                    <img src="../../images/delete.svg" alt="delete" />
                  </div>
                </div> */}

                  {/* <div className="addFamilyProfile">
                  <input type="file" />
                  <p>Add +</p>
                </div> */}

                 
                  <form onSubmit={handleSubmit(onSubmit)}>
                  <div
                    className="addFamilyProfile"
                  >
                    <FileUpload
                        name="uploadPhoto"
                        label="Upload Profile Picture"
                        control={control}
                    />
                  </div>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Name</label>
                          <InputField
                            type="text"
                            {...register("member_name")}
                          />
                          <p className="text-danger">
                            {errors.member_name?.message}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Family status</label>
                          <InputField
                            type="text"
                            {...register("family_status")}
                          />
                          <p className="text-danger">
                            {errors.family_status?.message}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>E-Mail (optional)</label>
                          <InputField
                            type="text"
                            {...register("member_email")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="d-flex gap-2 justify-content-center mt-5 mb-5">
                        <button type="submit" className="blue_btn">
                          Save changes
                        </button>
                        <button
                          type="button"
                          className="transparent_btn"
                          onClick={() => setModelOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <AddFamilyMemberVerifyCodeModel
        setVerifyCodeModel={setVerifyCodeModel}
        setIsFamilyMemberAdded={setIsFamilyMemberAdded}
        verifyCodeModel={verifyCodeModel}
        familyMemeberId={familyMemeberId}
      />
    </>
  );
}

export default AddFamilyMemeberModel;
