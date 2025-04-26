
import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { requestForToken, onMessageListener } from "./firebase";
import { Button, Modal } from "react-bootstrap";
// import "./IncomingCall.css";
import "../doctor-dashboard/Calls/IncomingCall.css"
import { MdCallEnd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const VideoCallNotification = ({ incomingCall, setIncomingCall }) => {
const { t } = useTranslation();
    const navigate = useNavigate()
    console.log(">>>>>>>>>>>>>incomingCall ", incomingCall)
    const [joined, setJoined] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [localTracks, setLocalTracks] = useState([]);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    // const [incomingCall, setIncomingCall] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const appId = "e721997e19404911b088ba05b3dff6bb";  // Replace with your Agora App ID
    const token = "007eJxTYNBMkbvEYxnYImj4P2XL98KlGSq7atq7t7AnmrddtLOPWKHAkGpuZGhpaZ5qaGliYGJpaJhkYGGRlGhgmmSckpZmlpR0/PTj9IZARgbdw5tZGBkgEMRnYQhJLS5hYAAAxYEemw=="; // Replace with a valid token or set to null for testing
    const channel = "Test"; // Your unique channel name
    const uid = "shatrughan_singh"; // Unique identifier for local user
    const receiverUid = "himanshu_hans";

    const audio = new Audio('/images/ringtone.ogg');
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });


    useEffect(() => {
        if (incomingCall) {
            console.log("Playing ringtone...");
            audio.loop = true;
            audio.play().catch(err => console.error("Audio play failed:", err));
        }
    
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [incomingCall]);

    useEffect(() => {
        console.log(">>>>>>>>audio", audio)
        // audio.pause();
        // setTimeout(() => {
        //     if(audio){
        //         audio.loop = true;
        //         audio.play();
        //         }
        // }, 3000)
       
        // onMessageListener()
        //     .then((payload) => {
        //         console.log("New Notification:111", payload);
        //         if (payload.data?.type === "incoming_call") {
        //             setIncomingCall({
        //                 caller: payload.data.caller,
        //                 ringing: true,
        //             });
        //             setShowModal(true)
        //             console.log(">>>>>>>>audio ", audio)
        //             // Play ringtone
        //             audio.loop = true;
        //             audio.play();
        //         } else {
        //             setJoined(true)
        //         }
        //     })
        //     .catch((err) => console.error("Failed to receive message", err));

        // return () => {
        //     audio.pause();
        //     audio.currentTime = 0;
        // };
    }, [audio]);

    // useEffect(() => {
    //     audio.loop = true;
    //     audio.play();
    //         return () => {
    //         audio.pause();
    //         audio.currentTime = 0;
    //     };
    // }, [audio])


    const acceptCall = () => {
        let senderUserId = incomingCall?.senderUserId
        let receiverUserId = incomingCall?.receiverUserId
        console.log(">>>>>senderUserId ", senderUserId, receiverUserId)
        localStorage.setItem("isVideoActive", "true")
        setJoined(true);
        console.log("Call Accepted 111", incomingCall);
        handleClose()
        // joinChannel()


        setTimeout(() => {
            audio.pause();
            setIncomingCall(null);
            navigate(`/doctorchat?senderUserId=${senderUserId}&receiverUserId=${receiverUserId}`)
        }, 1000) 
        // Redirect to the call screen or execute the call logic
    };

    const leaveChannel = async () => {
        try {
            localTracks.forEach((track) => track.stop() && track.close());
            await client.leave();
            //   setJoined(false);
        } catch (error) {
            console.error("Error leaving channel:", error);
        }
    };

    // Reject Call
    const rejectCall = () => {
        console.log("Call Rejected");
        audio.pause();
        handleClose()
        setIncomingCall(null);
        leaveChannel()
    };

    const handleClose = () => {
        setShowModal(false);
    };


    return (
      <div>
        {incomingCall && (
          <Modal show={true} onHide={handleClose} centered>
            <Modal.Header className="call-modal-header" closeButton>
              <Modal.Title className="call-modal-title">
                {/* {call?.name ? call?.name : "Someone"} is calling: */}
                {t("doctor-chat.incoming-call")} {incomingCall.caller}
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer className="call-modal-footer">
              <Button onClick={rejectCall} className="decline-call-btn">
                <MdCallEnd size={25} />
              </Button>
              <div className="answer-call-image" onClick={acceptCall}>
                <img src="/images/answer-call.gif" alt="Answer Call" />
              </div>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    );

}

export default VideoCallNotification;