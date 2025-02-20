import { io } from "socket.io-client";

const SOCKET_URL = "wss://chat-service-rq16.onrender.com";
const SOCKET_URL_AGENT = "wss://ai-agent-r139.onrender.com";
// const SOCKET_URL = "http://localhost:8080"; // Update with your server URL
const socket = io(SOCKET_URL, { transports: ["websocket"] });
// const socketAgent = io(SOCKET_URL_AGENT, { transports: ["websocket"] });

export default socket;
// export { socketAgent };
