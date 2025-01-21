import { lazy } from "react";

export const ROUTES = [
  {
    path: "/",
    exact: true,
    component: lazy(() => import("../pages/allagents/index.tsx")),
    name: "main",
    isPrivate: false,
  },
  {
    path: "/create-agent",
    exact: true,
    component: lazy(() => import("../pages/createagent/index.tsx")),
    name: "createagent",
    isPrivate: false,
  },
  {
    path: "/my-agent",
    exact: true,
    component: lazy(() => import("../pages/myagents/index.tsx")),
    name: "createagent",
    isPrivate: false,
  },
  {
    path: "/agent/:agentId",
    exact: true,
    component: lazy(() => import("../pages/agentPage/index.tsx")),
    name: "agentPage",
    isPrivate: false,
  },
  {
    path: "/agent/create-chat-instance",
    exact: true,
    component: lazy(() => import("../pages/createChatInstance/index.tsx")),
    name: "agentPage",
    isPrivate: false,
  },
];
