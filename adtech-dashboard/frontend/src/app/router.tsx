import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";
import { MainLayout, ProtectedRoute, GuestRoute } from "../components/layout";
import { LazyPage } from "../components/ui";
import { ROUTES } from "../constants";

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const DashboardPage = lazy(() => import("../pages/dashboard/DashboardPage"));
const CampaignsPage = lazy(() => import("../pages/campaigns/CampaignsPage"));
const CampaignNewPage = lazy(
  () => import("../pages/campaigns/children/CampaignNewPage"),
);
const CampaignDetailPage = lazy(
  () => import("../pages/campaigns/children/CampaignDetailPage"),
);
const NotFoundPage = lazy(() => import("../pages/errors/NotFoundPage"));

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
    ],
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
            path: "*",
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
    path: "/",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);
