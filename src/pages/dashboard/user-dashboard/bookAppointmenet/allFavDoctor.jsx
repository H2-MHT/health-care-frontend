import React, { useState, useEffect } from "react";
import {
  deleteData,
  fetchData,
  postData,
} from "../../../../hooks/services/services";
import { Link } from "react-router-dom";
import { paymentSortBy } from "../../../../utils/constants";
import Select from "../../../../components/form/Select";
import Image from "../../../../components/form/Image";
import { Loader } from "../../../../components/ui/loader/loader";
import { showToast } from "../../../../utils/toast";
import AppointmentModal from "../../../patient/appointment/appointmentModal";
import Pagination from "../../../../components/pagination/pagination";
import { useTranslation } from "react-i18next";


const AllDoctorList = () => {
  const { t } = useTranslation();
  const [doctorList, setDoctorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoriteDoctors, setFavoriteDoctors] = useState({}); // Track favorites per doctor
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [selectedDoctorAppointement, setSelectedDoctorAppointement] =
    useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [query, setquery] = useState("");

  const PaginatedFavDoctorList = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await fetchData(
        `patient/fav-doctor/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
          searchQuery
        )}`
      );
      const totalPagesHeader = response.headers.get("Total-Pages");
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
      const getData = await response.json();
      const formattedDoctors = Array.isArray(getData?.data) 
      ? getData.data.map(fav => ({
          id: fav.fav_doc.id,
          first_name: fav.fav_doc.user.first_name,
          last_name: fav.fav_doc.user.last_name,
          email: fav.fav_doc.user.email,
          gender: fav.fav_doc.user.gender,
          city: fav.fav_doc.user.city,
          country: fav.fav_doc.user.country,
          rating: fav.fav_doc.user.rating,
          bio : fav.fav_doc.user.bio,
          specialty: fav.fav_doc.specialty,
          profile_picture :fav?.fav_doc?.user?.profile_picture
        })) 
      : [];
   console.log(">>>>>>DOCT",formattedDoctors)
    setDoctorList(formattedDoctors);
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
      PaginatedFavDoctorList(1, query);
    }
  };
  useEffect(() => {
    PaginatedFavDoctorList(currentPage);
  }, [currentPage]);

  // const getDoctorList = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetchData("patient/fav-doctor/");
  //     if (!response.ok) throw new Error("Failed to fetch favorite doctors.");

  //     const getData = await response.json();
  //     const favoriteDoctorsList = Array.isArray(getData?.data)
  //       ? getData.data
  //       : [];

  //     const favoriteDoctorMap = {};
  //     const filteredDoctors = favoriteDoctorsList.map((fav) => {
  //       favoriteDoctorMap[fav.fav_doc.id] = true;
  //       return {
  //         ...fav.fav_doc,
  //         isFavorite: true,
  //       };
  //     });

  //     setFavoriteDoctors(favoriteDoctorMap);
  //     setDoctorList(filteredDoctors);
  //   } catch (error) {
  //     console.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleToggleFavorite = async (id) => {
    const isFav = !!favoriteDoctors[id];
    await removeDoctorFromFavorites(id);
    setFavoriteDoctors((prev) => ({
      ...prev,
      [id]: !isFav,
    }));
  };

  const addDoctorToFavorites = async (id) => {
    try {
      const payload = { fav_doc: id };
      const response = await postData("patient/favourite/", payload);

      if (response.status === 201) {
        let responseData = await response.json();
        showToast(responseData.message, "success");

        // Fetch the updated doctor details and add to the list
        const updatedDoctor = responseData?.data?.fav_doc; // Assuming API returns the doctor data

        if (updatedDoctor) {
          setDoctorList((prevList) => [
            ...prevList,
            { ...updatedDoctor, isFavorite: true },
          ]);
          setFavoriteDoctors((prev) => ({
            ...prev,
            [updatedDoctor.id]: true,
          }));
        }
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const removeDoctorFromFavorites = async (id) => {
    console.log(">>>>>>>>>>>iddddddd", id)
    try {
      const payload = { fav_doc: id };
      const response = await deleteData(`patient/favourite/`, payload);

      if (response.ok) {
        showToast("Doctor removed from favorites", "success");

        setDoctorList((prevList) =>
          prevList.filter((doctor) => doctor.id !== id)
        );
        setFavoriteDoctors((prev) => {
          const updatedFavorites = { ...prev };
          delete updatedFavorites[id]; // Ensure the heart icon updates correctly
          return updatedFavorites;
        });
      } else {
        showToast("Failed to remove favorite", "error");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  useEffect(() => {
    //getDoctorList();
    PaginatedFavDoctorList();
  }, []);

  const makeAppointment = (item) => {
    setShowFirstModal(true);
    setSelectedDoctorAppointement(item);
  };
console.log(doctorList,'>>>doctorList')
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="rightContent rightsidefull">
          <div className="profileMobile">
            <div className="nameMobile">Hello, Dr. Ava Williams!</div>
            <div className="profileImgMobile">
              <img
                src="images/profile-sample.png"
                className="img-fluid"
                alt="profile"
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
                <img src="../images/search-dark.svg" alt="search" />
              </a>
            </div>
            {/* <div className="sorting">
              <Select options={paymentSortBy} />
            </div> */}
          </div>

          <div className="clinic_doc_list bg-white-transparent border-radius-20 padding-20">
            <div className="recomend">
              {doctorList.length > 0 ? (
                doctorList.map((item) => (
                  <div className="Docbox" key={item?.id}>
                    <div className="recomendBox">
                      <div className="clinicDocMain d-flex gap-3">
                        <div className="left">
                          <img
                            src={"/images/purple.svg"}
                            alt="Favorite Toggle"
                            onClick={() => handleToggleFavorite(item.id)}
                            style={{ cursor: "pointer" }}
                            className="heartImg img-fluid"
                          />
                          <div className="docrecomdpart">
                            <div className="docImg">
                              <img
                                src="../images/flag.svg"
                                className="docflag"
                                alt="flag"
                              />
                              <Image
                                src={item?.profile_picture}
                                className="dc-img"
                              />
                            </div>
                            <div className="drRdetail">
                              <div className="top">
                                <div className="verified">
                                  <img src="../images/batch.svg" alt="batch" />
                                  {t("all-doctor-list.generalist")}
                                  <span className="main-blue-text">
                                    {item?.expertise}
                                  </span>
                                </div>
                              </div>
                              <div className="recondName">
                                Dr. {item?.first_name} {item?.last_name}
                              </div>
                              <div className="clinicLoca d-flex align-items-center gap-2">
                                <img src="../images/mappin.svg" alt="map pin" />
                                <span className="text-green">
                                  {item?.country}
                                </span>
                              </div>
                              <div className="d-flex gap-2">
                                {Array.isArray(item?.languages) &&
                                  item.languages.map((lang, langIndex) => (
                                    <div className="langSpeak" key={langIndex}>
                                      <span>{lang.title}</span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="right">
                          <div className="greenimg">
                            <img
                              src="../images/general-medicine.svg"
                              alt="medicine"
                            />
                            <span>{item?.specialty}</span>
                          </div>
                          <div className="bStar d-flex align-items-center gap-2">
                            <img src="../images/black-star.svg" alt="star" />
                            <span className="text-black">{item?.rating}</span>
                          </div>
                        </div>
                      </div>
                      <p>{item?.bio}</p>
                      <div className="doclistBtn2 d-flex justify-content-end gap-3">
                        <Link
                          to="/patient/userview"
                          state={{ doctor: item }}
                          className="transparent_btn"
                        >
                          {t("all-doctor-list.more-info")}
                        </Link>
                        <span
                          className="blue_btn"
                          onClick={() => makeAppointment(item)}
                        >
                          {t("all-doctor-list.make-appointment")}{" "}
                        </span>
                      </div>
                    </div>
                    <div className="viewFullSchdl">
                      {t("all-doctor-list.view-full-schedules")}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">{t("all-doctor-list.no-doctors-found")}</div>
              )}
            </div>
          </div>

          {doctorList.length > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}

          {showFirstModal && (
            <AppointmentModal
              setShowFirstModal={setShowFirstModal}
              showFirstModal={showFirstModal}
              selectedDoctorAppointement={selectedDoctorAppointement}
            />
          )}
        </div>
      )}
    </>
  );
};

export default AllDoctorList;
