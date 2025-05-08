import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postData } from "../../../hooks/services/services";
import PopUp from "./popUp";
import Pagination from "../../../components/pagination/pagination";
import { Loader } from "../../../components/ui/loader/loader";
import { useTranslation } from "react-i18next";


const ManageDoctors = () => {
  const { t } = useTranslation();
  const [doctorList, setDoctorList] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [functionType, setFunctionType] = useState("");
  const [userObject, setUserObject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDoctorList();
  }, []);

  const itemsPerPage = 5;

  const fetchDoctorList = async () => {
    setLoading(true);
    const fetchUrl = `MasterPanel/user_list/?page=${currentPage}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
      query
    )}`;
    try {
      const response = await postData(fetchUrl, { role: "Doctor" });

      if (!response.ok) throw new Error("Fetching Doctor List Failed");

      const getData = await response.json();
      // console.log('doctor data',getData);
      setDoctorList(getData);
    } catch (error) {
      console.error("Fetch Doctor List Error: ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const blockDoctor = (doctor) => {
    if (doctor.is_active === true) setFunctionType("Block");
    else setFunctionType("Unblock");
    setOpenPopUp(true);
    setUserObject(doctor);
  };

  const deleteDoctor = (doctor) => {
    setOpenPopUp(true);
    setFunctionType("Delete");
    setUserObject(doctor);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      fetchDoctorList();
    }
  };

  const searchButtonClicked = () => {
    setCurrentPage(1);
    fetchDoctorList();
  };

  // const viewDoctorDetail = async (id) => {
  //   const viewUrl = `${url}detail/${id}/`;

  //   try {
  //     const response = await postData(viewUrl, { role: "Doctor" });
  //     if (!response.ok) throw new Error("Fetching Doctor Details Failed");

  //     const getData = await response.json();
  //     console.log(getData);
  //   } catch (error) {
  //     console.error("Fetching Doctor Details Error: ", error);
  //     throw error;
  //   }
  // };

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
        <div class="sorting">
          <select>
            <option>{t("superadmin.sort-by")}</option>
            <option>{t("superadmin.sort-by")}</option>
          </select>
        </div>
        {/* <a href="#" className="blue_btn" style={{ height: "56px" }}>
          Add +
        </a> */}
      </div>

      <div className="adminDetails padding-20 bg-white border-radius-20">
        <table>
          <thead>
            <tr>
              <th>{t("superadmin.profile-photo")}</th>
              <th>{t("superadmin.doctor-name")}</th>
              <th>{t("superadmin.speciality")}</th>
              <th>{t("edit-profile.country")}</th>
              <th>{t("superadmin.action")}</th>
            </tr>
          </thead>
          <tbody>
            {doctorList &&
              doctorList.map((doctor) => {
                return (
                  <tr key={doctor.id}>
                    <td>
                      <div class="profile-photo">
                        <img
                          src={
                            doctor?.profile_picture
                              ? doctor.profile_picture
                              : "../images/sample.png"
                          }
                          alt="profile_photo"
                        />
                      </div>
                    </td>
                    <td>
                      <Link
                        to="/superadmin/document/verification"
                        state={{ doctor: doctor }}
                      >
                        {doctor.first_name} {doctor.last_name}
                      </Link>
                    </td>
                    <td>{doctor.speciality}</td>
                    <td>{doctor.country}</td>
                    <td>
                      <div className="actions">
                        <Link
                          to={`/superadmin/doctor-info/${doctor.id}`}
                          className="tooltip2"
                          data-tooltip="View Doctor"
                        >
                          <img src="../images/eye.webp" />
                        </Link>
                        <a
                          href="#"
                          className="tooltip2"
                          onClick={() => blockDoctor(doctor)}
                          data-tooltip={
                            doctor.is_active ? "Block Doctor" : "Unblock Doctor"
                          }
                        >
                          <img
                            src={
                              doctor.is_active
                                ? "../images/unblock-user.png"
                                : "../images/block-user.png"
                            }
                          />
                        </a>
                        <a
                          href="#"
                          className="tooltip2"
                          onClick={() => deleteDoctor(doctor)}
                          data-tooltip="Delete Doctor"
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

      {openPopUp && (
        <PopUp
          open={openPopUp}
          setOpen={setOpenPopUp}
          functionType={functionType}
          userType="Doctor"
          userObject={userObject}
          callFetch={fetchDoctorList}
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

export default ManageDoctors;
