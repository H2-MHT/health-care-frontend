import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDataAuth, postData } from "../../../hooks/services/services";
import PopUp from "./popUp";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Pagination from "../../../components/pagination/pagination";
import { Loader } from "../../../components/ui/loader/loader";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import InputField from "../../../components/form/InputField";
import { showToast } from "../../../utils/toast";


const ManageDoctors = () => {
  const { t } = useTranslation();
  const [doctorList, setDoctorList] = useState(null);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [functionType, setFunctionType] = useState("");
  const [doctorId,setDoctorId]=useState()
  const [userObject, setUserObject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal,setShowModal]=useState(false)
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);


  useEffect(() => {
      fetchDoctorList(currentPage, query);
    }, [currentPage]);

  const itemsPerPage = 5;

  const fetchDoctorList = async (page = 1, searchQuery = "") => {
    setLoading(true);
    const fetchUrl = `MasterPanel/user_list/?page=${page}&limit=${itemsPerPage}&search_key=${encodeURIComponent(
      searchQuery
    )}&role=Doctor`;;
    try {
      const response = await fetchDataAuth(fetchUrl);

      if (!response.ok) throw new Error("Fetching Doctor List Failed");
      const totalPagesHeader = response.headers.get("Total-Pages");
      console.log("Full Headers:", [...response.headers.entries()]);
      const totalPages = totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1;
      const getData = await response.json();
      setDoctorList(Array.isArray(getData?.data) ? getData.data : []);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Fetch Doctor List Error: ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const blockDoctor = (doctor) => {
    if (doctor.is_active === true) setFunctionType("Block");
    else setFunctionType("Unblock");
    setOpenPopUp(true);
    setUserObject(doctor);
  };

  const deleteDoctor = (doctor) => {
    setOpenPopUp(true);
    setFunctionType("Delete");
    setUserObject(doctor);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      fetchDoctorList();
    }
  };

  const searchButtonClicked = () => {
    setCurrentPage(1);
    fetchDoctorList();
  };

 const schema = Yup.object().shape({
    name: Yup.string().required("Stripe Url is required"),
  });

 const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleChange=(doctor)=>{
    setShowModal(true)
    setDoctorId(doctor?.id)
  }

  const onSubmit = async (data) => {
    try {
        const payload = {
          stripe_link: data?.name,
          doctor_id:doctorId
        };
        const response = await postData(
            `MasterPanel/add-stripe-link/`, payload
        );
        if (response.status == 200) {
            let responseData = await response.json();
            showToast(responseData?.message, "success");
           await fetchDoctorList()
            setShowModal(false);
           reset()
        }
    } catch (error) {
        showToast(error.message, "error");
    }
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
        {/* <a href="#" className="blue_btn" style={{ height: "56px" }}>
          Add +
        </a> */}
      </div>
  
      <div className="adminDetails padding-20 bg-white border-radius-20">
        <table className="doctoradmintable">
          <thead>
            <tr>
              {/* <th>{t("superadmin.profile-photo")}</th> */}
              <th>{t("superadmin.doctor-name")}</th>
              <th>{t("superadmin.speciality")}</th>
              <th>{t("edit-profile.country")}</th>
              {/* <th>Status</th> */}
              <th>Stripe Link</th>
              <th>{t("superadmin.action")}</th>

            </tr>
          </thead>
          <tbody>
            {doctorList &&
              doctorList.map((doctor) => {
                return (
                  <tr key={doctor.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3 justify-content-center">
                        <div class="profile-photo">
                          <img
                            src={
                              doctor?.profile_picture
                                ? doctor.profile_picture
                                : "../images/sample.png"
                            }
                            alt="profile_photo"
                          />
                        </div>
                        <p className="doctor-name">
                          <Link
                            to="/superadmin/document/verification"
                            state={{ doctor: doctor }}
                          >
                            {doctor.name}
                          </Link>
                        </p>
                      </div>
                    </td>

                    {/* <td>
                      <Link
                        to="/superadmin/document/verification"
                        state={{ doctor: doctor }}
                      >
                        {doctor.first_name} {doctor.last_name}
                      </Link>
                    </td> */}
                    <td>{doctor.speciality}</td>
                    <td>{doctor.country}</td>
                    {/* <td>
                      <div>
                        active
                      </div>
                    </td> */}
                    <td
                      title={
                        doctor?.stripe_link?.length > 30
                          ? doctor.stripe_link
                          : ""
                      }
                    >
                      {doctor?.stripe_link?.length > 30
                        ? doctor.stripe_link.slice(0, 30) + "..."
                        : doctor?.stripe_link}
                    </td>
                    <td>
                      <div className="actions">
                        <Link
                          to={`/superadmin/doctor-info/${doctor.id}`}
                          className="tooltip2"
                          data-tooltip="View Doctor"
                        >
                          <img src="../images/eye.webp" />
                        </Link>
                        <a
                          href="#"
                          className="tooltip2"
                          onClick={() => blockDoctor(doctor)}
                          data-tooltip={
                            doctor.is_active ? "Block Doctor" : "Unblock Doctor"
                          }
                        >
                          <img
                            src={
                              doctor.is_active
                                ? "../images/unblock-user.png"
                                : "../images/block-user.png"
                            }
                          />
                        </a>
                        <a
                          href="#"
                          className="tooltip2"
                          onClick={() => deleteDoctor(doctor)}
                          data-tooltip="Delete Doctor"
                        >
                          <img src="../images/deleteBlack.webp" />
                        </a>
                        {/* <a>
                        <i class="fa-solid fa-square-plus"></i>
                  <img
                    src="../images/folder.svg"
                    onClick={() => handleChange(doctor)}
                  />
                </a> */}
                        {/* <a
                          href="#"
                          className="tooltip2"
                          onClick={() => handleChange(doctor)}
                          data-tooltip="Add Stripe Link"
                        >
                         <i class="fa-solid fa-square-plus"></i>
                        </a> */}
                        <div class="icon-circle">
                          <i class="fa-solid fa-square-plus"></i>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {openPopUp && (
        <PopUp
          open={openPopUp}
          setOpen={setOpenPopUp}
          functionType={functionType}
          userType="Doctor"
          userObject={userObject}
          callFetch={fetchDoctorList}
        />
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <Modal
        show={showModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>Add Stripe Link</Modal.Header>
        <Modal.Body>
          <div className="p-4 bg-white shadow-md rounded-lg w-80">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-4">
                <div className="form-group">
                  <label className="block text-sm font-medium mb-1">
                     Stripe URl
                  </label>
                  <InputField
                    type="url" 
                    {...register("name")}
                    className="w-full rounded-md mb-4"
                  />
                  <p className="text-danger">{errors.name?.message}</p>
                </div>
              </div>
               <div className="gap-2 justify-content-center d-flex w-auto mx-auto">
              <button type="submit" className="blue_btn ">
                Save
              </button>
              <button type="button" className="blue_btn"  onClick={() => setShowModal(false)}>
              Cancel
              </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageDoctors;
