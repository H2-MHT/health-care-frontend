import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import "../doctor-dashboard/Calls/IncomingCall.css"
import { fetchData, postData } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { useNavigate } from "react-router-dom";
import { WEB_SOCKET_URL } from "../../../hooks/services/apiUrl";

const VideoCall2 = ({ selectedChat, showModal, setShowModal, senderUserId, receiverUserId }) => {
  const [joined, setJoined] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [localTracks, setLocalTracks] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [currentUserName, setCurrentUserName] = useState([]);
  const [remoteUserName, setRemoteUserName] = useState([]);
  const [agoraReceiverUserUid, setAgoraReceiverUserUid] = useState();
  const [isCallConnected, setIsCallConnected] = useState(false);
  const navigate = useNavigate();
  const [transcript, setTranscript] = useState('');
  const ws = useRef(null);
  const mediaRecorder = useRef(null);

  const uid = senderUserId ? senderUserId : selectedChat?.sender; // Unique identifier for local user
  const receiverUid = receiverUserId ? receiverUserId : selectedChat?.receiver;


  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  const audio = new Audio('/images/ringtone.ogg');

  const handleClose = () => {
    if (senderUserId && receiverUid) {
      navigate("/doctorchat")
    }
    window.location.reload()
    setShowModal(false);
  };

  const getCallDetails = async () => {
    try {
      let payload = {
        senderID: uid,
        receiverID: receiverUid
      }
      const response = await postData("video-call/video-chat/", payload);
      if (response?.status === 200) {
        let data = await response.json();
        setCurrentUserName(data?.currentUser?.currentUserName)
        setRemoteUserName(data?.remoteUser?.remoteUserName)
        await joinChannel(data);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  useEffect(() => {
    client.on("user-published", async (user, mediaType) => {
      console.log("Remote user published:", user, mediaType);
      if (senderUserId && receiverUid) {
        setAgoraReceiverUserUid(user.uid)
      }
      await client.subscribe(user, mediaType);

      if (mediaType === "video") {
        console.log("Playing remote video");
        user.videoTrack.play(remoteVideoRef.current);
      }

      if (mediaType === "audio") {
        console.log("Playing remote audio");
        user.audioTrack.play();
      }
    });

    client.on("user-left", (user) => {
      // rejectCall();
      console.log(`User ${user.uid} left the channel`);
    });

    client.on("user-unpublished", (user) => {
      console.log(`User ${user.uid} unpublished`);
      // rejectCall();
      // Handle when the remote user stops publishing their stream
    });
  }, [isCallConnected]);



  const joinChannel = async (data) => {
    try {
      const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks([microphoneTrack, cameraTrack]);
      // await client.join(appId, channel, token, uid);
      if (senderUserId && receiverUid) {
        setIsCallConnected(true)
      }

      let chatUid = senderUserId && receiverUid ? agoraReceiverUserUid : uid

      await client.join(data?.app_id, data?.channel, data?.token, chatUid);
      await client.publish([microphoneTrack, cameraTrack]);

      cameraTrack.play(localVideoRef.current);

      if (!(senderUserId && receiverUid)) {
        let body = {
          deviceToken: data?.remoteUser?.firebase_token,
          title: "Hello!",
          body: "This is a test notification",
          caller: data?.remoteUser?.remoteUserName,
          senderUserId: uid.toString(),
          receiverUserId: receiverUid.toString()
        }

        const result = await postData('video-call/send-notification/', body)
      }

      setJoined(true)
      microphoneTrack.setEnabled(true);

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") user.videoTrack.play(remoteVideoRef.current);
        if (mediaType === "audio") user.audioTrack.play();
      });

      client.on("user-unpublished", (user) => {
        console.log(`User ${user.uid} unpublished`);
        // rejectCall();
      });

      client.on("user-left", (user) => {
        console.log(`User ${user.uid} left the channel`);
        // rejectCall();
      });
    } catch (error) {
      console.error("Error joining channel:", error);
    }
  };

  useEffect(() => {
    getCallDetails()
  }, []);

  // Reject Call
  const rejectCall = () => {
    console.log("Call Rejected");
    audio.pause();
    handleClose()
    setIncomingCall(null);
    leaveChannel()
  };

  const leaveChannel = async () => {
    try {
      localTracks.forEach((track) => track.stop() && track.close());
      await client.leave();
      setJoined(false);
      localStorage.setItem("isVideoActive", false)
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };

  const toggleAudio = () => {
    const microphoneTrack = localTracks[0];
    if (microphoneTrack) {
      if (audioEnabled) {
        microphoneTrack.setEnabled(false);
      } else {
        microphoneTrack.setEnabled(true);
      }
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    const cameraTrack = localTracks[1];
    if (cameraTrack) {
      if (videoEnabled) {
        cameraTrack.setEnabled(false);
      } else {
        cameraTrack.setEnabled(true);
      }
      setVideoEnabled(!videoEnabled);
    }
  };

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

        recorder.start(250); // Start sending audio chunks
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
      console.warn("WebSocket closed:", event, event.reason);
    };

    return () => {
      mediaRecorder.current?.stop();
      ws.current?.close();
    };
  }, []);

  return (
    <>
      <div className="videotrans">

        <div class="accordion translation" id="accordionPanelsStayOpenExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="panelsStayOpen-headingOne">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
              <h3>Transcription</h3>
              </button>
            </h2>
            <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
              <div class="accordion-body">
              <div className="details">{transcript}</div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="translation">
          <h3>Transcription</h3>
          <div className="details">{transcript}</div>
        </div> */}
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
            <>
              <button className="videobutton" onClick={toggleAudio}>
                {/* {audioEnabled ? "Mute" : "Unmute"} */}
                {audioEnabled ? <img src="/images/mic.webp" /> : <img src="/images/unmute.png" />}
              </button>
              <button className="videobutton" onClick={rejectCall}>
                <img src="/images/callCut.webp" />
              </button>
              <button className="videobutton" onClick={toggleVideo}>
                {videoEnabled ? <img src="/images/videoCall.webp" /> : <img src="/images/videoHide.png" />}

              </button>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoCall2;
