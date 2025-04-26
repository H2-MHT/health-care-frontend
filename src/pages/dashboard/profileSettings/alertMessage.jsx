import React from 'react'
import { Button, Modal } from "react-bootstrap";

const alertMessage=({modelOpen,setModelOpen,accountDeactivate})=> {
  return (
    <Modal
    show={modelOpen}
    backdrop="static"
    keyboard={false}
    onHide={() => setModelOpen(false)}
    size="lg"
  >
    <Modal.Header closeButton>
      <div className="modal-heading-alignment">
        <h5 className="modal-title text-left">Alert meesage</h5>
      </div>
    </Modal.Header>
    <Modal.Body>
      <div className="educationDetail">
      Pop Message for Deactivate Account :
      Are you sure you want to deactivate your account? Deactivating your account will restrict your access to the platform and associated services?
     <Button type="submit"onClick={accountDeactivate}>Confirm</Button>
     <Button>Cancel</Button>
      </div>
    </Modal.Body>
  </Modal>
  )
}

export default alertMessage