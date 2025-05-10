import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteData,
  fetchDataAuth,
  postData,
} from "../../../../hooks/services/services";
import { showToast } from "../../../../utils/toast";
import AddSpecializationModel from "./addSpecializationModel";
import EditSpecializationModel from "./editSpecializationModel";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";  

function Specialization() {
  const {t} = useTranslation();
  const [specializationDetail, setSpecializationDetail] = useState();
  const [activeTab, setActiveTab] = useState("Exciting Specialization");
  const [penddingSpecializationDetail, setPenddingSpecializationDetail] =
    useState([]);
  const [modelApproved, setModelApproved] = useState(false);
  const [targetSpecialzation, setTargetSpecialzation] = useState();
  const [sourceSpecialization, setSourceSpecialization] = useState();
  const [specializationName, setSpecializationName] = useState();
  const [modelMerge, setModelMerge] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editDetails, setEditDetails] = useState();
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  const getspecializationList = async () => {
    try {
      const response = await fetchDataAuth(
        `MasterPanel/specialization/`,
        navigate
      );
      if (!response.ok)
        throw new Error("Failed to fetch data from the server.");
      const getData = await response.json();
      setSpecializationDetail(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getPenddingSpecializationList = async () => {
    try {
      const response = await fetchDataAuth(
        `MasterPanel/approve-specialization/`,
        navigate
      );
      if (!response.ok)
        throw new Error("Failed to fetch data from the server.");

      const getData = await response.json();
      const pendingList = Array.isArray(getData?.data) ? getData.data : [];
      setPenddingSpecializationDetail(pendingList);
    } catch (error) {
      console.log(error.message);
      setPenddingSpecializationDetail([]); // Ensure it stays an array
    }
  };

  const handleEdit = (item) => {
    setEditDetails(item);
    setShowEditModal(true);
  };

  const deleteSpecialization = async (id, event) => {
    event.preventDefault();
    try {
      const payload = { specialization_id: id };
      const response = await deleteData(`MasterPanel/specialization/`, payload);
      showToast(response?.message, "success");
      await getspecializationList();
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const onSubmitApprove = async () => {
    if (!specializationName?.name) {
      return;
    }
    try {
      const payload = {
        specialization_name: specializationName?.name,
      };
      const response = await postData(
        `MasterPanel/approve-specialization/`,
        payload
      );
      if (response.status == 201) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        await getPenddingSpecializationList();
        setModelApproved(false);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleApprove = (pendingItemId) => {
    const pendingItem = penddingSpecializationDetail.find(
      (item) => item.id === pendingItemId
    );
    const selectedSpecId = selectedSpecs[pendingItemId];
    setSpecializationName(pendingItem);
    setModelApproved(true);
  };

  const handleMerge = (pendingItemId) => {
    const pendingItem = penddingSpecializationDetail.find(
      (item) => item.id === pendingItemId
    );
    const selectedSpecId = selectedSpecs[pendingItemId];
    // const selectedSpec = specializationDetail.find(
    //   (spec) => spec.id === parseInt(selectedSpecId)
    // );
    setTargetSpecialzation(pendingItem);
    // setSourceSpecialization(selectedSpec)
    setModelMerge(true);
  };
  const onSubmitMerge = async () => {
    if (sourceSpecialization?.name && !targetSpecialzation?.name) {
      return;
    }

    try {
      const payload = {
        source_specialization: sourceSpecialization?.name,
        target_specialzation: targetSpecialzation?.name,
      };
      const response = await postData(
        `MasterPanel/merge-specialization/`,
        payload
      );
      if (response.status == 201) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        await getPenddingSpecializationList();
        setModelMerge(false);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  useEffect(() => {
    getspecializationList();
    getPenddingSpecializationList();
  }, []);

  return (
    <>
      <div className="rightContent rightsidefull">
        <div className="row h-100">
          <div className="col-md-12">
            <div className="padding-inner border-radius-20 bg-white h-100">
              <div className="d-flex align-items-center justify-content-end gap-5 mb-4">
                <a
                  href="#"
                  onClick={() => setActiveTab("Exciting Specialization")}
                >
                  {t("superadmin.existing-specialization")}
                </a>
                <a
                  href="#"
                  onClick={() => setActiveTab("Pending Specialization")}
                >
                  {t("superadmin.all-pending-specialization")}
                </a>
                <a>
                  <img
                    src="../images/folder.svg"
                    onClick={() => setShowModal(true)}
                  />
                </a>
              </div>

              {activeTab === "Exciting Specialization" && (
                <div className="mediaDegestPart">
                  <table border="1">
                    <thead>
                      <tr>
                        <th>{t("prescription.name")}</th>
                        <th>{t("add-education.description")}</th>
                        <th>{t("superadmin.created-date")}</th>
                        <th>{t("superadmin.action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {specializationDetail?.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.description}</td>
                          <td>{item?.created_date}</td>
                          <td>
                            <div className="skillEdit justify-content-center">
                              <a href="#" onClick={() => handleEdit(item)}>
                                <img
                                  src="../images/edit-skill.webp"
                                  alt="Edit"
                                />
                              </a>
                              <a
                                href="#"
                                onClick={(e) =>
                                  deleteSpecialization(item.id, e)
                                }
                              >
                                <img
                                  src="../images/doctor-dashboard/delete-icon1.png"
                                  alt="Delete"
                                />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "Pending Specialization" && (
                <div className="mediaDegestPart">
                  <table border="1">
                    <thead>
                      <tr>
                        <th>{t("prescription.name")}</th>
                        <th>{t("superadmin.doctor-name")}</th>
                        <th>{t("superadmin.created-date")}</th>
                        <th>{t("superadmin.action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {penddingSpecializationDetail?.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center" }}>
                            {t("superadmin.no-pending-specialization")}
                          </td>
                        </tr>
                      ) : (
                        penddingSpecializationDetail?.map((item) => (
                          <tr key={item?.id}>
                            <td>{item?.name}</td>
                            <td>{item?.doctor_name}</td>
                            <td>{item?.created_date}</td>
                            <td>
                              <div className="d-flex w-100 gap-3 justify-content-center">
                                <button
                                  className="blue_btn"
                                  onClick={() => handleApprove(item?.id)}
                                >
                                  {t("superadmin.approved")}
                                </button>
                                <button
                                  className="blue_btn"
                                  onClick={() => handleMerge(item?.id)}
                                >
                                  {t("superadmin.merge")}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={modelApproved}
        backdrop="static"
        keyboard={false}
        onHide={() => setModelApproved(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          {t("superadmin.approve-new-specialization")}
        </Modal.Header>
        <Modal.Body>
          <div className="p-4 bg-white shadow-md rounded-lg w-80 text-left">
            <p> {t("superadmin.new-specialization")}</p>
            <p>
              {t("superadmin.specialization-name")} : {specializationName?.name}
            </p>
            <p>
              {t("superadmin.interventional-name")} :
              {specializationName?.doctor_name}
            </p>
            <div className="gap-2 justify-content-center d-flex w-auto mx-auto">
              <button
                type="submit"
                className="blue_btn "
                onClick={onSubmitApprove}
              >
                {t("common.save")}
              </button>
              <button
                type="button"
                className="blue_btn"
                onClick={() => setModelApproved(false)}
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={modelMerge}
        backdrop="static"
        keyboard={false}
        onHide={() => setModelMerge(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          {t("superadmin.merge-new-specialization")}
        </Modal.Header>
        <Modal.Body>
          <div className="p-4 bg-white shadow-md rounded-lg w-80">
            <div className="d-flex flex-column gap-2 text-left">
              <p>{t("superadmin.new-specialization")}</p>
              <p>
                {t("superadmin.specialization-name")}:
                {targetSpecialzation?.name}
              </p>
              <p>
                {t("superadmin.interventional-name")} :
                {targetSpecialzation?.doctor_name}
              </p>
            </div>
            <div className="d-flex gap-2 align-items-center mb-4">
              <label htmlFor="specialization">
                {t("superadmin.source-specialization")}
              </label>
              <select
                id="specialization"
                value={sourceSpecialization?.id || ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedSpec = specializationDetail.find(
                    (spec) => spec.id === parseInt(selectedId)
                  );
                  setSourceSpecialization(selectedSpec);
                }}
              >
                <option value="">
                  {t("superadmin.select-specialization")}
                </option>
                {specializationDetail?.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="gap-2 justify-content-center d-flex w-auto mx-auto">
              <button
                type="submit"
                className="blue_btn "
                onClick={onSubmitMerge}
              >
                {t("common.save")}
              </button>
              <button
                type="button"
                className="blue_btn"
                onClick={() => setModelMerge(false)}
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <AddSpecializationModel
        setShowModal={setShowModal}
        showModal={showModal}
        getspecializationList={getspecializationList}
      />
      <EditSpecializationModel
        setShowEditModal={setShowEditModal}
        showEditModal={showEditModal}
        getspecializationList={getspecializationList}
        editDetails={editDetails}
      />
    </>
  );
}

export default Specialization;
