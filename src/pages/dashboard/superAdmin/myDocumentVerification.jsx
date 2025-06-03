import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchDataAuth, updateApointmentData } from "../../../hooks/services/services";
import ViewVerificationDocument from "./viewVerificationDocument"
import { showToast } from "../../../utils/toast";
import ShowModelRejected from "./showModelRejected"
import { useTranslation } from "react-i18next";

function MyDocumentVerification() {
  const [viewItem, setviewItem] = useState();
  const [licensesdetail, setLicensesdetail] = useState();
 const [showModal,setShowModal]=useState(false)
 const [documentDeatils,setDocumentDeatils]=useState()
 const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [viewDocument,setViewDocument]=useState(false)
  const [statusMap, setStatusMap] = useState({});
  const { doctor = null } = location.state || {};
 
  const getDoctorDocumentList = async () => {
    try {
      const response = await fetchDataAuth(
        `MasterPanel/verify-document/?user_id=${doctor?.id}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setLicensesdetail(getData?.licence_certificate);
    } catch (error) {
      console.log(error.message);
    }
  };

 

  const handleViewItem = (item) => {
    setviewItem(item);
    setViewDocument(true)
  };



const handleChange = async (event,item) => {
    const { name, value } = event.target;
    
    setStatusMap((prev) => ({
      ...prev,
      [name]: value,
    }));
    setDocumentDeatils(item)
    if (value === "Rejected") {
      setShowModal(true);
      return;
    }
  
    try {
        const payload = {
             status: statusMap?.status,
             licence_certificate_id:documentDeatils?.id,
             user_id:documentDeatils?.user_id

         };// 👈 send ID and status
      const response = await updateApointmentData("MasterPanel/verify-document/", payload);
  
      if (response.status === 200) {
        const responseData = await response.json();
        getDoctorDocumentList();
        showToast(responseData?.message, "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  



  useEffect(() => {
    getDoctorDocumentList();
  }, []);


  return (
    <>
      <div className="rightContent rightsidefull">
        <div className="row h-100">
          <div class="col-md-12">
            <div class="padding-inner border-radius-20 bg-white h-100">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="docinfohead">{t("support.document-verification")}</h3>
              </div>

              <div class="mediaDegestPart">
                <table border="1">
                  <thead>
                    <tr>
                      <th>{t("prescription.name")}</th>
                      <th> {t("add-education.description")}</th>
                      <th>{t("wallet.status")}</th>
                      <th>{t("wallet.view")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {licensesdetail?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>
                          <select
                            value={statusMap[item?.id] || item?.status}
                            onChange={(event) => handleChange(event, item)}
                            className="border p-2 rounded"
                            name="status"
                          >
                            <option value="Pending">{t("support.pending")}</option>
                            <option value="Verified">{t("support.verified")}</option>
                            <option value="Rejected">{t("support.rejected")}</option>
                          </select>
                        </td>

                        <td>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              handleViewItem(item);
                            }}
                          >
                          {t("support.view")}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ViewVerificationDocument
        setViewDocument={setViewDocument}
        viewDocument={viewDocument}
        viewItem={viewItem}
      />
      <ShowModelRejected
        setShowModal={setShowModal}
        showModal={showModal}
        documentDeatils={documentDeatils}
        statusMap={statusMap}
        getDoctorDocumentList={getDoctorDocumentList}
      />
    </>
  );
}

export default MyDocumentVerification;
