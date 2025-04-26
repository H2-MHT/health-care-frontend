import { useState } from "react";
import CommonModal from "../../../components/form/Modal";
import { putData } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { InputComponent } from "../../../components/form/InputComponent";
import { useTranslation } from "react-i18next";

export default function PaymentPopUp({
  open,
  setOpen,
  functionType,
  paymentObject,
  callFetch,
}) {
  const [rejectionMessage, setRejectionMessage] = useState("");
  const url = "MasterPanel/approv-reject-payment";
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      transaction_id: `${paymentObject.id}`,
      rejection_reason: rejectionMessage,
    };
    try {
      if (functionType === "Approve")
        payload = { ...payload, status: "success" };
      else if (functionType === "Reject")
        payload = { ...payload, status: "failed" };

      const response = await putData(url, JSON.stringify(payload));
      console.log(payload);
      
      if (response?.status === 200) {
        setOpen(false);
        const responseData = await response.json();
        showToast(responseData?.message, "success");
        callFetch();
      }
    } catch (error) {
      showToast("Cannot perform the task", "error");
    }
  };

  const closeModal = () => {
    setOpen(false);
  };

  const handleRejection=(e)=>{
    setRejectionMessage(e.target.value);
  }

  const confirmPopUp = () => {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg">
        <form>
          <div className="row g-2">
            <div className="col-md-12 mb-2">
              <div className="form-group">
                Are you sure you want to {functionType.toLowerCase()} payment of
                ${paymentObject.amount} to Dr. {paymentObject.Doctor_name} ?
              </div>
            </div>
          </div>
          {functionType === "Reject" && (
            <div className="row g-2">
              <div className="col-md-12 mb-2">
                <div className="form-group">
                  <InputComponent
                    type="text"
                    placeholder="Enter rejection message"
                    value={rejectionMessage}
                    onChange={handleRejection}
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    );
  };

  return (
    <CommonModal
      size="lg"
      show={open}
      title={`${functionType} Payment`}
      body={confirmPopUp()}
      onHide={closeModal}
      footerButtons={[
        { label: "Yes", onClick: handleSubmit, className: "transparent_btn" },
        { label: "No", onClick: closeModal, className: "blue_btn" },
      ]}
    ></CommonModal>
  );
}
