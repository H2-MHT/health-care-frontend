import React, { useState, useEffect } from "react";
import { fetchDataPublic } from "../../hooks/services/services";
import { Link } from "react-router-dom";
import { paymentSortBy } from "../../utils/constants";
import Select from "../../components/form/Select";
import Image from "../../components/form/Image";
import { Loader } from "../../components/ui/loader/loader";
import Pagination from "../../components/pagination/pagination.js";
import Header from "../../components/ui/header/header";
import { Footer } from "../../components/ui/footer/footer.js";

const AllDoctorPublic = () => {
  const [allDoctorList, setAllDoctorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const itemsPerPage = 5;

  const PaginatedDoctorList = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await fetchDataPublic(
        `doctors/public-doctor-list/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
          searchQuery
        )}`
      );
      const totalPagesHeader = response.headers.get("Total-Pages");
      console.log("Full Headers:", [...response.headers.entries()]);
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
      const getData = await response.json();
      setAllDoctorList(Array.isArray(getData?.data) ? getData.data : []);
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
      PaginatedDoctorList(1, query);
    }
  };

  useEffect(() => {
    PaginatedDoctorList(currentPage, query);
  }, [currentPage]);

  useEffect(() => {
    PaginatedDoctorList();
  }, []);

  //   const makeAppointment = (item) => {
  //     setShowFirstModal(true);
  //     setSelectedDoctorAppointement(item);
  //   };

  return (
    <>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <div className="rightContent p-5 backgroundImage">
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
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <a href="#">
                <img src="../images/search-dark.svg" alt="search" />
              </a>
            </div>
            <div className="sorting">
              <Select options={paymentSortBy} />
            </div>
          </div>

          <div className="clinic_doc_list bg-white-transparent border-radius-20 padding-20">
            <div className="recomend">
              {allDoctorList.length > 0 ? (
                allDoctorList.map((item) => (
                  <div className="Docbox" key={item?.id}>
                    <div className="recomendBox">
                      <div className="clinicDocMain d-flex gap-3">
                        <div className="left paddingLeftt">
                          <div className="docrecomdpart">
                            <div className="docImg">
                              <img
                                src="../images/flag.svg"
                                className="docflag"
                                alt="flag"
                              />
                              <Image src={item?.profile_picture} />
                            </div>
                            <div className="drRdetail">
                              <div className="top">
                                <div className="verified">
                                  <img src="../images/batch.svg" alt="batch" />
                                  Generalist 
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
                      {console.log(item,">>>item")}
                      <div className="doclistBtn2 d-flex justify-content-end gap-3">
                      <span className="transparent_btn">Urgent hourly rate : &nbsp; <span className ="fw-bold"> {item?.urgent_hourly_rate} </span></span>
                      <span className="transparent_btn">Planned hourly rate : &nbsp; <span className ="fw-bold">{item?.planned_hourly_rate}</span></span>
                        <Link
                          to="/public-doctor-view"
                          state={{ doctor: item }}
                          className="transparent_btn"
                        >
                          More Info
                        </Link>
                        {/* <span
                          className="blue_btn"
                          onClick={() => makeAppointment(item)}
                        >
                          Make Appointment{" "}
                        </span> */}
                      </div>
                    </div>
                    <div className="viewFullSchdl">View full schedules</div>
                  </div>
                ))
              ) : (
                <div>No Doctors Found</div>
              )}
            </div>
          </div>
          {/* <AppointmentModal
            setShowFirstModal={setShowFirstModal}
            showFirstModal={showFirstModal}
            selectedDoctorAppointement={selectedDoctorAppointement}
          /> */}

          {allDoctorList.length > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
      <Footer />
    </>
  );
};

export default AllDoctorPublic;
