import React, { useState, useEffect, useContext, useRef } from "react";
import "../doctorChat/Chat.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchData, postData } from "../../../hooks/services/services";
import { showToast } from "../../../utils/toast";
import { Button, Modal } from "react-bootstrap";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import VideoCall2 from "./VideoCall2";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const DoctorChat = () => {
  const { t } = useTranslation();
  const [unreadCounts, setUnreadCounts] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState();
  const [filterMessages, setFilterMessages] = useState([]);
  const chatContainerRef = useRef(null); // Ref for the chat message container
  const [contactList, setContactList] = useState([]);
  const navigate = useNavigate();
  // const messagesEndRef = useRef(null); // Reference to the last message
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [searchParams] = useSearchParams();
  const senderUserId = searchParams.get("senderUserId");
  const receiverUserId = searchParams.get("receiverUserId");

  const [socket, setSocket] = useState(null);
  let { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user === "Clinic") {
      getDoctorListForClinic();
    } else if (user === "Patient") {
      getDoctorListForPatient();
    } else if (user === "Doctor") {
      getUsersForDoctor();
    }
  }, [user]);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://backend.h2.doctor/ws/chat/${selectedChat?.room_name}?token=${token}`
    );

    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = (event) => {
      console.log("Message Received:", event.data);
      setFilterMessages((prevMessages) => [
        ...prevMessages,
        JSON.parse(event.data),
      ]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [selectedChat]);

  useEffect(() => {
    if (search) {
      setFilteredUsers(
        users?.filter((user) =>
          user?.name?.toLowerCase().includes(search?.toLowerCase())
        )
      );
    } else {
      setFilteredUsers([]);
    }
  }, [search, users]);

  useEffect(() => {
    getSelectedUserChat(selectedChat);
  }, [selectedChat]);

  const getDoctorListForPatient = async () => {
    try {
      const response = await fetchData("patient/doctor-associated-to-patient/");
      if (!response.ok)
        throw new Error("Failed to fetch data from the server.");
      const getData = await response.json();
      setUsers(
        Array.isArray(getData?.data?.associated_doctors)
          ? getData?.data?.associated_doctors
          : []
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUsersForDoctor = async () => {
    try {
      // Run both fetches in parallel
      const [clinicRes, patientRes] = await Promise.all([
        fetchData("doctors/clinics-associated-to-doctors/"),
        fetchData("doctors/patient-associated-to-doctors/"),
      ]);

      // Check responses
      if (!clinicRes.ok || !patientRes.ok)
        throw new Error("Failed to fetch data from the server.");

      const [clinicData, patientData] = await Promise.all([
        clinicRes.json(),
        patientRes.json(),
      ]);

      const clinics = clinicData?.data?.clinic || [];
      const patients = patientData?.data?.patients || [];

      // Combine both
      const combinedUsers = [clinics, ...patients];
      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const getDoctorListForClinic = async () => {
    try {
      const response = await fetchData("clinics/doctor-associated-to-clinic/");
      if (!response.ok)
        throw new Error("Failed to fetch data from the server.");
      const getData = await response.json();
      setUsers(
        Array.isArray(getData?.data)
          ? getData.data
          : []
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("WebSocket is open. Sending message...");
      const obj = {
        action: "chat_message",
        message: newMessage,
      };
      socket.send(JSON.stringify(obj));
      console.log("Message sent successfully:", obj);
      setNewMessage("");
      getSelectedUserChat();
    } else {
      console.error("WebSocket is not open. Message not sent.");
    }
  };
  const getSelectedUserChat = async (receiver) => {
    if (!receiver) return;
    try {
      const response = await fetchData(
        `chat/chat-message/${receiver?.id}`,
        navigate
      );
      if (!response) {
        navigate("/login");
        return;
      }

      const getData = await response.json();
      setFilterMessages(getData);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [filterMessages]);

  const getChatRoom = async () => {
    try {
      const response = await fetchData("chat/chat-room/", navigate);
      if (!response) {
        navigate("/login");
        return;
      }
      const getData = await response.json();
      if (getData) {
        getChatMessages(getData[0]?.receiver);
        setContactList(getData);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const getChatMessages = async (id) => {
    if (!id) {
      return;
    }
    const payload = {
      receiver_id: id,
    };
    try {
      const response = await postData("chat/chat-room/", payload);
      if (response?.status === 200) {
        let data = await response.json();
        setSelectedChat(data[0]);
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  useEffect(() => {
    getChatRoom();
  }, []);

  useEffect(() => {
    if (senderUserId && receiverUserId) {
      setShowModal(true);
    }
  }, [senderUserId, receiverUserId]);

  const handleChatSelection = (user) => {
    setSelectedChat(user);
  };

  const formatLastSeen = (lastSeen) => {
    if (lastSeen) {
      const date = parseISO(lastSeen);
      if (isToday(date)) {
        return `Last seen at ${format(date, "h:mm a")}`;
      } else if (isYesterday(date)) {
        return `Last seen yesterday at ${format(date, "h:mm a")}`;
      } else {
        return `Last seen on ${format(date, "MMMM d 'at' h:mm a")}`;
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="rightContent">
      {/* Chat List */}
      <div className="chatGroup">
        <div className="chatLeft">
          <div className="chatMember bg-white border-radius-20 padding-20">
            <div className="top">
              <h5>Chats</h5>
              <div className="sortSearchArea mb-0">
                <div className="search">
                  <input
                    type="search"
                    placeholder="search"
                    onChange={(e) => setSearch(e?.target?.value)}
                  />
                  <a href="#">
                    <img src="../images/search-dark.svg" alt="Search Icon" />
                  </a>
                </div>
                {search && filteredUsers?.length > 0 && (
                  <div className="searchResults">
                    {filteredUsers?.map((user) => (
                      <div
                        key={user.id}
                        className="chattingPart cursor-pointer"
                        onClick={() => {
                          getChatMessages(user?.id);
                          setSearch(""); // clear search after selection
                        }}
                      >
                        <div className="img-parallel">
                          <img
                            src={
                              user?.profile_picture || "../images/sample.png"
                            }
                            className="img-fluid"
                            alt="Profile"
                          />
                          <div>
                            <p className="sender">{user?.name}</p>
                            <p className="sender">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Display Chat List */}
            <div className="chattingArea">
              {contactList
                ?.filter((msg) => !msg.sent)
                .map((contact) => (
                  <div
                    key={contact?.id}
                    className={`chattingPart cursor-pointer ${
                      selectedChat?.id === contact?.id ? "active-chat" : ""
                    }`}
                    onClick={() => handleChatSelection(contact)}
                  >
                    <div
                      className={`img-parallel position-relative ${
                        contact?.sent ? "right" : "left"
                      }`}
                    >
                      <img
                        src={contact?.profile_picture || "../images/sample.png"}
                        className="img-fluid "
                        alt="Profile"
                      />
                      {contact?.is_online == "True" ||
                        (contact?.is_online && (
                          <div className="notificationDot"></div>
                        ))}
                      <div>
                        <p className="sender">{contact?.first_name}</p>
                        <p
                          className={`message-text ${
                            contact?.sent ? "sent" : "received"
                          }`}
                        >
                          {contact?.content}
                        </p>
                      </div>
                    </div>
                    <p className="message-time">{contact?.time}</p>
                    {/* Unread Message Notification */}
                    {unreadCounts[contact?.sender] > 0 && (
                      <div className="chattingTicks">
                        <div className="messageUnread">
                          {unreadCounts[contact?.sender]}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="chatRight">
          {selectedChat ? (
            <div className="callingChat bg-white padding-20 border-radius-20">
              {/* Chat Header */}
              <div className="top">
                <div className="img-parallel">
                  {/* <img src="images/doctor-dashboard/profile-sample.png" className="img-fluid" alt="Profile" /> */}
                  <img
                    src={
                      selectedChat?.profile_picture || "../images/sample.png"
                    }
                    className="img-fluid"
                    alt="Profile"
                  />
                  <div>
                    <p>
                      {selectedChat
                        ? selectedChat?.first_name
                        : "Select a Chat"}
                    </p>
                    <span>
                      {selectedChat?.is_online == "True" ||
                      selectedChat?.is_online == true
                        ? "Online"
                        : `Offline ${
                            selectedChat?.last_seen
                              ? `- ${formatLastSeen(selectedChat?.last_seen)}`
                              : ""
                          }`}
                    </span>
                  </div>
                </div>
                <div className="callSetting d-flex align-items-center">
                  <a href="#">
                    <img
                      src="/images/doctor-dashboard/calling.webp"
                      alt="Call Icon"
                    />
                  </a>
                  <Link onClick={() => setShowModal(true)}>
                    <img
                      src="/images/doctor-dashboard/videocallblue.webp"
                      alt="Video Call Icon"
                    />
                  </Link>
                  <a href="#">
                    <img
                      src="/images/doctor-dashboard/3dots_blue.webp"
                      alt="Menu Icon"
                    />
                  </a>
                </div>
              </div>

              {/* Chat Display */}
              <div ref={chatContainerRef} className="chattingPoint message">
                {filterMessages?.map((msg) => (
                  <>
                    {msg?.message && (
                      <div
                        key={msg?.id}
                        className={` ${
                          msg.send
                            ? "message-sent chat-msg"
                            : "message-reciever"
                        }`}
                        style={{ display: "grid" }}
                      >
                        <span>{msg?.message}</span>
                        <div style={{ fontSize: "10px" }} className="timestamp">
                          {msg?.doc}
                        </div>
                      </div>
                    )}
                  </>
                ))}
              </div>

              {/* Chat Input */}
              <div className="chattingSendArea">
                <a href="#">
                  <img
                    src="/images/doctor-dashboard/attachment.webp"
                    width="30"
                    alt="Attachment"
                  />
                </a>
                <input
                  type="text"
                  placeholder="Type your text here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <div className="d-flex align-items-center gap-2">
                  <a href="#">
                    <img
                      src="/images/doctor-dashboard/micBlue.webp"
                      width="50"
                      alt="Mic"
                    />
                  </a>
                  <a onClick={handleSendMessage}>
                    <img
                      src="/images/doctor-dashboard/chatSend.webp"
                      width="50"
                      alt="Send"
                    />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="callingChat bg-white treatmentContainer min-vh-100">
              <div className="no-appointments">
                {t("doctor-chat.no-messages")}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="videocallMain"
        backdrop="static"
      >
        <VideoCall2
          selectedChat={selectedChat}
          showModal={showModal}
          setShowModal={setShowModal}
          senderUserId={senderUserId}
          receiverUserId={receiverUserId}
        />
      </Modal>
    </div>
  );
};

export default DoctorChat;
