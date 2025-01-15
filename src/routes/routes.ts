
import {lazy} from 'react';

export const ROUTES = [
  {
    path: '/',
    exact: true,
    component: lazy(() => import('../pages/allagents/index.tsx')),
    name: 'main',
    isPrivate: false,
  }
];