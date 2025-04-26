import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import AmountPopUp from "./amountPopUp";
import { fetchDataAuth } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ConfirmPaymentPop = ({
  total,
  current,
  accountNumberFormat,
  Modal,
  setModelOpen,
  setModelOpenPop,
  modelOpenPop,
  setAccountdetails,
  fetchWithdrawalList,
  fetchAccountList,
  accountList
}) => {
    const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amountPopUp, setAmountPopUp] = useState(false);
  // const [accountList, setAccountList] = useState([]);
  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "";
    const visibleDigits = accountNumber.slice(-4); // Get the last 4 digits
    const maskedPart = accountNumber.slice(0, -4).replace(/\d/g, "*"); // Mask the rest with "*"
    return `${maskedPart}${visibleDigits}`;
  };

  const addAccountDetails = () => {
    setModelOpen(true);
    setAccountdetails();
  };

  useEffect(() => {
    fetchAccountList();
  }, []);

  return (
    <Modal
      show={modelOpenPop}
      backdrop="static"
      keyboard={false}
      onHide={() => setModelOpenPop(false)}
      size="lg"
    >
      <Modal.Header closeButton>
        <div class="modal-heading-alignment">
          <img src="images/doctor-dashboard/Info.svg" />
          <h5 class="modal-title text-left" id="exampleModalLabel">
            {t("appointment-manage.confirm-payment")}
          </h5>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div class="modal-body">
          <div class="appointPopup">
            <div class="status paymnt-alignment">
              <div class="value-display">
                <div class="curr-bal-value mt-0">
                  <p>
                    <span>$</span> {total}
                  </p>
                </div>
                <div style={{ cursor: "pointer" }}>
                  <img src="images/doctor-dashboard/edit-dark.svg" />
                </div>
              </div>
              <div class="statusFinal curr_bal_text">
                {t("wallet.current-balance")}: $ {current}
              </div>
            </div>
            <div class="status payment-method-container mt-0">
              <div class="payment-method-card bg-white w-100">
                <div class="cardFirst-row">
                  <div class="d-flex align-items-center">
                    <div class="form-check">
                      <label
                        class="form-check-label radio-text"
                        for="flexRadioDefault1"
                      >
                        {t("wallet.add-account")}
                      </label>
                    </div>
                  </div>
                  <div class="acc-img">
                    <div>
                      {/* <img
                            src="images/doctor-dashboard/payment-card.webp"
                            width="120"
                            alt="img"
                          /> */}
                    </div>
                  </div>
                </div>
                <div class="cardSecond-row">
                  <div class="pay-card-content">
                    <div class="pay-card-content">
                      {t("wallet.secure-money")}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="blue_btn"
                    onClick={addAccountDetails}
                  >
                    {t("wallet.add_account")}
                  </button>
                </div>
              </div>

              {/* <div class="payment-method-card bg-white w-100">
                <div class="cardFirst-row">
                  <div class="d-flex align-items-center">
                    <div class="form-check">
                      <input
                            class="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                          />
                      <label
                        class="form-check-label radio-text"
                        for="flexRadioDefault1"
                      >
                        {accountNumberFormat}
                      </label>
                    </div>
                  </div>
                </div>
                <div class="cardSecond-row">
                  <div
                    class="pay-card-content"
                    
                  >
                    cardSecond-row
                  </div>
                  <button type="submit" className="blue_btn" onClick={() => setModelOpen(true)}>Edit Account details</button>
                </div>
              </div> */}

              <div className="container mt-5">
                <h3 className="text-center mb-4 fw-bold">
                  {t("wallet.select-account")}
                </h3>
                <div className="withdrawMain">
                <div className="table-responsive">
                  <table className="table table-hover text-center rounded-3 overflow-hidden">
                    <thead className="table-dark">
                      <tr>
                        <th>{t("wallet.select")}</th>
                        <th>{t("wallet.account-holder")}</th>
                        <th>{t("wallet.ifsc-code")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountList.map((account, id) => (
                        <tr
                          key={id}
                          className={
                            selectedAccount?.account_number ===
                            account.account_number
                              ? "table-primary"
                              : ""
                          }
                        >
                          <td className="align-middle">
                            <input
                              type="radio"
                              name="account"
                              value={account.account_number}
                              onChange={() => setSelectedAccount(account)}
                              checked={
                                selectedAccount?.account_number ===
                                account.account_number
                              }
                            />
                          </td>
                          <td className="text-center">
                            <span className="fw-bold">{account.full_name}</span>
                            <br />
                            <small className="text-muted">
                              {maskAccountNumber(account.account_number)}
                            </small>
                          </td>
                          <td className="align-middle">{account.ifsc_code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </div>
              </div>

              <button
                type="submit"
                className="blue_lg border-0 bg-none"
                data-bs-target="#cnfrm_payment2"
                disabled={selectedAccount === null}
                onClick={() => setAmountPopUp(true)}
              >
                {t("wallet.withdraw-money")}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
      {amountPopUp && (
        <AmountPopUp
          open={amountPopUp}
          setOpen={setAmountPopUp}
          accountObject={selectedAccount}
          callFetch={fetchWithdrawalList}
        />
      )}
    </Modal>
  );
};

export default ConfirmPaymentPop;
