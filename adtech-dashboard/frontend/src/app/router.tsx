import { createBrowserRouter, Navigate } from 'react-router';
import { lazy } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import { LazyPage } from '../components/ui';
import { ROUTES } from '../constants';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const CampaignsPage = lazy(() => import('../pages/CampaignsPage'));
const CampaignNewPage = lazy(() => import('../pages/CampaignNewPage'));
const CampaignDetailPage = lazy(() => import('../pages/CampaignDetailPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: (
      <LazyPage>
        <LoginPage />
      </LazyPage>
    ),
  },
  {
    path: ROUTES.REGISTER,
    element: (
      <LazyPage>
        <RegisterPage />
      </LazyPage>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: (
              <LazyPage>
                <DashboardPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.CAMPAIGN_NEW,
            element: (
              <LazyPage>
                <CampaignNewPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.CAMPAIGN_DETAIL,
            element: (
              <LazyPage>
                <CampaignDetailPage />
              </LazyPage>
            ),
          },
          {
            path: ROUTES.CAMPAIGNS,
            element: (
              <LazyPage>
                <CampaignsPage />
              </LazyPage>
            ),
          },
          {
            path: '*',
            element: (
              <LazyPage>
                <NotFoundPage />
              </LazyPage>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);
