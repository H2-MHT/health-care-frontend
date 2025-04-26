import { io } from "socket.io-client";

const URL = "http://209.38.123.166:8080";
const Socket_URL = "http://localhost:5000";
export const socket = io(URL, {
    autoConnect: false, // Don't auto-connect
    reconnection: true, // Enable auto-reconnect
    reconnectionAttempts: 10,
    reconnectionDelay: 500,
    transports: ["websocket"], // Ensure websocket is used, not polling
});


