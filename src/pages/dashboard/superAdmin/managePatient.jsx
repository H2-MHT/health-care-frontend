import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { postData } from "../../../hooks/services/services";
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
  const [totalPages,setTotalPages]=useState(1);

  const itemsPerPage = 5;

  const fetchPatientList = async () => {
    setLoading(true);
    const fetchUrl = `MasterPanel/user_list/?page=${currentPage}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
      query
    )}`;
    try {
      const response = await postData(fetchUrl, { role: "Patient" });

      if (!response.ok) throw new Error("Fetching Patient List Failed");
      const getData = await response.json();
      console.log("data", getData);
      setPatientList(getData);
    } catch (error) {
      console.error("Fetch Patient List Error: ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // const viewPatientDetail = async (id) => {
  //   navigate('/superadmin/patient-info');
  //   const viewUrl = `${url}detail/${id}/`;

  //   try {
  //     const response = await postData(viewUrl, { role: "Patient" });
  //     if (!response.ok) throw new Error("Fetching Patient Details Failed");

  //     const getData = await response.json();
  //     console.log(getData);
  //   } catch (error) {
  //     console.error("Fetching Patient Details Error: ", error);
  //     throw error;
  //   }
  // };

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
        {/* <div class="sorting">
          <select>
            <option>{t("superadmin.sort-by")}</option>
            <option>{t("superadmin.sort-by")}</option>
          </select>
        </div> */}
        {/* <a
          href="#"
          className="blue_btn"
          style={{ height: "56px" }}
          onClick={() => setOpenPatientForm(true)}
        >
          Add +
        </a> */}
      </div>

      <div className="adminDetails padding-20 bg-white border-radius-20">
        <table>
          <thead>
            <tr>
              <th>{t("superadmin.profile-photo")}</th>
              <th>{t("superadmin.patient-name")}</th>
              <th>{t("edit-profile.phone-number")}</th>
              <th>{t("edit-profile.country")}</th>
              <th>{t("superadmin.action")}</th>
            </tr>
          </thead>
          <tbody>
            {patientList &&
              patientList.map((patient) => {
                return (
                  <tr key={patient.id}>
                    <td>
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
                    </td>
                    <td>
                      {patient.first_name} {patient.last_name}
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
          </tbody>
        </table>
      </div>
      {/* {openPatientForm && <AddPatient open={openPatientForm} setOpen={setOpenPatientForm}/>} */}
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
