import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Loader } from "../../../components/ui/loader/loader";
import { fetchAdminData, fetchDataAuth } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import PaymentPopUp from "./paymentPopUp";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/pagination/pagination";

const ManagePayment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentList, setPaymentList] = useState([]);
  const [paymentPopUp, setPaymentPopUp] = useState(false);
  const [query, setQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
  const [functionType, setFunctionType] = useState("");
  const [paymentObject, setPaymentObject] = useState({});
    const [totalPages, setTotalPages] = useState(1);
  
  const [selectedActions, setSelectedActions] = useState({});

  const paymentStatusColors = {
    pending: "warning",
    success: "success",
    failed: "danger",
  };
    useEffect(() => {
      fetchPaymentRequestList(currentPage, query);
      }, [currentPage]);

      const itemsPerPage = 5;

  const fetchPaymentRequestList = async (page = 1, searchQuery = "") => {
      setLoading(true);
      const fetchUrl = `MasterPanel/get-accounts/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
        searchQuery
      )}`;
      try {
        const response = await fetchDataAuth(fetchUrl);
  
        if (!response.ok) throw new Error("Fetching Doctor List Failed");
        const totalPagesHeader = response.headers.get("Total-Pages");
        const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
        const getData = await response.json();
        setPaymentList(getData?.data);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Fetch Doctor List Error: ", error);
        throw error;
      } finally {
        setLoading(false);
      }
    };

  const handleActionSelect = (selectedOption, payment) => {
    if (!selectedOption) return;

    setFunctionType(selectedOption.value === "approve" ? "Approve" : "Reject");
    setPaymentObject(payment);
    setPaymentPopUp(true);

    setTimeout(() => {
      setSelectedActions((prev) => ({ ...prev, [payment.id]: null }));
    }, 300);
  };

  return loading ? (
    <Loader />
  ) : (
    <section className="p-3 w-100">
      <div className="p-3 bg-white border rounded shadow">
        <h4 className="mb-3">{t("superadmin.manage-payment")}</h4>

        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>{t("superadmin.request-date")}</th>
                <th>{t("superadmin.doctor-name")}</th>
                <th>{t("superadmin.request-amount")}</th>
                <th>{t("wallet.status")}</th>
                <th className="text-center">{t("superadmin.action")}</th>
              </tr>
            </thead>
            <tbody>
              {paymentList.map((payment) => (
                <tr key={payment.id}>
                  <td>{new Date(payment.timestamp).toLocaleDateString()}</td>
                  <td>Dr. {payment.Doctor_name}</td>
                  <td>${payment.amount}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        paymentStatusColors[payment.status] || "warning"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="text-center">
                    {(payment.status === "pending" && (
                      <Select
                        options={[
                          { value: "approve", label: "✅ Approve" },
                          { value: "reject", label: "❌ Reject" },
                        ]}
                        placeholder="Select Action"
                        value={selectedActions[payment.id] || null}
                        onChange={(selectedOption) =>
                          handleActionSelect(selectedOption, payment)
                        }
                        isSearchable={false}
                        className="w-100"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    )) ||
                      (payment.status === "failed" && (
                        <span>{payment.rejection_reason}</span>
                      ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
   
   
         <Pagination
           totalPages={totalPages}
           currentPage={currentPage}
           onPageChange={setCurrentPage}
         />

      {paymentPopUp && (
        <PaymentPopUp
          open={paymentPopUp}
          setOpen={setPaymentPopUp}
          functionType={functionType}
          paymentObject={paymentObject}
          callFetch={fetchPaymentRequestList}
        />
      )}
    </section>
  );
};

export default ManagePayment;
