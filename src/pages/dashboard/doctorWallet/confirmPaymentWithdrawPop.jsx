import React, { useState, useEffect } from "react";
import { InputField } from "../../../components/form/InputField";
import { showToast } from "../../../utils/toast";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { postData, fetchDataAuth } from "../../../hooks/services/services";
import Select from "../../../components/form/Select";
import { useTranslation } from "react-i18next";

const ConfirmPaymentWithdrawPop = ({
  total,
  current,
  accountdetails,
  Modal,
  modelOpen,
  setModelOpen,
  callFetch
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState("$");
  const currency = [
    { label: "US Dollar", value: "US Dollar", symbol: "$", rate: 1 },
    { label: "Euro", value: "Euro", symbol: "€", rate: 0.92 },
    { label: "British Pound", value: "British Pound", symbol: "£", rate: 0.81 },
  ];

  const handleCurrencyChange = (e) => {
    const value = e.target.value;
    const selected = currency.find((cur) => cur.value === value);
    setSelectedSymbol(selected ? selected.symbol : "");
  };

  const schema = Yup.object().shape({
    account_number: Yup.string().required("Account Number is required"),
    confirm_account_number: Yup.string()
      .oneOf([Yup.ref("account_number"), null], "Account Numbers must match")
      .required("Confirm Account Number is required"),
    full_name: Yup.string().required("Full Name is required"),
    ifsc_code: Yup.string().required("IFSC Code is required"),
    // amount: Yup.number()
    //   .typeError("Amount must be a number") // Custom error for invalid number
    //   .required("Amount is required")
    //   .test(
    //     "is-valid-amount",
    //     `Amount should not exceed ${current}`, // Custom error message
    //     (value) => value === undefined || value <= current // Validation logic
    //   ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,

    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleClearForm = () => {
    // Clear specific fields
    setValue("account_number", "");
    setValue("confirm_account_number", "");
    setValue("full_name", "");
    setValue("ifsc_code", "");
    // setValue("amount", "");
  };

  // Alternatively, reset the entire form
  const handleResetForm = () => {
    reset({
      account_number: accountdetails?.account_number,
      confirm_account_number: accountdetails?.confirm_account_number,
      full_name: accountdetails?.full_name,
      ifsc_code: accountdetails?.ifsc_code,
      // amount: accountdetails?.amount,
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("user_data"));
    try {
      const payload = {
        account_number: data?.account_number,
        confirm_account_number: data?.confirm_account_number,
        full_name: data?.full_name,
        ifsc_code: data?.ifsc_code,
        // amount: data?.amount,
        // currency: data?.currency,
      };

      const response = await postData(`payment/add-account-detail/?user_id=${userData.id}`, payload);
      const responseJson = await response.json();
      if (response.status === 201) {
        showToast(responseJson?.message, "success");
        setModelOpen(false);
      }
      handleClearForm();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
      callFetch();
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
        <div className="modal-heading-alignment">
          <img src="images/doctor-dashboard/Info.svg" alt="Info" />
          <h5 className="modal-title text-left" id="exampleModalLabel">
            {t("appointment-manage.confirm-payment")}
          </h5>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body">
          <div className="appointPopup">
            <div className="status paymnt-alignment">
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  className="value-display"
                  style={{ justifyContent: "center", marginLeft: "10%" }}
                >
                  <div className="curr-bal-value mt-0">
                    <p>
                      <span>{selectedSymbol}</span> {total}
                    </p>
                  </div>

                  <div style={{ cursor: "pointer" }}>
                    <img
                      src="images/doctor-dashboard/edit-dark.svg"
                      alt="Edit"
                    />
                  </div>
                </div>
                {/* <div
                  style={{
                    position: "absolute",
                    right: "3rem",
                    width: "20%",
                  }}
                >
                  <Select
                    name="currency"
                    register={register}
                    options={currency}
                    onChange={handleCurrencyChange}
                  />
                </div> */}
              </div>
              <div className="statusFinal curr_bal_text">
                {t("wallet.current-balance")}: {selectedSymbol} {current}
              </div>
            </div>
            <div className="status payment-method-container mt-0">
              <div className="payment-method-card bg-white w-100">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-white border-radius-20 padding-20">
                      <div className="row g-4">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>{t("wallet.account-number")}</label>
                            <InputField
                              type="text"
                              placeholder="Enter Account Number"
                              name="account_number"
                              register={register}
                              error={errors?.account_number?.message}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>{t("wallet.confirm-account")}</label>
                            <InputField
                              type="text"
                              placeholder="Enter Confirm Account Number"
                              name="confirm_account_number"
                              register={register}
                              error={errors?.confirm_account_number?.message}
                            />
                          </div>
                        </div>
                        {/* <div className="col-md-12">
                          <div className="form-group">
                            <label>Amount</label>
                            <InputField
                              type="text"
                              placeholder="Enter Your Amount "
                              name="amount"
                              register={register}
                              error={errors?.amount?.message}
                            />
                          </div>
                        </div> */}
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>{t("wallet.full-name")}</label>
                            <InputField
                              type="text"
                              placeholder="Enter Full Name"
                              name="full_name"
                              register={register}
                              error={errors?.full_name?.message}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>{t("wallet.ifsc-code")}</label>
                            <InputField
                              type="text"
                              placeholder="Enter IFSC Code"
                              name="ifsc_code"
                              register={register}
                              error={errors?.ifsc_code?.message}
                            />
                          </div>
                        </div>
                        <div className="rescduleBtns flex-column mb-2">
                          <button
                            type="submit"
                            className="blue_lg border-0 bg-none"
                            data-bs-target="#cnfrm_payment2"
                          >
                            {t("wallet.submit-details")}
                          </button>

                          {/* <div>
  <button type="button" onClick={handleClearForm}>
    Clear Fields
  </button>
  <button type="button" onClick={handleResetForm}>
    Reset Form
  </button>
</div> */}
                        </div>
                      </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmPaymentWithdrawPop;
