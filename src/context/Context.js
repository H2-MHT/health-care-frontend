import React, { useState, useEffect, useRef, createContext } from "react";
import Peer from "simple-peer";
import { socket } from "../utils/config";
import { formatTime } from "../utils/common";

const VideoCallContext = createContext();

const VideoCallProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [userStream, setUserStream] = useState(null);
  const [call, setCall] = useState({});
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [myUserId, setMyUserId] = useState(10);
  const [partnerUserId, setPartnerUserId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [name, setName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [isMyVideoActive, setIsMyVideoActive] = useState(true);
  const [isPartnerVideoActive, setIsPartnerVideoActive] = useState();
  const [isMyMicActive, setIsMyMicActive] = useState(true);
  const [isPartnerMicActive, setIsPartnerMicActive] = useState();
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const myVideoRef = useRef();
  const partnerVideoRef = useRef();
  const peerConnectionRef = useRef();
  const screenShareTrackRef = useRef();

  let selectedUser = localStorage.getItem("user_data")
  selectedUser = JSON.parse(selectedUser)


  let chatUser = localStorage.getItem("SelectedUser")
  chatUser = JSON.parse(chatUser)

  useEffect(()=>{
    setMyUserId(selectedUser?.id)
  },[])
  
  useEffect(() => {
    console.log(">>>>>inside useeffect")
    const getUserMediaStream = async () => {
    console.log(">>>>>>>>>>>>getUserMediaStream")
      try {
        const stream = await navigator?.mediaDevices?.getUserMedia({
          video: true,
          audio: true,
        });
        setUserStream(stream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    const handleSocketEvents = () => {
      socket.on("socketId", (id) => {
        setMyUserId(id);
      });

      socket.on("mediaStatusChanged", ({ mediaType, isActive }) => {
        console.log(">>>>>>>>>>>>>>>>>>>mediaStatusChanged",mediaType, isActive)
        if (isActive !== null) {
          if (mediaType === "video") {
            setIsPartnerVideoActive(isActive);
          } else if (mediaType === "audio") {
            setIsPartnerMicActive(isActive);
          } else {
            setIsPartnerMicActive(isActive[0]);
            setIsPartnerVideoActive(isActive[1]);
          }
        }
      });

      socket.on("callTerminated", () => {
        setIsCallEnded(true);
      });

      socket.on("incomingCall", ({ from, name, signal }) => {
        console.log(">>>>>>>incoming Call", from, name, signal)
        setCall({ isReceivingCall: true, from, name, signal });
      });

      socket.on("receiveMessage", ({ message: text, senderName }) => {
        const receivedMsg = { text, senderName };
        setReceivedMessage(receivedMsg);

        const timeout = setTimeout(() => {
          setReceivedMessage({});
        }, 1000);

        return () => clearTimeout(timeout);
      });
    };

    getUserMediaStream();
    handleSocketEvents();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      // Ensure myVideoRef always has the user's stream
      if (myVideoRef.current && !myVideoRef.current.srcObject && userStream) {
        console.log("Assigning userStream to myVideoRef...");
        myVideoRef.current.srcObject = userStream;
      }
  
      // Ensure partnerVideoRef always has the opponent's stream
      if (partnerVideoRef.current && !partnerVideoRef.current.srcObject && peerConnectionRef.current) {
        console.log("Attempting to assign stream to partnerVideoRef...");
        const streams = peerConnectionRef.current.streams || [];
        if (streams.length > 0) {
          partnerVideoRef.current.srcObject = streams[0];
        }
      }
    }, 1000); // Check every second
  
    return () => clearInterval(interval);
  }, [userStream, myVideoRef, partnerVideoRef]);
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (myVideoRef.current && !myVideoRef.current.srcObject && userStream) {
        console.log("myVideoRef srcObject is null. Reassigning stream...");
        myVideoRef.current.srcObject = userStream;
      }
    }, 1000); // Check every second
  
    return () => {
      clearInterval(intervalId); // Clear interval on unmount
    };
  }, [myVideoRef, userStream]);
  

  useEffect(() => {
    if (myVideoRef.current && userStream) {
      console.log("myVideoRef.current is ready. Assigning stream...");
      myVideoRef.current.srcObject = userStream;
    } else {
      console.log("Either myVideoRef.current is undefined or userStream is not set.");
    }
  }, [myVideoRef, userStream]);
  

  const receiveCall = async () => {
    if (!userStream) {
      await getUserMediaStream(); // Ensure userStream is ready
    }

    setIsCallAccepted(true);
    setPartnerUserId(call.from);
  
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: userStream, // Pass the local stream here
    });

    peer.on("stream", (currentStream) => {
      if (partnerVideoRef.current) {
        console.log("Partner video ref is ready. Assigning stream.");
        partnerVideoRef.current.srcObject = currentStream;
      } else {
        console.error("partnerVideoRef.current is undefined. Retrying...");
        const interval = setInterval(() => {
          if (partnerVideoRef.current) {
            console.log("Successfully found partnerVideoRef. Assigning stream.");
            partnerVideoRef.current.srcObject = currentStream;
            clearInterval(interval);
          }
        }, 1000);
    
        return () => {
          clearInterval(interval); // Clear interval on unmount
        };
      }

      if (myVideoRef.current) {
        console.log("myvideo ref is ready. Assigning stream.");
        myVideoRef.current.srcObject = userStream;
      } else {
        console.error("myVideoRef.current is undefined. Retrying...");
        const interval = setInterval(() => {
          if (myVideoRef.current) {
            console.log("Successfully found myVideoRef. Assigning stream.");
            myVideoRef.current.srcObject = userStream;
          }
        }, 1000);
    
        return () => {
          clearInterval(interval); // Clear interval on unmount
        };
      }
    });
    
  
    peer.on("signal", (data) => {
      socket.emit("answerCall", {
        signal: data,
        to: call.from,
        userName: name,
        mediaType: "both",
        mediaStatus: [isMyMicActive, isMyVideoActive],
      });
    });
  
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = userStream;
    } else {
      console.error("myVideoRef is undefined!");
    }
  
    peer.signal(call.signal);
    peerConnectionRef.current = peer;
  };
  
  
  const getUserMediaStream = async () => {
    if (!userStream) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setUserStream(stream);
  
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }
        if (partnerVideoRef.current) {
          partnerVideoRef.current.srcObject = userStream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    }
  };
  

  const callUser = (targetId) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: userStream,
    });
    setPartnerUserId(targetId);
    peer.on("stream", (currentStream) => {
      if (partnerVideoRef.current) {
        console.log("Partner video ref is ready. Assigning stream.");
        partnerVideoRef.current.srcObject = currentStream;
      } else {
        console.error("partnerVideoRef.current is undefined. Retrying...");
        const interval = setInterval(() => {
          if (partnerVideoRef.current) {
            console.log("Successfully found partnerVideoRef. Assigning stream.");
            partnerVideoRef.current.srcObject = currentStream;
            clearInterval(interval);
          }
        }, 100);
    
        return () => {
          clearInterval(interval); // Clear interval on unmount
        };
      }
    });
    
    
    const handleSignal = (data) => {
      socket.emit("initiateCall", {
        targetId,
        signalData: data,
        senderId: myUserId,
        senderName: selectedUser?.first_name+" "+selectedUser?.last_name,
      });
    };

    const handleStream = (currentStream) => {
      partnerVideoRef.current.srcObject = currentStream;
    };


    const joinAcceptedCall = ({ signal, userName }) => {
      console.log(">>>>>>>>>>>>joined")
      setIsCallAccepted(true);
      setOpponentName(userName);
      getUserMediaStream();
      peer.signal(signal);
      socket.emit("changeMediaStatus", {
        mediaType: "both",
        isActive: [isMyMicActive, isMyVideoActive],
      });
    };

    peer.on("signal", handleSignal);
    // peer.on("stream", handleStream);
    socket.on("callAnswered", joinAcceptedCall);
    peerConnectionRef.current = peer;
  };


  const toggleVideo = () => {
    const newStatus = !isMyVideoActive;
    setIsMyVideoActive(newStatus);

    userStream?.getVideoTracks().forEach((track) => {
      track.enabled = newStatus;
    });

    socket.emit("changeMediaStatus", {
      mediaType: "video",
      isActive: newStatus,
    });

    return newStatus;
  };

  const toggleMicrophone = () => {
    const newStatus = !isMyMicActive;
    setIsMyMicActive(newStatus);

    userStream.getAudioTracks().forEach((track) => {
      track.enabled = newStatus;
    });

    socket.emit("changeMediaStatus", {
      mediaType: "audio",
      isActive: newStatus,
    });

    return newStatus;
  };
  

  const toggleScreenSharingMode = () => {
    if (!isMyVideoActive) {
      alert("Please turn on your video to share the screen");
      return;
    }
    if (!isScreenSharing) {
      navigator.mediaDevices
        .getDisplayMedia({ cursor: true })
        .then((screenStream) => {
          const screenTrack = screenStream.getTracks()[0];
          const videoTracks = peerConnectionRef.current.streams[0].getTracks();
          const videoTrack = videoTracks.find(
            (track) => track.kind === "video"
          );
          peerConnectionRef.current.replaceTrack(
            videoTrack,
            screenTrack,
            userStream
          );
          screenTrack.onended = () => {
            peerConnectionRef.current.replaceTrack(
              screenTrack,
              videoTrack,
              userStream
            );
            myVideoRef.current.srcObject = userStream;
            setIsScreenSharing(false);
          };
          myVideoRef.current.srcObject = screenStream;
          screenShareTrackRef.current = screenTrack;
          setIsScreenSharing(true);
        })
        .catch((error) => {
          console.log("Failed to get screen sharing stream");
        });
    } else {
      screenShareTrackRef.current.stop();
      screenShareTrackRef.current.onended();
    }
  };

  const toggleFullScreen = (e) => {
    const element = e.target;

    if (!document.fullscreenElement) {
      element.requestFullscreen().catch((err) => {
        console.error(`Error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const endCall = () => {
    console.log(">>>>>>endCall")
    setIsCallEnded(true);
    socket.emit("terminateCall", { targetId: selectedUser?.user_id });
    peerConnectionRef.current.destroy();
    // window.location.reload();
  };

  const endIncomingCall = () => {
    console.log(">>>>>>endIncomingCall", selectedUser?.user_id)
    socket.emit("terminateCall", { targetId: selectedUser?.user_id });
  };

  const sendMessage = (text) => {
    console.log(">>>>>>>>>>>>>>>>jjjjjjjjjjjjjjj", text, partnerUserId, name)
    const newMessage = {
      message: text,
      type: "sent",
      time: formatTime(new Date()),
      sender: name,
      id: selectedUser?.user_id
    };

    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    socket.emit("sendMessage", {
      receiver_id: partnerUserId,
      message: text,
      senderName: name,
    });
  };

  const sendChatMessage = (text) => {
    console.log(">>>>>>>>>>>>>>>>jjjjjjjjjjjjjjj", selectedUser)
    const newMessage = {
      id: selectedUser?.id,
      message: text,
      sent: true,
      sender: selectedUser?.first_name+" "+selectedUser?.last_name,
      time: formatTime(new Date())
    };

    if (!socket.connected) {
      console.log(">>>>>>Socket not connected! Trying to reconnect...");
      socket.connect(); // Reconnect manually
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    console.log(">>>>>>>>>>>socccc", socket.connected)
    socket.emit("sendMessage", {
      receiver_id: chatUser?.id,
      message: text,
      senderName: selectedUser?.first_name+" "+selectedUser?.last_name,
    });
  };

  return (
    <>
    {console.log(">>>>>>>>>>>>>>>>>>>mmmmmmmmmmmmmmmmmmm", myVideoRef)}
    <VideoCallContext.Provider
      value={{
        call,
        isCallAccepted,
        myVideoRef,
        partnerVideoRef,
        userStream,
        name,
        setName,
        isCallEnded,
        myUserId,
        callUser,
        endCall,
        receiveCall,
        sendMessage,
        sendChatMessage,
        receivedMessage,
        chatMessages,
        setChatMessages,
        setReceivedMessage,
        setPartnerUserId,
        endIncomingCall,
        opponentName,
        isMyVideoActive,
        setIsMyVideoActive,
        isPartnerVideoActive,
        setIsPartnerVideoActive,
        toggleVideo,
        isMyMicActive,
        isPartnerMicActive,
        toggleMicrophone,
        isScreenSharing,
        toggleScreenSharingMode,
        toggleFullScreen,
        setMessages,
        messages
      }}
    >
      {children}
    </VideoCallContext.Provider>
    </>
  );
};

export { VideoCallContext, VideoCallProvider };
