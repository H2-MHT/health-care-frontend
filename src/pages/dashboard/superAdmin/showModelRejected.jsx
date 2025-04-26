import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import React from "react";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { showToast } from "../../../utils/toast";
import {updateApointmentData, updateData } from "../../../hooks/services/services";
import InputField from "../../../components/form/InputField";

function ShowModelRejected({
    setShowModal,
    showModal,
    documentDeatils,
    statusMap,
    getDoctorDocumentList
}) {

  const schema = Yup.object().shape({
    rejection_reason: Yup.string().required("rejection reason is required")   
  });
 
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
        const payload = {
            rejection_reason: data?.rejection_reason,
            status: statusMap?.status,
            user_id: documentDeatils?.user_id,
            licence_certificate_id:documentDeatils?.id
          
        }
        const response = await updateApointmentData(
            `MasterPanel/verify-document/`, payload
        );
        if (response.status == 200) {
            let responseData = await response.json();
            showToast(responseData?.message, "success");
            setShowModal(false);
            getDoctorDocumentList();
           reset()
        }
    } catch (error) {
        showToast(error.message, "error");
    }
};


  return (
    <>
      <Modal
        show={showModal}
        backdrop="static"
        keyboard={false}
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="p-4 bg-white shadow-md rounded-lg w-80">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-4">
                <div className="form-group">
                  <label className="block text-sm font-medium mb-1">
                  Rejection Reason
                  </label>
                  <InputField
                    type="text"
                    {...register("rejection_reason")}
                    className="w-full p-2 border rounded-md mb-4"
                  />
                  <p className="text-danger">{errors.rejection_reason?.message}</p>
                </div>
              </div>

              <button type="submit" className="blue_btn mx-auto mt-4">
                Save
              </button>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ShowModelRejected;
