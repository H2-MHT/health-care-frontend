import React from "react";
import { Modal, Button } from "react-bootstrap";

const CommonModal = ({
  show, // Boolean to control the visibility of the modal
  onHide, // Function to handle modal close
  title, // Modal title as a string
  body, // Modal body content (string or JSX)
  footerButtons = [], // Array of button objects for the footer
  className ="",
  size,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered className={className} size={size}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        {footerButtons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant || "primary"} // Default to "primary" if not specified
            onClick={button.onClick}
            className={button.className}
          >
            {button.label}
          </Button>
        ))}
      </Modal.Footer>
    </Modal>
  );
};

export default CommonModal;
