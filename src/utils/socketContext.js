import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "./config";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        // socket.connect();

        socket.on("connect", () => {
            setIsConnected(true);
            console.log("Socket Connected:", socket.id);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            console.log("Socket Disconnected");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};


export const useSocket = () => useContext(SocketContext);
