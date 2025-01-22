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
    path: "/magic-build",
    exact: true,
    component: lazy(() => import("../pages/magicbuild/index.tsx")),
    name: "magicbuild",
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
    path: "/myagent",
    exact: true,
    component: lazy(() => import("../pages/myagents/index.tsx")),
    name: "myagents",
    isPrivate: false,
  },
  {
    path: "/myagent/:agentId",
    exact: true,
    component: lazy(() => import("../pages/myagents/agent/Agent.tsx")),
    name: "myagent",
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
