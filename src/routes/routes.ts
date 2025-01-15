
import {lazy} from 'react';

export const ROUTES = [
  {
    path: '/',
    exact: true,
    component: lazy(() => import('../pages/allagents/index.tsx')),
    name: 'main',
    isPrivate: false,
  },
  {
    path: '/create-agent',
    exact: true,
    component: lazy(() => import('../pages/createagent/index.tsx')),
    name: 'createagent',
    isPrivate: false,
  }
];