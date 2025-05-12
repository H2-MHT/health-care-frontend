import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchData,
  fetchDataAuth,
  postData,
} from "../../../hooks/services/services";
// import AddPatient from "./addPatient";
import PopUp from "./popUp";
import Pagination from "../../../components/pagination/pagination";
import { Loader } from "../../../components/ui/loader/loader";
import { useTranslation } from "react-i18next";

const ManagePatient = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [patientList, setPatientList] = useState(null);
  const [openPatientForm, setOpenPatientForm] = useState(false);

  const [openPopUp, setOpenPopUp] = useState(false);
  const [functionType, setFunctionType] = useState("");
  const [userObject, setUserObject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchPatientList(currentPage, query);
  }, [currentPage]);

  const fetchPatientList = async (page = 1, searchQuery = "") => {
    setLoading(true);
    const fetchUrl = `MasterPanel/user_list/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
      searchQuery
    )}&role=Patient`;
    try {
      const response = await fetchDataAuth(fetchUrl);

      if (!response.ok) throw new Error("Fetching Doctor List Failed");
      const totalPagesHeader = response.headers.get("Total-Pages");
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
      const getData = await response.json();
      setPatientList(Array.isArray(getData?.data) ? getData.data : []);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Fetch Doctor List Error: ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const blockPatient = (patient) => {
    if (patient.is_active === true) setFunctionType("Block");
    else setFunctionType("Unblock");
    setOpenPopUp(true);
    setUserObject(patient);
  };

  const deletePatient = (patient) => {
    setOpenPopUp(true);
    setFunctionType("Delete");
    setUserObject(patient);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      fetchPatientList();
    }
  };

  const searchButtonClicked = () => {
    setCurrentPage(1);
    fetchPatientList();
  };

  useEffect(() => {
    fetchPatientList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div class="rightContent rightsidefull">
      <div class="sortSearchArea">
        <div class="search">
          <input
            type="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <a href="#" onClick={searchButtonClicked}>
            <img src="../images/search-dark.svg" />
          </a>
        </div>
      </div>

      <div className="adminDetails padding-20 bg-white border-radius-20">
        <table className="doctoradmintable">
          <thead>
            <tr>
              <th>{t("superadmin.patient-name")}</th>
              <th>{t("edit-profile.phone-number")}</th>
              <th>{t("edit-profile.country")}</th>
              <th>{t("superadmin.action")}</th>
            </tr>
          </thead>
          <tbody>
            {patientList &&
              !patientList.map((patient) => {
                return (
                  <tr key={patient.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div class="profile-photo">
                          <img
                            src={
                              patient?.profile_picture
                                ? patient.profile_picture
                                : "../images/sample.png"
                            }
                            alt="profile_photo"
                          />
                        </div>

                        <td>
                          {patient.name}
                        </td>
                      </div>
                    </td>

                    <td>{patient.phone_number}</td>
                    <td>{patient.country}</td>
                    <td>
                      <div className="actions">
                        <Link
                          to={`/superadmin/patient-info/${patient.id}`}
                          className="tooltip2"
                          data-tooltip="View Patient"
                        >
                          <img src="../images/eye.webp" />
                        </Link>
                        <a
                          href="#"
                          className="tooltip2"
                          onClick={() => blockPatient(patient)}
                          data-tooltip={
                            patient.is_active
                              ? "Block Patient"
                              : "Unblock Patient"
                          }
                        >
                          <img
                            src={
                              patient.is_active
                                ? "../images/unblock-user.png"
                                : "../images/block-user.png"
                            }
                          />
                        </a>
                        <a
                          href="#"
                          className="tooltip2"
                          onClick={() => deletePatient(patient)}
                          data-tooltip="Delete Patient"
                        >
                          <img src="../images/deleteBlack.webp" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
               {patientList?.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                  No Patient available
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
      {openPopUp && (
        <PopUp
          open={openPopUp}
          setOpen={setOpenPopUp}
          functionType={functionType}
          userType="Patient"
          userObject={userObject}
          callFetch={fetchPatientList}
        />
      )}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ManagePatient;
