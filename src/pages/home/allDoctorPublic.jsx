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
import Flag from "react-world-flags";
import { Country } from "country-state-city";
import { useTranslation } from "react-i18next";
const countryCodeMap = Object.fromEntries(
  Country.getAllCountries().map((country) => [
    country.name.toLowerCase(),
    country.isoCode,
  ])
);

const AllDoctorPublic = () => {
  const { t } = useTranslation();
  const [allDoctorList, setAllDoctorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const itemsPerPage = 6;

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
        <div className="rightContent rightsidefull p-5 backgroundImage">
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
            {/* <div className="sorting">
              <Select options={paymentSortBy} />
            </div> */}
          </div>

          <div className="clinic_doc_list bg-white-transparent border-radius-20 padding-20">
            <div className="recomend row g-4">
              {allDoctorList.length > 0 ? (
                allDoctorList.map((item) => {
                  const countryName = item?.country?.toLowerCase?.();
                  const countryCode = countryCodeMap[countryName] || "fr";

                  return (
                    <div className="Docbox col-lg-4 col-md-6" key={item?.id}>
                      <div className="recomendBox my-0">
                        <div className="clinicDocMain d-flex gap-3">
                          <div className="left paddingLeftt">
                            <div className="docrecomdpart">
                              <div className="docImg">
                                <Flag code={countryCode} className="docflag" />
                                <Image src={item?.profile_picture} />
                              </div>

                              <div className="drRdetail">
                                <div className="recondName">
                                  Dr. {item?.first_name} {item?.last_name}
                                </div>
                                <div className="top">
                                  <div className="verified">
                                    {item?.speciality } |{" "}
                                    {item?.experience_years || 0} years of experience
                                    <span className="main-blue-text">
                                      {item?.expertise}
                                    </span>
                                  </div>
                                </div>
                                <div className="clinicLoca d-flex align-items-center gap-2">
                                  <img
                                    src="../images/mappin.svg"
                                    alt="map pin"
                                  />
                                  <span className="text-green">
                                    {item?.country || "France"}
                                  </span>
                                </div>

                                <div className="d-flex gap-2">
                                  {Array.isArray(item?.languages) &&
                                    item.languages.map((lang, langIndex) => (
                                      <div
                                        className="langSpeak"
                                        key={langIndex}
                                      >
                                        <span>{lang.title}</span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="right">
                            <div className="bStar d-flex align-items-center gap-2">
                              <img src="../images/black-star.svg" alt="star" />
                              <span className="text-black">{item?.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex justify-content-around ">
                          <div className="mt-4 mb-2">
                            <div className="consult">
                              Planned Consultation :{item?.planned_hourly_rate||"0.00"}
                            </div>
                          </div>

                          <div className="d-flex flex-column gap-2 align-items-center justify-content-center">
                            <Link
                              to="/public-doctor-view"
                              state={{ doctor: item }}
                              className="transparent_btn"
                            >
                              {t("all-doctor-list.more-info")}
                            </Link>
                            {console.log(item)}
                            <Link
                              to={"/login"}
                              className="blue_btn text-center px-2"
                            >
                              {t("all-doctor-list.make-appointment")}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>{t("all-doctor-list.no-doctors-found")}</div>
              )}
            </div>
          </div>

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
