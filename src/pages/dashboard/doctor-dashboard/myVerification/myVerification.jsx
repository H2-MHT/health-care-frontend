import React, { useEffect, useState } from "react";
import AddMyVerifcationModel from "./addMyVerifcationModel";
import { deleteData, fetchDataAuth, updateApointmentData } from "../../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../utils/toast";
import ViewUrlModel from "./viewUrlModel";
import { useSelector } from "react-redux";

function MyVerification() {
  const [openModel, setOpenModel] = useState(false);
  const [viewOpenModel, setViewOpenModel] = useState(false);
  const [viewItem, setviewItem] = useState();
  const [licensesdetail, setLicensesdetail] = useState();
  const navigate = useNavigate();
 const isProfiledata = useSelector((state) => state?.userProfile?.userProfile);
  
  console.log(isProfiledata,">>>>>>>>isProfiledata")
  const getLicensesData = async () => {
    try {
      const response = await fetchDataAuth(
        `doctors/licence-certificate/`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setLicensesdetail(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(licensesdetail,">>>>>>>licensesdetail")

  const removeVerification = async (item) => {
    try {
      const payload = {
        attachment_id: item?.id,
      };
      const response = await updateApointmentData(`doctors/delete-document/`, payload);

      if (!response.ok) {
        throw new Error("Failed to remove clinic from favorites."); // Handle failed requests
      }
      const responseData = await response.json(); // Extract JSON response
      showToast(responseData.message, "sucess");
      await getLicensesData();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleViewItem = (item) => {
    setviewItem(item);
    setViewOpenModel(true);
  };

  useEffect(() => {
    getLicensesData();
  }, []);

  return (
    <>
      <div className="rightContent">
        <div className="row h-100">
          <div class="col-md-12">
            <div class="padding-inner border-radius-20 bg-white h-100">
              <div class="d-flex align-items-center justify-content-between mb-4">
                <h3 class="docinfohead">My Document Verification</h3>
                <a href="#">
                  <img
                    src="../images/folder.svg"
                    onClick={() => setOpenModel(true)}
                  />
                </a>
              </div>

              <div class="mediaDegestPart">
                <table border="1">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>View</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {licensesdetail?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>
                          {item.status === "Verified" ? (
                            <div className="badge bg-success py-2 px-3">
                              Verified
                            </div>
                          ) : item.status === "Rejected" ? (
                            <div className="badge bg-danger py-2 px-3">
                              Rejected
                            </div>
                          ) : (
                            <div className="badge bg-warning text-black py-2 px-3">
                              Pending
                            </div>
                          )}
                        </td>

                        <td>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              handleViewItem(item);
                            }}
                          >
                            View
                          </a>
                        </td>
                        <td>
                          {item.status === "Pending" && (
                            <img
                              src="../images/delete.svg"
                              width="25"
                              onClick={() => {
                                removeVerification(item);
                              }}
                            />
                          )}
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
      <AddMyVerifcationModel
        setOpenModel={setOpenModel}
        openModel={openModel}
        getLicensesData={getLicensesData}
      />
      <ViewUrlModel
        setViewOpenModel={setViewOpenModel}
        viewOpenModel={viewOpenModel}
        viewItem={viewItem}
      />
    </>
  );
}

export default MyVerification;
