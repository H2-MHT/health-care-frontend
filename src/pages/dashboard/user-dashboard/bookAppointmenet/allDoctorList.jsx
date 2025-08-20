import React, { useState, useEffect } from "react";
import {
  deleteData,
  deleteWithPayload,
  fetchData,
  fetchDataAuth,
  fetchDataPublic,
  postData,
} from "../../../../hooks/services/services";
import { Link, useNavigate } from "react-router-dom";
import Image from "../../../../components/form/Image";
import { Loader } from "../../../../components/ui/loader/loader";
import { showToast } from "../../../../utils/toast";
import AppointmentModal from "../../../patient/appointment/appointmentModal";
import Pagination from "../../../../components/pagination/pagination.js";
import { useTranslation } from "react-i18next";
import { Country } from "country-state-city";
import { useForm, Controller } from "react-hook-form";
import Flag from "react-world-flags";
import AutoSelect from "../../../../components/form/AutoSelect.jsx";

const countryCodeMap = Object.fromEntries(
  Country.getAllCountries().map((country) => [
    country.name.toLowerCase(),
    country.isoCode,
  ])
);

const AllDoctorList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [doctorList, setDoctorList] = useState([]);

  const [allDoctorList, setAllDoctorList] = useState([]);
  const [favDoctorList, setFavDoctorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [speciality, setSpeciality] = useState();
  const [languageOptions, setLanguageOptions] = useState([]);
  const [favoriteDoctors, setFavoriteDoctors] = useState({}); // Track favorites per doctor
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [selectedDoctorAppointement, setSelectedDoctorAppointement] =
    useState();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cities, setCities] = useState([]);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  const initialFilters = {
    gender: "",
    speciality: "",
    country: "",
  };

  const [filterData, setFilterData] = useState(initialFilters);

  const PaginatedDoctorList = async (page = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await fetchData(
        `doctors/get-doctors/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
          searchQuery
        )}&speciality=${filterData?.speciality}&country=${
          filterData?.country
        }&gender=${filterData?.gender}`
      );
      const totalPagesHeader = response.headers.get("Total-Pages");
      console.log("Full Headers:", [...response.headers.entries()]);
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
      const getData = await response.json();
      setDoctorList(Array.isArray(getData?.data) ? getData.data : []);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    getSpecialization();
  }, []);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      PaginatedDoctorList(1, query);
    }
  };
  useEffect(() => {
    PaginatedDoctorList(currentPage, query);
  }, [currentPage, filterData]);

  const { control, watch, setValue } = useForm({});

  const getDoctorList = async () => {
    setLoading(true);
    try {
      const response = await fetchData("doctors/get-doctors/");
      if (!response.ok)
        throw new Error("Failed to fetch data from the server.");

      const getData = await response.json();
      setDoctorList(Array.isArray(getData?.data) ? getData.data : []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
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

  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  useEffect(() => {
    if (!doctorList || !favDoctorList) return;
    const updatedDoctors = doctorList.map((doctor) => ({
      ...doctor,
      favourite: favDoctorList.some(
        (favDoctor) => favDoctor?.fav_doc?.user?.id === doctor.id
      ),
    }));

    setAllDoctorList(updatedDoctors);
  }, [doctorList, favDoctorList]);

  const getFavDoctorList = async () => {
    try {
      const response = await fetchData("patient/fav-doctor/");
      if (!response.ok) throw new Error("Failed to fetch favorite doctors.");
      const getData = await response.json();
      setFavDoctorList(getData?.data);
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleToggleFavorite = async (id) => {
    const isFav = !!favoriteDoctors[id];

    if (!isFav) {
      await addDoctorToFavorites(id);
    } else {
      await removeDoctorFromFavorites(id);
    }
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
        getFavDoctorList();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const removeDoctorFromFavorites = async (id) => {
    try {
      const payload = { fav_doc: id };
      await deleteWithPayload(`patient/favourite/`, payload);
      showToast("Doctor removed from favorites", "success");
      getFavDoctorList();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const removeAllFilter = () => {
    setValue("speciality", null);
    setValue("country", null);
    setValue("Gender", null);

    setFilterData({
      gender: "",
      speciality: "",
      country: "",
    });

    setCurrentPage(1);
    PaginatedDoctorList(1, "");
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

  const doctorsWithLanguageNames = doctorList.map((doctor) => {
    const languageNames = doctor.languages
      ?.map((id) => languageOptions?.find((lang) => lang.id === id))
      .filter(Boolean)
      .map((lang) => lang.name);

    return {
      ...doctor,
      languages: languageNames, // now it's an array of language names
    };
  });

  useEffect(() => {
    getLanguageData();
    getFavDoctorList();
  }, []);

  const makeAppointment = (item) => {
    setShowFirstModal(true);
    setSelectedDoctorAppointement(item);
  };

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
                  <button className="filter-select" onClick={removeAllFilter}>
                    Clear Filter
                  </button>
                </div>
              </div>
              <div className="col-md-10">
                <div className="clinic_doc_list bg-white-transparent border-radius-20 padding-20">
                  <div className="recomend row g-4 col-md-10">
                    {doctorsWithLanguageNames.length > 0 ? (
                      doctorsWithLanguageNames.map((item) => {
                        const countryName = item?.country?.toLowerCase?.();
                        const countryCode = countryCodeMap[countryName] || "FR";
                        return (
                          <div className="Docbox" key={item?.doctor_id}>
                            <div className="recomendBox">
                              <div className="clinicDocMain d-flex gap-3">
                                <div className="left allDoctor">
                                  <img
                                    src={
                                      favoriteDoctors[item?.doctor_id] ||
                                      item.favourite
                                        ? "/images/purple.svg"
                                        : "/images/wishlist.svg"
                                    }
                                    alt="Favorite Toggle"
                                    onClick={() =>
                                      handleToggleFavorite(item?.doctor_id)
                                    }
                                    style={{
                                      cursor: "pointer",
                                      width: "22px",
                                      height: "22px",
                                    }}
                                    className="heartImg img-fluid width-25"
                                  />
                                  <div className="docrecomdpart">
                                    <div className="docImg">
                                      <Flag
                                        code={countryCode}
                                        className="docflag"
                                      />
                                      <Image
                                        src={item?.profile_picture}
                                        className="doctorListImg"
                                      />
                                    </div>
                                    {console.log(item, ">>>>>>>>item")}
                                    <div className="drRdetail pt-2">
                                      {/* <div className="top">
                                  {item?.professional_stat}
                                     <span className="main-blue-text">
                                      {item?.expertise}
                                    </span> 
                                </div> */}

                                      <div className="top">
                                        <div className="verified font-20">
                                          {item?.professional_stat ||
                                            "Generalist"}{" "}
                                          &nbsp;
                                          <span className="main-blue-text ">
                                            {" "}
                                            {item?.experience_years || 0} years
                                            of experience{" "}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="recondName d-flex gap-3">
                                        <img
                                          src="../images/batch.svg"
                                          alt="batch"
                                        />
                                        Dr. {item?.first_name} {item?.last_name}
                                      </div>

                                      <div className="clinicLoca d-flex align-items-center gap-2">
                                        <img
                                          src="../images/mappin.svg"
                                          alt="map pin"
                                        />
                                        <span className="text-green">
                                          {item?.country}
                                        </span>
                                      </div>
                                      <div className="d-flex gap-2">
                                        {item?.languages?.map(
                                          (lang, langIndex) => {
                                            return (
                                              <div
                                                className="langSpeak"
                                                key={langIndex}
                                              >
                                                <span className="languageSpeak">
                                                  {lang}
                                                </span>
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="right">
                                  <div className="greenimg font-20">
                                    <img
                                      src="../images/general-medicine.svg"
                                      alt="medicine"
                                    />
                                    <span>
                                      {item?.specialty || "General Medicine"}
                                    </span>
                                  </div>
                                  <div className="bStar d-flex align-items-center gap-2 font-20">
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
                              <p className="pl-5">{item?.bio}</p>
                              <div className="doclistBtn2 d-flex justify-content-end gap-3">
                                {/* <span className="transparent_btn">
                            Urgent hourly rate : &nbsp;{" "}
                            <span className="fw-bold">
                              {" "}
                              {item?.urgent_hourly_rate}{" "}
                            </span>
                          </span> */}
                                <span className="transparent_btn">
                                  Consultation fee : &nbsp;{" "}
                                  <span className="fw-bold">
                                    {item?.planned_hourly_rate || "00"}
                                  </span>
                                </span>
                                <Link
                                  to={`/patient/userview/${item?.id}`}
                                  state={{ doctor: item }}
                                  className="transparent_btn"
                                >
                                  {t("all-doctor-list.more-info")}
                                </Link>
                                <button
                                  disabled={item.stripe_link === false}
                                  className={`blue_btn${
                                    item.stripe_link === false
                                      ? " tooltip2"
                                      : ""
                                  }`}
                                  {...(item.stripe_link === false && {
                                    "data-tooltip": "Doctor is not available",
                                  })}
                                  onClick={() => makeAppointment(item)}
                                >
                                  {t("all-doctor-list.make-appointment")}
                                </button>
                              </div>
                            </div>
                            <div className="viewFullSchdl">
                              {t("all-doctor-list.view-full-schedules")}
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
          <AppointmentModal
            setShowFirstModal={setShowFirstModal}
            showFirstModal={showFirstModal}
            selectedDoctorAppointement={selectedDoctorAppointement}
          />
          {allDoctorList.length > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
    </>
  );
};

export default AllDoctorList;
