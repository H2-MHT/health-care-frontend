import React, { useEffect, useState } from "react";
import { fetchDataAuth } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PaymentHistory = () => {
  const { t } = useTranslation("wallet");
  const [walletDetails, setWalletDetails] = useState();
  const [rowDetails, setRowDetails] = useState();
  const [doctorTotalAmount, setDoctorTotalAmount] = useState();
  const [withdrawalRequestList, setWithdrawalRequestList] = useState([]);
  const [details, setShowDetails] = useState(false);
  const [tab, setTab] = useState(false);

  const navigate = useNavigate();

  // const getDoctorWalletDetails = async () => {
  //   try {
  //     const response = await fetchDataAuth("payment/transactions", navigate);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch data from the server.");
  //     }

  //     const getData = await response.json();
  //     setWalletDetails(getData);
  //     setRowDetails(getData?.transactions[0]);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const getDoctorPaymentDetails = async () => {
    try {
      const response = await fetchDataAuth("doctors/get-wallet/", navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }

      const getData = await response.json();
      setDoctorTotalAmount(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getWithdrawalRequestList = async () => {
    try {
      const response = await fetchDataAuth(
        `payment/transaction-history/`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }

      const getData = await response.json();
      setWithdrawalRequestList(getData.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRowClick = (rowData) => {
    setShowDetails(true);
    setRowDetails(rowData);
  };

  useEffect(() => {
    // getDoctorWalletDetails();
    getWithdrawalRequestList();
    getDoctorPaymentDetails();
  }, []);

  return (
    <>
      <div class="rightContent rightsidefull">
        <div class="viewMain">
          <div class="row">
            <div class="col-md-12 bg-white left-col p-2">
              <div class="sortSearchArea search-margin"></div>

              <div class="row">
                <div class="col-md-12">
                  <h3
                    className="transactionHeading blue_txt"
                    onClick={() => setTab(true)} // ← now it runs only when clicked
                  >
                    {t("wallet.transaction-history")}
                  </h3>

                  <div class="pateintData">
                    <div class="treatmentData tableTransactionData ">
                      <table class="table table-hover table-borderless">
                        <thead class="table-dark">
                          <tr>
                            <th scope="col">{t("wallet.sender")}</th>
                            <th scope="col">{t("wallet.Currency")}</th>
                            <th scope="col">{t("wallet.payment-date")}</th>
                            <th scope="col">{t("wallet.amount")}</th>
                            <th scope="col">{t("wallet.payment-method")}</th>
                            <th scope="col">{t("wallet.payment-status")}</th>
                            <th scope="col">{t("wallet.appointment_date")}</th>
                          </tr>
                        </thead>
                        {withdrawalRequestList?.length > 0 ? (
                          <tbody className="tableData-color">
                            {withdrawalRequestList?.map((account, index) => (
                              <tr
                                key={index}
                                onClick={() => handleRowClick(account, index)}
                              >
                                <td>{account?.doctor?.name}</td>
                                <td>{account?.currency}</td>
                                <td>{account?.payment_date}</td>
                                <td>{account?.amount}</td>
                                <td>{account?.payment_method}</td>
                                <td>{account?.payment_status}</td>
                                <td>{account?.appointment_date}</td>
                              </tr>
                            ))}
                          </tbody>
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center">
                              No Payment History available
                            </td>
                          </tr>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentHistory;
