import React, { useState, useEffect } from "react";
import { fetchDataAuth, fetchDataPublic } from "../../hooks/services/services";
import { Link, useNavigate } from "react-router-dom";
import { paymentSortBy } from "../../utils/constants";
import Select from "../../components/form/Select";
import Image from "../../components/form/Image";
import { Loader } from "../../components/ui/loader/loader";
import Pagination from "../../components/pagination/pagination.js";
import Header from "../../components/ui/header/header";
import Flag from "react-world-flags";
import { Country } from "country-state-city";
import { useTranslation } from "react-i18next";
import { Footer } from "../dashboard/doctor-dashboard/footer/footer.jsx";
const countryCodeMap = Object.fromEntries(
  Country.getAllCountries().map((country) => [
    country.name.toLowerCase(),
    country.isoCode,
  ])
);

const AllDoctorPublic = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [allDoctorList, setAllDoctorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
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

  const getLanguageData = async () => {
    try {
      const response = await fetchDataAuth("clinics/languages", navigate);
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      const formattedData = getData?.map((item) => ({
        name: item.title,
        id: item.id,
      }));
      setLanguageOptions(formattedData);
    } catch (error) {
      console.log(error.message);
    }
  };
  const doctorsWithLanguageNames = allDoctorList?.map((doctor) => {
    const languageNames = doctor?.languages
      ?.map((id) =>
        languageOptions?.find((lang) => String(lang.id) === String(id))
      )
      .filter(Boolean)
      .map((lang) => lang.name);

    return {
      ...doctor,
      languages: languageNames,
    };
  });
  useEffect(() => {
    PaginatedDoctorList(currentPage, query);
  }, [currentPage]);

  useEffect(() => {
    PaginatedDoctorList();
    getLanguageData();
  }, []);

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
              {doctorsWithLanguageNames.length > 0 ? (
                doctorsWithLanguageNames.map((item) => {
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
                                    {item?.speciality} |{" "}
                                    {item?.experience_years || 0} years of
                                    experience
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

                                <div className="language-container d-flex gap-2 langAll">
                                  {item?.languages?.map((lang, langIndex) => (
                                    <div className="langSpeak" key={langIndex}>
                                      <span className="languageSpeak">
                                        {lang}
                                      </span>
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
                              <span>
                                {item?.specialty || "General Medicine"}
                              </span>
                            </div>
                            <div className="bStar d-flex align-items-center gap-2">
                              <img src="../images/black-star.svg" alt="star" />
                              <span className="text-black">{item?.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mt-3 ">
                          <div className="mt-2 mb-2">
                            <div className="consult">
                              Consultation fee :{" "}
                              {item?.planned_hourly_rate || "0.00"}
                            </div>
                          </div>

                          <div className="d-flex  gap-2 align-items-center justify-content-center">
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
