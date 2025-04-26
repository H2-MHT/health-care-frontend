import { useState } from "react";
import CommonModal from "../../../components/form/Modal";
import { postData } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { InputComponent } from "../../../components/form/InputComponent";
import { useTranslation } from "react-i18next";

export default function AmountPopUp({
    open,
    setOpen,
    accountObject,
    callFetch
}) {
  const { t } = useTranslation();
    const [amount, setAmount] = useState("");
    const [error,setError] = useState(false);
    const userData = JSON.parse(localStorage.getItem("user_data"));
    const url = "payment/withdrawal-request/";
    const handleSubmit = async (e) => {
        if(!amount){
            showToast("Please enter a valid amount", "error");
            return
        }
        e.preventDefault();
        let payload = {
            user_id: userData.id,
            account_number:accountObject.account_number,
            full_name:accountObject.full_name,
            amount: amount,
        };
        try {
            const response = await postData(url, payload);
            if (response?.status === 201) {
                setOpen(false);
                const responseData = await response.json();
                console.log("response: ", responseData);
                showToast(responseData?.message, "success");
            }
        } catch (error) {
            showToast("Cannot withdraw amount", "error");
        }
        callFetch();
    };

    const closeModal = () => {
        setOpen(false);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (isNaN(value))
            setError(true)
        else{
            setError(false);
            setAmount(value);
        }
    }

    const confirmPopUp = () => {
        return (
          <div className="max-w-lg mx-auto p-6 bg-white rounded-lg">
            <form>
              <div className="row g-2">
                <div className="col-md-12 mb-2">
                  <div className="form-group">
                    <InputComponent
                      type="text"
                      placeholder="Enter amount to withdraw"
                      value={amount}
                      onChange={handleAmountChange}
                    />
                  </div>
                </div>
                {error && (
                  <span className="error-message">
                    {t("wallet.amt-number")}
                  </span>
                )}
              </div>
            </form>
          </div>
        );
    };

    return (
      <CommonModal
        size="md"
        show={open}
        title={`Enter Amount`}
        body={confirmPopUp()}
        onHide={closeModal}
        footerButtons={[
          {
            label: "Confirm",
            onClick: handleSubmit,
            className: "transparent_btn",
          },
        ]}
        // className="modal-backdrop"
      ></CommonModal>
    );
}
