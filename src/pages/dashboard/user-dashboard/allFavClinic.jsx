import React, { useEffect, useState } from "react";
import "./userdashboard.css";
import {
  deleteData,
  deleteWithPayload,
  fetchData,
  fetchDataAuth,
  postData,
} from "../../../hooks/services/services";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/toast";
import Pagination from "../../../components/pagination/pagination";
import { useTranslation } from "react-i18next";

const AllFavClinic = () => {
   const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [clinicDetails, setClinicDetails] = useState([]);
  const [favoriteClinics, setFavoriteClinics] = useState({});
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6; // Set limit per page
  const [query, setquery] = useState("");
  const PaginatedFavClinicList = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await fetchDataAuth(
        `patient/fav-clinic/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
          searchQuery
        )}`
      );
      const totalPagesHeader = response.headers.get("Total-Pages");
      console.log("Full Headers:", [...response.headers.entries()]);
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
      const responseData = await response.json();
      const clinics = responseData?.data?.map((fav) => ({
        ...fav.fav_clinic,
        clinic_status: fav.clinic_status, // Maintain favorite status
      }));
      setClinicDetails(clinics);
      setTotalPages(totalPages);
      const favoritesMap = {};
      clinics.forEach((clinic) => {
        favoritesMap[clinic.id] = true;
      });
      setFavoriteClinics(favoritesMap);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    PaginatedFavClinicList(currentPage, query);
  }, [currentPage]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      PaginatedFavClinicList(currentPage, query);
    }
  };
  useEffect(() => {
    // getFavClinic();
    PaginatedFavClinicList();
  }, []);

  const handleToggle = (id) => {
    if (favoriteClinics[id]) {
      removeFavouriteList(id);
    } else {
      addClinicSubmit(id);
    }
  };

  const addClinicSubmit = async (id) => {
    try {
      const payload = { fav_clinic: id };
      const response = await postData("patient/favourite/", payload);

      if (response.status === 201) {
        let responseData = await response.json();
        setFavoriteClinics((prev) => ({ ...prev, [id]: true }));
        showToast(responseData?.message, "success");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const removeFavouriteList = async (id) => {
    try {
      const payload = { fav_clinic: id };
      const response = await deleteWithPayload("patient/favourite/", payload);

      if (!response.ok) {
        throw new Error("Failed to remove clinic from favorites.");
      }
      const responseData = await response.json();
      setFavoriteClinics((prev) => ({ ...prev, [id]: false }));
      showToast(responseData.message, "success");
      // getFavClinic()
      PaginatedFavClinicList();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  // ----Hemraj

  // const getFavClinic = async () => {
  //   try {
  //     const response = await fetchDataAuth("patient/fav-clinic/");
  //     if (!response.ok) throw new Error("Failed to fetch data.");
  //     const responseData = await response.json();

  //     // Extract clinic details from "fav_clinic"
  //     const clinics = responseData?.data?.map((fav) => ({
  //       ...fav.fav_clinic,
  //       clinic_status: fav.clinic_status, // Maintain favorite status
  //     }));

  //     setClinicDetails(clinics);

  //     // Set all clinics as favorites by default
  //     const favoritesMap = {};
  //     clinics.forEach((clinic) => {
  //       favoritesMap[clinic.id] = true;
  //     });
  //     setFavoriteClinics(favoritesMap);
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  // const getFavouriteClinic = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetchData("patient/favourite/");
  //     if (!response.ok) throw new Error("Failed to fetch favorites.");
  //     const favoriteData = await response.json();

  //     const favoritesMap = {};
  //     favoriteData?.forEach((fav) => {
  //       favoritesMap[fav.fav_clinic] = true;
  //     });

  //     setFavoriteClinics(favoritesMap);
  //   } catch (error) {
  //     console.log(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="rightContent rightsidefull">
      <div className="profileMobile">
        <div className="nameMobile">Hello, Dr. Ava Williams!</div>
        <div className="profileImgMobile">
          <img
            src="images/profile-sample.png"
            className="img-fluid"
            alt="Profile"
          />
        </div>
      </div>

      <div className="sortSearchArea">
        <div className="search">
          <input
            type="search"
            value={query}
            onChange={(e) => setquery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search"
          />
          <a href="#">
            <img src="../images/search-dark.svg" alt="Search" />
          </a>
        </div>
        <div className="sorting">
          <select>
            <option>Sort by</option>
            <option>Sort by</option>
          </select>
        </div>
      </div>

      <div className="favClinic">
        <div className="row g-4">
          {clinicDetails.length > 0 ? (
            clinicDetails?.map((item, index) => (
              <div className="col-lg-4 col-md-6" key={index}>
                <div className="favBox">
                  <img
                    src="../images/user-dashboard/favclinic.svg"
                    className="img-fluid w-100 clinicImg"
                    alt="Clinic"
                  />
                  <div className="favContent">
                    <a className="bookmark">
                      <img
                        src={
                          favoriteClinics[item.id]
                            ? "../images/user-dashboard/bookmark2.webp"
                            : "/images/bookmark.svg"
                        }
                        alt="Favorite Toggle"
                        onClick={() => handleToggle(item.id)}
                      />
                    </a>
                    <div className="bStar d-flex align-items-center gap-2 mb-3">
                      <img
                        src="../images/user-dashboard/black-star.svg"
                        alt="Star"
                      />
                      <span className="text-black ">4.6</span>
                    </div>
                    <h4 className="main-blue-text">{item?.name}</h4>
                    <div className="d-flex align-items-center justify-content-between mt-3">
                      <div className="clinicLoca d-flex align-items-center gap-2">
                        <img
                          src="../images/user-dashboard/mappin.svg"
                          alt="Map Pin"
                        />
                        <span className="text-green">{item?.address}</span>
                      </div>
                      <img src="../images/user-dashboard/flag.svg" alt="Flag" />
                    </div>
                    <p>{item?.public_name}</p>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="blckLangs">
                        En{" "}
                        <img
                          src="../images/user-dashboard/flag.svg"
                          alt="Flag"
                        />
                      </div>
                      <Link
                        className="transparent_btn"
                        to="/patient/FavClinicPublicView"
                        state={{ doctor: item }}
                      >
                        {t("all-doctor-list.more-info")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="clinic_doc_list bg-white-transparent border-radius-20 padding-20">
              <div className="recomend">
                <div> {t("all-doctor-list.no-clinics-found")}</div>
              </div>
            </div>
          )}
        </div>
        {clinicDetails.length > 0 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default AllFavClinic;
