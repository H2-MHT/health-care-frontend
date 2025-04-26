import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import { useTranslation } from "react-i18next";

// Signaling server URL
const socket = io.connect('http://localhost:5000');

const VideoCall = () => {
  const { t } = useTranslation();
  const [isInCall, setIsInCall] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Set up local stream (user's camera)
  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    getUserMedia();

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleNewICECandidate);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleNewICECandidate);
    };
  }, []);

  // Create peer connection
  const createPeerConnection = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302', // Google STUN server
        },
      ],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          target: socket.id,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peer.addTrack(track, localStream);
      });
    }

    return peer;
  };

  // Handle Offer from remote peer
  const handleOffer = async (data) => {
    const peer = createPeerConnection();
    setPeerConnection(peer);

    await peer.setRemoteDescription(new RTCSessionDescription(data.offer));

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit('answer', {
      target: data.target,
      answer: answer,
    });
  };

  // Handle Answer from remote peer
  const handleAnswer = (data) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  };

  // Handle ICE candidates from remote peer
  const handleNewICECandidate = (data) => {
    const candidate = new RTCIceCandidate(data.candidate);
    peerConnection.addIceCandidate(candidate);
  };

  // Start a call (send offer to another peer)
  const startCall = () => {
    const peer = createPeerConnection();
    setPeerConnection(peer);

    peer.createOffer().then(async (offer) => {
      await peer.setLocalDescription(offer);
      socket.emit('offer', {
        target: socket.id, // You'd send this to the other peer's ID in a real application
        offer: offer,
      });
      setIsInCall(true);
    });
  };

  return (
    <div className="App">
      <h1>WebRTC {t("video-call.video-call")}</h1>
      <div className="video-container">
        <div>
          <h2>{t("video-call.your-video")}</h2>
          <video ref={localVideoRef} autoPlay muted width="300" />
        </div>
        <div>
          <h2>{t("video-call.remote-video")}</h2>
          <video ref={remoteVideoRef} autoPlay width="300" />
        </div>
      </div>
      <div>
        {!isInCall && (
          <button onClick={startCall}>{t("video-call.start-call")}</button>
        )}
      </div>
    </div>
  );
}

export default VideoCall;
