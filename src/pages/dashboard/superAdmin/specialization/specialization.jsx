import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import {
  deleteData,
  fetchDataAuth
} from "../../../../hooks/services/services";
import { showToast } from "../../../../utils/toast";
import AddSpecializationModel from "./addSpecializationModel";
import EditSpecializationModel from "./editSpecializationModel"

function Specialization() {
  const [specializationDetail, setSpecializationDetail] = useState();
  const [showModal, setShowModal] = useState(false);
  const [editDetails,setEditDetails]=useState()
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const getspecializationList = async () => {
    try {
      const response = await fetchDataAuth(
        `MasterPanel/specialization/`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setSpecializationDetail(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

 const handleEdit=(item)=>{
  setEditDetails(item)
  setShowEditModal(true)
 }

  const deleteSpecialization = async (id, event) => {
    event.preventDefault();
    try {
      const payload = {
        specialization_id: id,
      };
   const response = await deleteData(`MasterPanel/specialization/`, payload);
      showToast(response?.message, "success");
      await getspecializationList();
    } catch (error) {
      showToast(error.message, "error");
    }
  };
console.log(specializationDetail,">>>>>>>>specializationDetails")

  useEffect(() => {
    getspecializationList();
  }, []);

  return (
    <>
      <div className="rightContent">
        <div className="row h-100">
          <div class="col-md-12">
            <div class="padding-inner border-radius-20 bg-white h-100">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="docinfohead">My Specialization</h3>
                <a>
                  <img
                    src="../images/folder.svg"
                    onClick={() => setShowModal(true)}
                  />
                </a>
              </div>

              <div class="mediaDegestPart">
                <table border="1">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Created Date</th>
                      <th>isDisplay</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specializationDetail?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item?.created_date}</td>
                        <td>{item?.is_approved}</td>
                        <td>
                        <div className="skillEdit">
                          <a
                            href="#"
                            onClick={() => handleEdit(item)}
                          >
                            <img src="../images/edit-skill.webp" alt="Edit" />
                          </a>

                          <a
                            href="#"
                            onClick={(e) => deleteSpecialization(item.id, e)}
                          >
                            <img
                              src="../images/doctor-dashboard/delete-icon1.png"
                              alt="Delete"
                            />
                          </a>
                        </div>
                        </td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddSpecializationModel
        setShowModal={setShowModal}
        showModal={showModal}
        getspecializationList={getspecializationList}
      />
      <EditSpecializationModel setShowEditModal={setShowEditModal} showEditModal={showEditModal} getspecializationList={getspecializationList} editDetails={editDetails}/>
    </>
  );
}

export default Specialization;
