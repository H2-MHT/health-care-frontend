import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import "../doctor-dashboard/Calls/IncomingCall.css";
import { fetchData, postData } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { useNavigate } from "react-router-dom";
import { WEB_SOCKET_URL } from "../../../hooks/services/apiUrl";
import {
  MdMic,
  MdMicOff,
  MdVideocam,
  MdVideocamOff,
  MdCallEnd,
  MdOutlineMessage,
  MdIosShare,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";

const MeetVideoCall = ({ selectedAppointment, showModal, setShowModal }) => {
  const [joined, setJoined] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [localTracks, setLocalTracks] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const [remoteUserName, setRemoteUserName] = useState("");
  const [meetingData, setMeetingData] = useState();
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState("");
  const ws = useRef(null);
  const mediaRecorder = useRef(null);
  const isProfileData = useSelector((state) => state?.userProfile?.userProfile);
  const client = useRef(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  ).current;

  const handleClose = () => {
    meetingJoinTime();
    // window.location.reload();
    setShowModal(false);
  };

  const meetingJoinTime = async () => {
    try {
      const response = await fetchData(
        `video-call/time_tracker/?appointment_id=${selectedAppointment?.id}&action=end`,
        navigate
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from the server.");
      }
    } catch (error) {
      console.log("error", error?.message);
    }
  };

  const getCallDetails = async () => {
    try {
      const payload = {
        uid: isProfileData?.id,
        appointment_id: selectedAppointment?.id,
      };

      const response = await postData(
        "video-call/generate-meeting-token/",
        payload
      );

      if (response?.status === 200) {
        const data = await response.json();
        setMeetingData(data);
        setCurrentUserName(data?.currentUserName);
        setRemoteUserName(data?.remoteUserName);
        await joinChannel(data);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  useEffect(() => {
    const handleUserPublished = async (user, mediaType) => {
      console.log("[Agora] Remote user published:", user.uid, mediaType);
      await client.subscribe(user, mediaType);
      if (mediaType === "video" && remoteVideoRef.current) {
        user.videoTrack?.play(remoteVideoRef.current);
      }

      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    };

    const handleUserLeft = (user) => {
      console.log("[Agora] User left:", user.uid);
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserLeft);
    client.on("user-left", handleUserLeft);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserLeft);
      client.off("user-left", handleUserLeft);
    };
  }, []);

  const joinChannel = async (data) => {
    try {
      const [micTrack, camTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks([micTrack, camTrack]);
      const callerUid = data.current_user_id; // Your unique Agora UID
      const token = data?.token;
      const channelName = data?.channel_name;
      const appId = data?.app_id;
      await client.join(appId, channelName, token, callerUid);
      await client.publish([micTrack, camTrack]);
      camTrack.play(localVideoRef.current);
      micTrack.setEnabled(true);
      setJoined(true);
    } catch (error) {
      console.error("Caller error joining channel:", error);
    }
  };

  const addConsultationReport = async () => {
    try {
      const payload = {
        appointment_id: selectedAppointment?.id,
        translated_text: transcript,
      };
      const response = await postData(
        "consultation/consultation-report/",
        payload
      );
      if (response?.status === 200) {
        const data = await response.json();
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const leaveChannel = async () => {
    try {
      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });

      await client.leave();
      setJoined(false);
      localStorage.setItem("isVideoActive", false);
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };

  const rejectCall = async () => {
    await handleClose();
    await addConsultationReport();
    await leaveChannel();
  };

  const toggleAudio = () => {
    const microphoneTrack = localTracks[0];
    if (microphoneTrack) {
      microphoneTrack.setEnabled(!audioEnabled);
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    const cameraTrack = localTracks[1];
    if (cameraTrack) {
      cameraTrack.setEnabled(!videoEnabled);
      setVideoEnabled(!videoEnabled);
    }
  };

  useEffect(() => {
    getCallDetails();
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(`${WEB_SOCKET_URL}/ws/transcribe/`);

    ws.current.onopen = () => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const recorder = new MediaRecorder(stream);
        mediaRecorder.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0 && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(event.data);
          }
        };

        recorder.start(250);
      });
    };

    ws.current.onmessage = (message) => {
      try {
        const received = JSON.parse(message.data);
        const newTranscript = received.channel?.alternatives[0]?.transcript;
        if (newTranscript) {
          setTranscript((prev) => prev + " " + newTranscript);
        }
      } catch (err) {
        console.error("JSON parse error", err, message.data);
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = (event) => {
      console.warn("WebSocket closed:", event.reason);
    };

    return () => {
      mediaRecorder.current?.stop();
      ws.current?.close();
    };
  }, []);

  return (
    <div className="videotrans">
      <div
        className="accordion translation"
        id="accordionPanelsStayOpenExample"
      >
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              <h3>Transcription </h3>
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="panelsStayOpen-headingOne"
          >
            <div className="accordion-body">
              <div className="details">{transcript}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="videoMainTrans">
        <div className="mainVideocallSec">
          <div className="localVideo">
            <h2>{currentUserName}</h2>
            <div ref={localVideoRef} className="videoBox"></div>
          </div>
          <div className="remoteVideo">
            <h2>{remoteUserName}</h2>
            <div ref={remoteVideoRef} className="videoBox"></div>
          </div>
        </div>
        <div className="controls">
          <Button onClick={toggleAudio} className="video-control-btn">
            {audioEnabled ? <MdMic size={25} /> : <MdMicOff size={25} />}
          </Button>
          <Button className="decline-call-btn" onClick={rejectCall}>
            <MdCallEnd size={22} />
          </Button>
          <Button onClick={toggleVideo} className="video-control-btn">
            {videoEnabled ? (
              <MdVideocam size={25} />
            ) : (
              <MdVideocamOff size={25} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetVideoCall;
