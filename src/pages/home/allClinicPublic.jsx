import React, { useEffect, useState } from "react";
import "../dashboard/user-dashboard/userdashboard.css";
import { fetchDataPublic } from "../../hooks/services/services";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../../components/pagination/pagination";
import { Loader } from "../../components/ui/loader/loader";
import Header from "../../components/ui/header/header";
import { Footer } from "../../components/ui/footer/footer";

const AllClinicPublic = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allClinicList, setAllClinicList] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);

  const PaginatedClinicList = async (page = 1, searchQuery = "") => {
    setLoading(true);
    const url = `clinics/public-clinic-list/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
      searchQuery
    )}`;

    try {
      const response = await fetchDataPublic(url, navigate);
      const totalPagesHeader = response.headers.get("Total-Pages");
      console.log("Full Headers:", [...response.headers.entries()]);
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
      const getData = await response.json();
      setAllClinicList(Array.isArray(getData?.data) ? getData.data : []);
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
    PaginatedClinicList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Header />
      <div className="rightContent p-5 backgroundImage">
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
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
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
            {allClinicList?.length > 0 ? (
              allClinicList?.map((item, index) => (
                <div className="col-lg-4 col-md-6" key={index}>
                  <div className="favBox">
                    <img
                      src="../images/user-dashboard/favclinic.svg"
                      className="img-fluid w-100 clinicImg"
                      alt="Clinic"
                    />
                    <div className="favContent">
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
                          to="/public-clinic-view"
                          state={{ clinic: item }}
                        >
                          More Info
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="clinic_doc_list bg-white-transparent border-radius-20 padding-20">
                <div className="recomend">
                  <div>No Clinics found</div>
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
      <Footer />
    </>
  );
};

export default AllClinicPublic;
