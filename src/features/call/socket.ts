import { io } from "socket.io-client";

const SIGNALING_SERVER = "https://lovable-signaling.onrender.com";

export const socket = io(SIGNALING_SERVER, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": "*"
  }
});

socket.on("connect", () => {
  console.log("Connected to signaling server");
});

socket.on("connect_error", (error) => {
  console.error("Signaling server connection error:", error);
});

socket.on("disconnect", () => {
  console.log("Disconnected from signaling server");
});