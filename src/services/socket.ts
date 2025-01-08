import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8080"; // Update with your server URL
const socket = io(SOCKET_URL, { transports: ["websocket"] });

export default socket;
