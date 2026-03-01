import { type FC, type JSX } from "react";
import { Navigate, Outlet } from "react-router";
import { useAppSelector, type RootState } from "@/app/hooks";

const GuestRoute: FC = (): JSX.Element => {
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
