import React, { useEffect, useState } from "react";
import ConfirmPaymentPop from "./ConfirmPaymentPop";
import ConfirmPaymentWithdrawPop from "./confirmPaymentWithdrawPop";
import AppointementDetailsPop from "./appointementDetailsPop";
import { fetchDataAuth } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import Select from "../../../components/form/Select";
import { paymentSortBy } from "../../../utils/constants";
import { useTranslation } from "react-i18next";

const DoctorWallet = () => {
  const{t} = useTranslation("wallet");
  const [walletDetails, setWalletDetails] = useState();
  const [rowDetails, setRowDetails] = useState();
  const [modelOpen, setModelOpen] = useState(false);
  const [modelOpenPop, setModelOpenPop] = useState(false);
  const [accountdetails, setAccountdetails] = useState();
  const [doctorTotalAmount,setDoctorTotalAmount]=useState()
  const [withdrawalRequestList,setWithdrawalRequestList] = useState([]);
  const [details, setShowDetails] = useState(false)
  const [accountList, setAccountList] = useState([]);
  const navigate = useNavigate();

  const paymentStatusColors = {
    pending: "warning",
    success: "success",
    failed: "danger",
  };

  let currency = walletDetails?.current_balance;
  let formattedCurrency = currency?.toFixed(2);

  const getDoctorWalletDetails = async () => {
    try {
      const response = await fetchDataAuth("payment/transactions", navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }

      const getData = await response.json();
      setWalletDetails(getData);
      setRowDetails(getData?.transactions[0]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDoctorPaymentDetails = async () => {
    try {
      const response = await fetchDataAuth("doctors/get-wallet/", navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }

      const getData = await response.json();
      setDoctorTotalAmount(getData?.data)
    } catch (error) {
      console.log(error.message);
    }
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "";
    const visibleDigits = accountNumber.slice(-4); // Get the last 4 digits
    const maskedPart = accountNumber.slice(0, -4).replace(/\d/g, "*"); // Mask the rest with "*"
    return `${maskedPart}${visibleDigits}`;
  };

  const accountNumber = accountdetails?.account_number;
  let accountNumberFormat = maskAccountNumber(accountNumber);

  const getWithdrawalRequestList = async () => {
    // const userData = JSON.parse(localStorage.getItem('user_data'));
    
    try {
      const response = await fetchDataAuth(`payment/withdrawal-request/`, navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }

      const getData = await response.json();
      setWithdrawalRequestList(getData.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchAccountList = async () => {
      const userData = JSON.parse(localStorage.getItem("user_data"));
      try {
        const response = await fetchDataAuth(
          `payment/add-account-detail/?user_id=${userData.id}`,
          navigate
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data from the server.");
        }
        const getData = await response.json();
        setAccountList(getData.accounts);
      } catch (error) {
        console.log(error.message);
      }
    };

  const handleRowClick = (rowData) => {
    setShowDetails(true);
    setRowDetails(rowData);
  };

  useEffect(() => {
    getDoctorWalletDetails();
    getWithdrawalRequestList();
    getDoctorPaymentDetails()
  }, []);

  const handleDate = (date)=>{
    return new Date(date).toLocaleDateString();
  }

  return (
    <>
      <div class="rightContent">
        <div class="profileMobile">
          <div class="nameMobile">Hello, dr,Ava Williams!</div>
          <div class="profileImgMobile">
            <img
              src="images/doctor-dashboard/profile-sample.png"
              class="img-fluid"
            />
          </div>
        </div>

        <div class="viewMain">
          <div class="row">
            <div class="col-md-7 bg-white left-col p-2">
              <div class="sortSearchArea search-margin">
                <div class="search">
                  <input
                    type="search"
                    placeholder="search"
                    class="search-input"
                  />
                  <a href="#">
                    <img src="../images/search-dark.svg" />
                  </a>
                </div>
                <div class="sorting">
                  <div class="sorting">
                    <Select options={paymentSortBy} />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-12">
                  <h3 class="transactionHeading blue_txt">
                    {t("wallet.transaction-history")}
                  </h3>
                  <div class="pateintData">
                    <div class="treatmentData tableTransactionData ">
                      <table class="table table-hover table-borderless">
                        <thead class="table-dark">
                          <tr>
                            <th scope="col">{t("wallet.sender")}</th>
                            <th scope="col">{t("wallet.account")}</th>
                            <th scope="col">{t("wallet.date")}</th>
                            <th scope="col">{t("wallet.amount")}</th>
                            <th scope="col">{t("wallet.transaction")}</th>
                            <th scope="col">{t("wallet.status")}</th>
                            <th scope="col">{t("wallet.reason")}</th>
                          </tr>
                        </thead>
                        {withdrawalRequestList?.map((account, index) => (
                          <>
                            <tbody class="tableData-color">
                              <tr
                                key={index}
                                onClick={() => handleRowClick(account, index)}
                              >
                                <td>{account?.Doctor_name}</td>
                                <td class="text-center">{account?.account}</td>
                                <td class="text-green">
                                  {handleDate(account?.timestamp)}
                                </td>
                                <td>{account?.amount}</td>
                                <td>{account?.transaction_type}</td>
                                <td>
                                  <span
                                    className={`badge bg-${
                                      paymentStatusColors[account.status] ||
                                      "warning"
                                    }`}
                                  >
                                    {account?.status}
                                  </span>
                                </td>
                                <td>
                                  <span>
                                    {account.rejection_reason
                                      ? account.rejection_reason
                                      : "NA"}
                                  </span>
                                </td>
                                {/* <td>
                                  <img
                                    src="images/doctor-dashboard/greendownArrow.webp"
                                    width="15"
                                    class="img-fluid"
                                    alt="arrow"
                                  />
                                </td> */}

                                {/* <td>
                              <img
                                src="images/doctor-dashboard/redupArrow.webp"
                                width="15"
                                class="img-fluid"
                                alt="arrow"
                              />
                            </td> */}
                              </tr>
                            </tbody>
                          </>
                        ))}
                      </table>
                    </div>
                  </div>
                </div>

                {/* {details && (
                  <div class="col-md-12 mt-4 p-4">
                    <div
                      class="border rounded border-1"
                      style={{ position: "relative" }}
                    >
                      <h3 class="cardHeadingText">{t("wallet.details")}</h3>

                      <div class="d-flex flex-column list-alignment">
                        <div class="d-flex align-items-center">
                          <p class="details-label">
                            {t("wallet.payment-from")}
                            <span>{rowDetails?.sender}</span>
                          </p>
                        </div>

                        <div class="d-flex align-items-center">
                          <p class="details-label">
                            {t("wallet.details")}
                            <span>{rowDetails?.description}</span>
                          </p>
                        </div>

                        <div class="d-flex align-items-center">
                          <p class="details-label">
                            {t("wallet.transaction-time")}
                            <span>{rowDetails?.date}</span>
                          </p>
                        </div>

                        <div class="d-flex align-items-center">
                          <p class="details-label">
                            {t("wallet.payment")}
                            <span>{rowDetails?.final_amount}</span>
                          </p>
                        </div>

                        <div class="d-flex align-items-center">
                          <p class="details-label">
                            {t("wallet.clinic-earning")}:{" "}
                            <span>{rowDetails?.clinic_charge}</span>
                          </p>
                        </div>

                        <div class="d-flex align-items-center">
                          <p class="details-label">
                            {t("wallet.total-incomes")}:{" "}
                            <span>{rowDetails?.total}</span>
                          </p>
                        </div>

                        <div class="d-flex align-items-center">
                          <p class="details-label">
                            {t("wallet.status")}: <span>received</span>
                          </p>
                        </div>

                        <div class="d-flex align-items-center">
                          <p class="details-label">
                            {t("wallet.invoice")}:{" "}
                            <span>
                              <img
                                src="images/doctor-dashboard/fileIcon.webp"
                                width="24"
                                alt="image"
                              />
                            </span>
                          </p>
                        </div>
                        <a
                          href="#"
                          class="support-link"
                          data-bs-toggle="modal"
                          data-bs-target="#supportModal"
                        >
                          {t("wallet.support")}
                        </a>
                      </div>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
            <div class="col-md-5 right-col p-4">
              <div class="card-alignment mt-4">
                <div class="curr-bal-card bg-white">
                  <div class="curr-bal-text">
                    <p>{t("wallet.current-balance")}</p>
                  </div>
                  <div class="curr-bal-value">
                    <p>
                      <span>$</span> {doctorTotalAmount?.balance}
                    </p>
                  </div>
                </div>

                <div class="payment-card">
                  <div class="total-payment-card bg-white">
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="total-text">{t("wallet.total")}</div>
                      <div>
                        <button class="drop-btn bg-white">
                          {t("wallet.last-week")}
                        </button>
                        <div class="dropdown">
                          <button
                            class="btn"
                            className="drop-arrow"
                            style={{
                              backgroundColor: "#00BBD3",
                              transform: "rotate(90deg)",
                            }}
                          ></button>
                          {/* <div class="dropdown-content">
                            <a href="#">Link 1</a>
                            <a href="#">Link 2</a>
                            <a href="#">Link 3</a>
                          </div> */}
                        </div>
                      </div>
                    </div>

                    <div class="total-amt">
                      <span>$</span> {doctorTotalAmount?.balance}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModelOpenPop(true)}
                    class="border-0 bg-none"
                  >
                    <div class="get-payed-card bg-white">
                      <div class="row">
                        <div class="col-md-7">
                          <p class="get-payed-text">{t("wallet.get-payed")}</p>
                        </div>
                        <div class="col-md-5">
                          <div class="d-flex align-items-center">
                            <img
                              src="images/doctor-dashboard/dollar.webp"
                              width="40"
                              alt="img"
                              style={{ marginTop: "30px" }}
                            />
                            <img
                              src="images/doctor-dashboard/dollar.webp"
                              width="40"
                              alt="img"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div class="payment-method-container">
                <div class="payment-method-heading">
                  {t("wallet.payment-methods")}
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
                    <div class="acc-img">
                      <div>
                        <img
                          src="images/doctor-dashboard/visa.webp"
                          width="40px"
                          alt="img"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="payment-method-card bg-white w-100">
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
                    <div class="acc-img">
                      <div>
                        <img
                          src="images/doctor-dashboard/visa.webp"
                          width="40px"
                          alt="img"
                        />
                      </div>
                    </div>
                  </div>
                </div> */}

                <div class="payment-method-card bg-white w-100">
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
                          {t("wallet.add-payment-method")}
                        </label>
                      </div>
                    </div>
                    <div class="acc-img">
                      <div>
                        <img
                          src="images/doctor-dashboard/payment-card.webp"
                          width="120"
                          alt="img"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="cardSecond-row">
                    <div class="pay-card-content">
                      {t("wallet.payment-method-txt")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppointementDetailsPop />

      <ConfirmPaymentPop
        total={doctorTotalAmount?.balance}
        current={formattedCurrency}
        accountNumberFormat={accountNumberFormat}
        Modal={Modal}
        modelOpen={modelOpen}
        setModelOpen={setModelOpen}
        modelOpenPop={modelOpenPop}
        setModelOpenPop={setModelOpenPop}
        accountdetails={accountdetails}
        setAccountdetails={setAccountdetails}
        fetchWithdrawalList={getWithdrawalRequestList}
        fetchAccountList={fetchAccountList}
        accountList={accountList}
      />
      <ConfirmPaymentWithdrawPop
        total={doctorTotalAmount?.balance}
        current={formattedCurrency}
        accountdetails={accountdetails}
        setAccountdetails={setAccountdetails}
        Modal={Modal}
        modelOpen={modelOpen}
        setModelOpen={setModelOpen}
        callFetch={fetchAccountList}
      />
    </>
  );
};

export default DoctorWallet;
