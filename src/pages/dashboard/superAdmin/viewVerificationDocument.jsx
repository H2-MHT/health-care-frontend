
import React from "react";
import { Modal } from "react-bootstrap";

const ViewVerificationDocument = ({setViewDocument,viewDocument,viewItem}) => {
    console.log(viewItem?.attachment,">>>>>viewItem")
  return (
   
    <>
      <Modal
        show={viewDocument}
        backdrop="static"
        keyboard={false}
        onHide={() => setViewDocument(false)}
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

export default ViewVerificationDocument;