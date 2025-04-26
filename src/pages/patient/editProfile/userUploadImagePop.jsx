import React, { useState } from "react";
import UserEditProfilePop from "./userAddProfilePop"

const UserUploadImagePop = ({ setModelOpen, Modal, modelOpen }) => {
    const [uploadedData, setUploadedData]=useState()
    const [userEditOpenModel, setUserEditOpenModel]=useState(false)
   
    const handleImage = (event) => {
      const file = event.target.files[0]; // Get the selected file
      console.log(file,">>>>>>>>>file")
      if (file) {
        console.log("File Name:", file); // Extract and log the file name
        setUploadedData(file); // Store only the file name
        setUserEditOpenModel(true)
      }
    };
    

  return (
    <>
    <Modal
      show={modelOpen}
      backdrop="static"
      keyboard={false}
      onHide={() => setModelOpen(false)}
      size="lg"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="imageUpload">
          <img src="../../images/download-btn.webp" />
          <h4>Upload a file</h4>
          <p>Drag and drop or browse to choose a file</p>
          <span>(pdf, jpg or png only)</span>
          <input type="file" name="uplaod image" onChange={handleImage}/>
        </div>
      </Modal.Body>
    </Modal>
    <UserEditProfilePop Modal={Modal} userEditOpenModel={userEditOpenModel} setUserEditOpenModel={setUserEditOpenModel} uploadedData={uploadedData}/>
    </>
  );
};

export default UserUploadImagePop;
