import React from "react";
import { Modal } from "react-bootstrap";

const ViewDocumentSupport = ({ setViewItem, viewItem,viewItemData }) => {

  return (
   
    <>
      <Modal
        show={viewItem}
        backdrop="static"
        keyboard={false}
        onHide={() => setViewItem(false)}
        size="lg"
        className="familymemb"
      >
         <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal-content">
            <div className="modal-body">
               <img src={viewItemData?.attachment} className="img-fluid w-100"/>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ViewDocumentSupport;
