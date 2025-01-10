import { io } from "socket.io-client";

// const SOCKET_URL = "wss://chat-service-rq16.onrender.com"; // "http://localhost:8080"; // Update with your server URL
const SOCKET_URL = "http://localhost:8080"; // Update with your server URL
const socket = io(SOCKET_URL, { transports: ["websocket"] });

export default socket;
