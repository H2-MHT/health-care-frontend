import React, { useContext, useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { MdCallEnd } from "react-icons/md";
import { VideoCallContext } from "../../../../context/Context";
import "./IncomingCall.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const IncomingCall = () => {
  const { t } = useTranslation();
// const navigate = useNavigate();
//   const {
//     receiveCall,
//     call,
//     isCallAccepted,
//     endIncomingCall,
//     setPartnerUserId,
//   } = useContext(VideoCallContext);
//   const [showModal, setShowModal] = useState(false);
//   const audioRef = useRef();

//   const handleClose = () => {
//     setShowModal(false);
//     if (call.isReceivingCall && !isCallAccepted) {
//       endIncomingCall();
//     }
//     // window.location.reload();
//   };

//   const handleCallAnswer = () => {
//     receiveCall();
//     setShowModal(false);
//     navigate('/videocall')
//   };
//   console.log(">>>>>>>>>>call", call, isCallAccepted)
//   useEffect(() => {
//     if (call.isReceivingCall && !isCallAccepted) {
//       setShowModal(true);
//       setPartnerUserId(call.from);
//     }
//   }, [call]);

//   useEffect(() => {
//     if (showModal && audioRef.current) {
//     //   audioRef.current.play();
//     } else if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//     }
//   }, [showModal]);

//   return (
//     <>
//     {console.log(">>>>>>>>.showModal", showModal)}
//       <audio src="/images/ringtone.ogg" loop ref={audioRef} />
//       <Modal show={showModal} onHide={handleClose} centered>
//         <Modal.Header className="call-modal-header" closeButton>
//           <Modal.Title className="call-modal-title">
//             {call?.name ? call?.name : "Someone"} is calling:
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Footer className="call-modal-footer">
//           <Button onClick={handleClose} className="decline-call-btn">
//             <MdCallEnd size={25} />
//           </Button>
//           <div className="answer-call-image" onClick={handleCallAnswer}>
//             <img src="/images/answer-call.gif" alt="Answer Call" />
//           </div>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
return <div>{t("clinic-see-user.incoming-call")}</div>;
};

export default IncomingCall;
