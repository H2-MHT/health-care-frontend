import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchData,
  fetchDataAuth,
  postData,
} from "../../../hooks/services/services";
import PopUp from "./popUp";
import Pagination from "../../../components/pagination/pagination";
import { Loader } from "../../../components/ui/loader/loader";
import { useTranslation } from "react-i18next";
     
const ManageClinic = () => {
  const { t } = useTranslation();
  const [clinicList, setClinicList] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [functionType, setFunctionType] = useState("");
  const [userObject, setUserObject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClinicList(currentPage, query);
  }, [currentPage]);

  const itemsPerPage = 5;

  const fetchClinicList = async (page = 1, searchQuery = "") => {
    setLoading(true);
    const fetchUrl = `MasterPanel/user_list/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
      searchQuery
    )}&role=Clinic`;
    try {
      const response = await fetchDataAuth(fetchUrl);

      if (!response.ok) throw new Error("Fetching Doctor List Failed");
      const totalPagesHeader = response.headers.get("Total-Pages");
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
      const getData = await response.json();
      setClinicList(Array.isArray(getData?.data) ? getData.data : []);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Fetch Doctor List Error: ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const blockClinic = (clinic) => {
    if (clinic.is_active === true) setFunctionType("Block");
    else setFunctionType("Unblock");
    setOpenPopUp(true);
    setUserObject(clinic);
  };

  const deleteClinic = (clinic) => {
    setOpenPopUp(true);
    setFunctionType("Delete");
    setUserObject(clinic);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      fetchClinicList();
    }
  };

  const searchButtonClicked = () => {
    setCurrentPage(1);
    fetchClinicList();
  };

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
              <th>{t("clinic-signup.clinic-name")}</th>
              <th>{t("edit-profile.phone-number")}</th>
              <th>{t("superadmin.website-link")}</th>
              <th>{t("superadmin.action")}</th>
            </tr>
          </thead>
          <tbody>
            {clinicList &&
              clinicList.map((clinic) => {
                return (
                  <tr key={clinic.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div class="profile-photo">
                          <img
                            src={
                              clinic?.profile_picture
                                ? clinic.profile_picture
                                : "../images/sample.png"
                            }
                            alt="profile_photo"
                          />
                        </div>
                        <td>{clinic.name}</td>
                      </div>
                    </td>

                    <td>{clinic.phone_number
                    }</td>
                    <td>{clinic.website}</td>
                    <td>
                      <div className="actions">
                        <Link
                          to={`/superadmin/clinic-info/${clinic.id}`}
                          className="tooltip2"
                          data-tooltip="View Clinic"
                        >
                          <img src="../images/eye.webp" />
                        </Link>
                        <a
                          href="#"
                          className="tooltip2"
                          onClick={() => blockClinic(clinic)}
                          data-tooltip={
                            clinic.is_active ? "Block Clinic" : "Unblock Clinic"
                          }
                        >
                          <img
                            src={
                              clinic.is_active
                                ? "../images/unblock-user.png"
                                : "../images/block-user.png"
                            }
                          />
                        </a>
                        <a
                          href="#"
                          className="tooltip2"
                          onClick={() => deleteClinic(clinic)}
                          data-tooltip="Delete Clinic"
                        >
                          <img src="../images/deleteBlack.webp" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
               {clinicList?.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                  No clinic available
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
          userType="Clinic"
          userObject={userObject}
          callFetch={fetchClinicList}
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

export default ManageClinic;
