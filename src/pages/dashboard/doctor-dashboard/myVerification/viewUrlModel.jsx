import React from "react";
import { Modal } from "react-bootstrap";

const ViewUrlModel = ({ viewOpenModel, setViewOpenModel,viewItem }) => {

  return (
   
    <>
      <Modal
        show={viewOpenModel}
        backdrop="static"
        keyboard={false}
        onHide={() => setViewOpenModel(false)}
        size="lg"
        className="familymemb"
      >
         <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal-content">
            <div className="modal-body">
               <img src={viewItem?.attachment} className="img-fluid w-100"/>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewUrlModel;
