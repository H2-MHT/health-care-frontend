import React, { useEffect, useState } from "react";
import { fetchData } from "../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../utils/toast";

const PrescriptionView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showMediaDigest, setShowMediaDigest] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await fetchData(
        "consultation/prescription-list/",
        navigate
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
      <div class="col-md-12 mt-3">
        <div class="padding-inner border-radius-20 bg-white">
          <div class="d-flex align-items-center justify-content-between mb-4"></div>
          <div
            className={`${
              prescriptions?.length != 0 ? "mediadigestDetails" : ""
            }`}
          >
            {prescriptions?.length > 0 ? (
              prescriptions
                ?.slice(0, showMediaDigest ? prescriptions.length : 3)
                .map((item) => (
                  <div className="mediaBox" key={item.id}>
                    <iframe
                      src={item?.pdf_url}
                      width="100%"
                      height="600px"
                      title="PDF Preview"
                    />

                    {/* <h5 className="description">{item?.title}</h5>
                    <div className="description">{item?.description}</div> */}
                    {/* <button
                      type="button"
                      className="blue_btn"
                      data-bs-toggle="modal"
                      data-bs-target="#mediaDigestPop"
                      onClick={() => setMediadiItemDetails(item)}
                    >
                      Read More
                    </button> */}
                  </div>
                ))
            ) : (
              <div className="treatmentContainer">
                <div className="no-appointments">No media available</div>
              </div>
            )}
          </div>
          {prescriptions?.length > 2 && (
            <a
              className="downopen"
              onClick={() => setShowMediaDigest(!showMediaDigest)}
            >
              <img
                src="../images/downopen.svg"
                alt="toggle"
                style={{
                  transform: showMediaDigest
                    ? "rotate(180deg)"
                    : "rotate(0deg)", // Rotate icon
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                }}
              />
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default PrescriptionView;
