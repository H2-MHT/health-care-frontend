import React ,{ useState, useEffect } from "react";
import { fetchDataAuth, postData } from "../../../../hooks/services/services";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../../utils/toast";
import Pagination from "../../../../components/pagination/pagination";

function ManageReviewAdmin() {
  const [reviews, setReviews] = useState();
  const navigate = useNavigate();
   const [totalPages, setTotalPages] = useState(1);
   const [currentPage, setCurrentPage] = useState(1);
   const [query, setQuery] = useState("");
  const itemsPerPage = 5;
    
   useEffect(() => {
      fetchReviewList(currentPage, query);
    }, [currentPage]);


 const handleSubmit = async (id, newStatus) => {
    try {
      const payload = { 
        review_id: id,
        status:newStatus
       };
      const response = await postData("MasterPanel/approve-review/", payload);

      if (response.status === 200) {
        let responseData = await response.json();
        showToast(responseData?.message, "success");
        await fetchReviewList()
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };



  const fetchReviewList = async (page = 1, searchQuery = "") => {
    try {
      const response = await fetchDataAuth(
        `MasterPanel/approve-review/?page=${page}&limit=${itemsPerPage}`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
      const getData = await response.json();
      setReviews(getData?.data);
    } catch (error) {
      console.log(error.message);
    }
  };




  return (
    <div className="rightContent rightsidefull ">
      <div className="padding-inner border-radius-20 bg-white reviewadmin ">
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold ">Admin Review Dashboard</h1>
          {reviews?.map((review) => (
            <div key={review.id} className="space-y-2 reviewadmininner">
              <div className="flex justify-between items-center">
                <div>
                  <h6 className="font-semibold">
                    {review.patientName} on {review.doctorName}
                  </h6>
                  <h5 className="text-sm text-gray-500">Date: {review.date}</h5>
                  <h4 className="my-2">Rating: {"★".repeat(review.rating)}</h4>
                  <p className="mb-2">"{review.content}"</p>
                </div>
                <span variant="secondary">{review.status}</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="d-flex gap-3 align-items-center">
                  <buutto
                    variant="success"
                    className="approve"
                    onClick={() => handleSubmit(review.id, "Approved")}
                  >
                    Approve
                  </buutto>
                  <button
                    variant="destructive"
                    className="btn btn-danger"
                    onClick={() => handleSubmit(review.id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
           {reviews?.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No reviews available
                    </td>
                  </tr>
                )}
        </div>
      </div>
       <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
    </div>
  );
}

export default ManageReviewAdmin;
