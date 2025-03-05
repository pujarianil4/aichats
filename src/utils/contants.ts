export const authSignMsg = `Sign this message to prove you have access to this wallet in order to sign in. This won't cost you any Gas. Date: ${Date.now()}`;

export const FBXMAP = [
  {
    path: "/fbx/anim/idle.fbx",
    label: "idle",
  },
  {
    path: "/fbx/anim/happy_twist.fbx",
    label: "happy_twist",
  },
  {
    path: "/fbx/anim/happy_soul.fbx",
    label: "happy_soul",
  },
  {
    path: "/fbx/anim/happy_rumba.fbx",
    label: "happy_rumba",
  },
  {
    path: "/fbx/anim/sad_crying.fbx",
    label: "sad_crying",
  },
  {
    path: "/fbx/anim/sad_rejected.fbx",
    label: "sad_rejected",
  },
  {
    path: "/fbx/anim/sad_idle.fbx",
    label: "sad_idle",
  },
  {
    path: "/fbx/anim/neutral_greeting.fbx",
    label: "neutral_greeting",
  },
  {
    path: "/fbx/anim/neutral_thankful.fbx",
    label: "neutral_thankful",
  },
  {
    path: "/fbx/anim/neutral_kiss.fbx",
    label: "neutral_kiss",
  },
];

export const ACTIONMAP = [
  {
    label: "HAPPY",
    path: [
      "/fbx/anim/happy_twist.fbx",
      "/fbx/anim/happy_soul.fbx",
      "/fbx/anim/happy_rumba.fbx",
    ],
  },
  {
    label: "CRY",
    path: [
      "/fbx/anim/sad_crying.fbx",
      "/fbx/anim/sad_rejected.fbx",
      "/fbx/anim/sad_idle.fbx",
    ],
  },
  {
    label: "NEUTRAL",
    path: [
      "/fbx/anim/neutral_greeting.fbx",
      "/fbx/anim/neutral_thankful.fbx",
      "/fbx/anim/neutral_kiss.fbx",
    ],
  },
];

export const API_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": true,
  "access-control-allow-origin": "http://localhost:3000",
};

export const WS_HEADERS = {
  "access-control-allow-origin": "*",
  vary: "Origin",
};
