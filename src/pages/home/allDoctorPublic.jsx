import React, { useState, useEffect } from "react";
import { fetchDataPublic } from "../../hooks/services/services";
import { Link, useNavigate } from "react-router-dom";
import Image from "../../components/form/Image";
import { Loader } from "../../components/ui/loader/loader";
import Pagination from "../../components/pagination/pagination.js";
import Header from "../../components/ui/header/header";
import { Country, City } from "country-state-city";
import Flag from "react-world-flags";
import { useTranslation } from "react-i18next";
import { Footer } from "../dashboard/doctor-dashboard/footer/footer.jsx";
import { useForm, Controller } from "react-hook-form";
import AutoSelect from "../../components/form/AutoSelect";

const AllDoctorPublic = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [allDoctorList, setAllDoctorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [speciality, setSpeciality] = useState();
  const [languageOptions, setLanguageOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const itemsPerPage = 6;
  const [filterData, setFilterData] = useState({
    gender: "",
    speciality: "",
    country: "",
  });
  const PaginatedDoctorList = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await fetchDataPublic(
        `doctors/public-doctor-list/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
          searchQuery
        )}&speciality=${filterData?.speciality}&country=${
          filterData?.country
        }&gender=${filterData?.gender}`
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
  const countryCodeMap = Object.fromEntries(
    Country.getAllCountries().map((country) => [
      country.name.toLowerCase(),
      country.isoCode,
    ])
  );
  const { control, watch, setValue } = useForm({});

  const selectedCountry = watch("country");

  useEffect(() => {
    if (selectedCountry) {
      const cityOptions =
        City.getCitiesOfCountry(selectedCountry)?.map((city) => ({
          value: city.name,
          label: city.name,
        })) || [];
      setCities(cityOptions);
      setValue("city", ""); // Reset city when country changes
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      PaginatedDoctorList(1, query);
    }
  };

  const getSpecialization = async () => {
    try {
      const response = await fetchDataPublic("doctors/all-specializations/");
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setSpeciality([
        ...getData?.specializations?.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      ]);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getLanguageData = async () => {
    try {
      const response = await fetchDataPublic("clinics/languages/", navigate);
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

  const filterGender = [
    {
      value: "male",
      label: "Male",
    },
    {
      value: "female",
      label: "Female",
    },
  ];

  useEffect(() => {
    getSpecialization();
    getLanguageData();
  }, []);

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
  }, [currentPage, filterData]);

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

          <div className="favClinic">
            <div className="row g-4">
              <div className="col-md-2 ">
                <div class="filter-sidebar">
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
                  </div>
                  <Controller
                    name="speciality"
                    control={control}
                    render={({ field }) => (
                      <AutoSelect
                        // label="Country"
                        options={speciality}
                        placeholder="Speciality"
                        value={field.value}
                        onChange={(option) => {
                          field.onChange(option?.value); // ✅ update form
                          setFilterData((prev) => ({
                            ...prev,
                            speciality: option?.label, // ✅ update local state
                          }));
                        }}
                        isSearchable={true}
                        class="filter-select"
                      />
                    )}
                  />

                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <AutoSelect
                        // label="Country"
                        options={countryOptions}
                        placeholder="Select Country"
                        value={field.value}
                        onChange={(option) => {
                          field.onChange(option?.label); // ✅ update form
                          setFilterData((prev) => ({
                            ...prev,
                            country: option?.value, // ✅ update local state
                          }));
                        }}
                        isSearchable={true}
                        class="filter-select"
                      />
                    )}
                  />
                  <Controller
                    name="Gender"
                    control={control}
                    render={({ field }) => (
                      <AutoSelect
                        // label="City"
                        options={filterGender}
                        class="filter-select"
                        placeholder="Gender"
                        value={field.value}
                        onChange={(option) => {
                          field.onChange(option?.value); // ✅ update form
                          setFilterData((prev) => ({
                            ...prev,
                            gender: option?.label, // ✅ update local state
                          }));
                        }}
                        isDisabled={!cities.length}
                        isSearchable={true}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-md-10">
                <div className="clinic_doc_list bg-white-transparent border-radius-20 padding-20">
                  <div className="recomend row g-4 col-md-10">
                    {doctorsWithLanguageNames.length > 0 ? (
                      doctorsWithLanguageNames.map((item) => {
                        const countryName = item?.country?.toLowerCase?.();
                        const countryCode = countryCodeMap[countryName] || "fr";

                        return (
                          <div
                            className="Docbox col-lg-4 col-md-6"
                            key={item?.id}
                          >
                            <div className="recomendBox my-0">
                              <div className="clinicDocMain d-flex gap-3">
                                <div className="left paddingLeftt">
                                  <div className="docrecomdpart">
                                    <div className="docImg">
                                      <Flag
                                        code={countryCode}
                                        className="docflag"
                                      />
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
                                        {item?.languages?.map(
                                          (lang, langIndex) => (
                                            <div
                                              className="langSpeak"
                                              key={langIndex}
                                            >
                                              <span className="languageSpeak">
                                                {lang}
                                              </span>
                                            </div>
                                          )
                                        )}
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
                                    <img
                                      src="../images/black-star.svg"
                                      alt="star"
                                    />
                                    <span className="text-black">
                                      {item?.rating}
                                    </span>
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
              </div>
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
