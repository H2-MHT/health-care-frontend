import React, { useEffect, useState } from "react";
import "./userdashboard.css";
import {
  deleteWithPayload,
  fetchData,
  fetchDataAuth,
  fetchDataPublic,
  postData,
} from "../../../hooks/services/services";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/toast";
import Pagination from "../../../components/pagination/pagination";
import { useTranslation } from "react-i18next";

const AllClinic = () => {
   const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clinicDetails, setClinicDetails] = useState([]);
  const [favoriteClinics, setFavoriteClinics] = useState({});
  const [allClinicList, setAllClinicList] = useState([]);
  const [favoriteClinicList, setFavoriteClinicList] = useState({});
  const [query, setquery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);

  const PaginatedClinicList = async (page = 1, searchQuery = "") => {
    setLoading(true);

    const url = `clinics/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
      searchQuery
    )}`;

    try {
      const response = await fetchDataAuth(url, navigate);
      const totalPagesHeader = response.headers.get("Total-Pages");
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
      const getData = await response.json();
      setClinicDetails(Array.isArray(getData?.data) ? getData.data : []);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1); 
      PaginatedClinicList(1, query); 
    }
  };
  useEffect(() => {
    PaginatedClinicList(currentPage, query);
  }, [currentPage]);

  useEffect(() => {
    getFavouriteClinic();
    //  getClinicList();
    PaginatedClinicList();
    getFavClinic();
  }, []);

  useEffect(() => {
    if (!clinicDetails || !favoriteClinicList || !favoriteClinicList?.length)
      return;
    const updatedDoctors = clinicDetails?.map((doctor) => ({
      ...doctor,
      favourite: favoriteClinicList?.some(
        (favDoctor) => favDoctor?.fav_clinic?.id === doctor?.id
      ),
    }));
    setAllClinicList(updatedDoctors);
  }, [clinicDetails, favoriteClinicList]);

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
        throw new Error("Failed to remove clinic from favorites."); // Handle failed requests
      }
      const responseData = await response.json(); // Extract JSON response
      setFavoriteClinics((prev) => ({ ...prev, [id]: false })); // Unmark clinic as favorite
      showToast(responseData.message, "sucess");
      getFavClinic();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  // const getClinicList = async () => {
  //   try {
  //     const response = await fetchDataAuth("clinics/");
  //     if (!response.ok) throw new Error("Failed to fetch data.");
  //     const data = await response.json();
  //     setClinicDetails(data.data);
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  const getFavClinic = async () => {
    try {
      const response = await fetchDataAuth("patient/fav-clinic/",navigate);
      if (!response.ok) throw new Error("Failed to fetch data.");
      const data = await response.json();
      // setClinicDetails(data);
      setFavoriteClinicList(data?.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getFavouriteClinic = async () => {
    setLoading(true);
    try {
      const response = await fetchData("patient/favourite/",navigate);
      if (!response.ok) throw new Error("Failed to fetch favorites.");
      const favoriteData = await response.json();

      const favoritesMap = {};
      favoriteData?.forEach((fav) => {
        favoritesMap[fav.fav_clinic] = true; // Mark clinics that are favorites
      });

      setFavoriteClinics(favoritesMap);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
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
            placeholder="Search"
            value={query}
            onChange={(e) => setquery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <a href="#">
            <img src="../images/search-dark.svg" alt="Search" />
          </a>
        </div>
        {/* <div className="sorting">
          <select>
            <option>Sort by</option>
            <option>Sort by</option>
          </select>
        </div> */}
      </div>
      <div className="favClinic">
        <div className="row g-4">
          {clinicDetails?.length > 0 ? (
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
                          favoriteClinics[item.id] || item?.favourite
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
                      {/* <img src="../images/user-dashboard/flag.svg" alt="Flag" /> */}
                    </div>
                    <p>{item?.public_name}</p>
                    <div className="d-flex align-items-center justify-content-between">
                      {/* <div className="blckLangs">
                        En{" "}
                        <img
                          src="../images/user-dashboard/flag.svg"
                          alt="Flag"
                        />
                      </div> */}
                      <Link
                        className="transparent_btn "
                        to="/patient/FavClinicPublicView"
                        state={{ clinic: item }}
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
        {allClinicList.length > 0 && (
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

export default AllClinic;
