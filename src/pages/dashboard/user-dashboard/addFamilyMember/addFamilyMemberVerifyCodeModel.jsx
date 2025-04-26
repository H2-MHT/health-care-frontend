import React from "react";
import { Modal } from "react-bootstrap";
import InputField from "../../../../components/form/InputField";
import Image from "../../../../components/form/Image";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { postData } from "../../../../hooks/services/services";
import { showToast } from "../../../../utils/toast";
import { useSelector } from "react-redux";


function AddFamilyMemberVerifyCodeModel({
  setVerifyCodeModel,
  setIsFamilyMemberAdded,
  verifyCodeModel,
  familyMemeberId
}) {
  const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  const schema = Yup.object().shape({
    verifyCode: Yup.string().required("Field is required"),
  });


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        otp: data.verifyCode,
        family_member_id:familyMemeberId?.id
      };
      const response = await postData("patient/verify-family-member/", payload); // Call the API service
      if (response.status == 200) {
        let responseData = await response.json();
        localStorage.setItem("user_token", responseData?.access_token);
        showToast(responseData?.message, "success");
        setVerifyCodeModel(false)
        setIsFamilyMemberAdded(true)
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <Modal
      show={verifyCodeModel}
      backdrop="static"
      keyboard={false}
      onHide={() => setVerifyCodeModel(false)}
      size="lg"
    >
      <Modal.Header closeButton>
        <div className="modal-heading-alignment">
          <img src="../images/doctor-dashboard/Info.svg" alt="info" />
          <h5 className="modal-title text-left">Add family member details</h5>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="signupTab">
                <div class="formArea border-radius-20 border-gray">
                  <a href="login.html" class="back">
                    <Image src="/images/backarrow.png" /> Back
                  </a>
                  <h5 class="form-head mt-4 mb-4">
                    Confirm new family member{" "}
                  </h5>
                  <p class="text-center mb-4">
                    We've sent a code to <span class="blue_txt">{isProfiledata?.email}</span>
                  </p>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="row g-4">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>Verification code:</label>
                          <InputField
                            type="text"
                            register={register}
                            name="verifyCode"
                            error={errors?.verifyCode?.message}
                          />
                        </div>
                      </div>
                      <div class="col-md-12">
                        <button type="submit" class="black_btn">
                          Submit
                        </button>
                      </div>

                      <div class="co-md-12">
                        <a
                          href="#"
                          class="forgot text_decor"
                          // onClick={resendOTP}
                        >
                          Send Again
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddFamilyMemberVerifyCodeModel;
