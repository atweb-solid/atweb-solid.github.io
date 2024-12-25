import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

export const routes: RouteDefinition[] = [
    {
        path: '/',
        component: lazy(() => import('./pages/home')),
    },
    {
        path: '/edit/*page',
        component: lazy(() => import('./pages/edit')),
    },
    {
        path: '/page/:handle/*page',
        component: lazy(() => import('./pages/page')),
    },
    {
        path: '/preview/*page',
        component: lazy(() => import('./pages/preview')),
    },
    {
        path: '/rings',
        component: lazy(() => import('./pages/rings')),
    },
    {
        path: '/invited/:inviterDid/:ringAndInviteRkey',
        component: lazy(() => import('./pages/invited')),
    },
    {
        path: '**',
        component: lazy(() => import('./pages/errors/404')),
    },
];