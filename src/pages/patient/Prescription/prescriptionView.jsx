import React, { useEffect, useState } from "react";
import { fetchData, fetchDataPublic } from "../../../hooks/services/services";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../../utils/toast";

const PrescriptionView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { search } = useLocation();
  const [showMediaDigest, setShowMediaDigest] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
  }, [search]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await fetchDataPublic(
        `consultation/prescription-list${search}`
      );
      const data = await response.json();
      if (response.ok) {
        setPrescriptions(data.prescriptions);
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rightContent">
        <div className="row">
          <div class="col-md-12 mt-3">
            <div class="padding-inner border-radius-20 bg-white h-100">
              <div
                className={`${
                  prescriptions?.length != 0
                    ? "mediadigestDetails presciption-view"
                    : ""
                }`}
              >
                {prescriptions?.length > 0 ? (
                  prescriptions
                    ?.slice(0, showMediaDigest ? prescriptions.length : 4)
                    .map((item) => (
                      <div className="mediaBox" key={item.id}>
                        <h4 className=" d-flex">
                          Doctor Name: {item?.doctor?.name}
                        </h4>
                        <h4 className=" d-flex">
                          Patient Name: {item?.patient?.name}
                        </h4>
                        <h6 className=" d-flex">
                          Create Date: {item?.created_date}
                        </h6>
                        <hr />
                        <iframe
                          src={item?.pdf_url}
                          width="100%"
                          height="300px"
                          title="PDF Preview"
                        />
                      </div>
                    ))
                ) : (
                  <div className="treatmentContainer">
                    <div className="no-appointments">No media available</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrescriptionView;
