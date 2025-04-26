import React from "react";
import { showToast } from "../../../utils/toast";
import { postData } from "../../../hooks/services/services";



function membershipPlanPop({ setModelOpen, modelOpen, Modal, formData }) {
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        membership_type: formData?.selectedPlan,
      };
      const response = await postData("doctors/select-membership/", payload);

      if (response?.status === 201) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        setModelOpen(false);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <Modal
      show={modelOpen}
      backdrop="static"
      keyboard={false}
      onHide={() => setModelOpen(false)}
      size="lg"
    >
      <Modal.Header closeButton>
        <div class="modal-heading-alignment">
          <img src="../images/doctor-dashboard/Info.svg" />
          <h5 class="modal-title text-left" id="exampleModalLabel">
            Your MembershipPlan
          </h5>
        </div>
      </Modal.Header>
      <Modal.Body>
        <section class="">
          <div class="signupTab">
            <div class="formArea border-radius-20 border-0">
              <form>
                <div class="row g-4">
                  <div class="col-md-12">
                    <div class="form-group text-center">
                      <h3>
                        Are you sure about{" "}
                        {`${
                          formData?.selectedPlan === "basic"
                            ? "Basic "
                            : "PREMIUM "
                        } Membership Plan`}
                      </h3>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <button
                      type="submit"
                      class="blue_btn"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
}

export default membershipPlanPop;
