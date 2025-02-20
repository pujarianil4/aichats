import { ReactNode, Suspense, useEffect, useState } from "react";

import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "./routes.ts";

import Navbar from "../components/navbar/index.tsx";
import Footer from "../components/footer/index.tsx";
import PageLoader from "../components/common/PageLoader.tsx";
import { useAppSelector } from "../hooks/reduxHooks.tsx";
import { getTokens } from "../services/apiconfig.ts";
import DiscordCallback from "../pages/discordCallback/DiscordCallback.tsx";

interface IRoutesProps {
  children: ReactNode;
}

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = useAppSelector((state) => state.user.profile.token);
  const [isHydrated, setIsHydrated] = useState(false);
  const cookies = getTokens();
  useEffect(() => {
    if (token !== undefined) {
      setIsHydrated(true);
    }
  }, [token]);

  if (!isHydrated) {
    return cookies.token ? <PageLoader /> : <Navigate to='/' replace />;
  }

  return token ? (
    <div style={{ minHeight: "70vh" }}>{children as JSX.Element}</div>
  ) : (
    <Navigate to='/' replace />
  );
}

function PublicRoute(props: IRoutesProps) {
  const { children } = props;
  return <div style={{ minHeight: "70vh" }}>{children as JSX.Element}</div>;
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Navbar />
      <Routes>
        {ROUTES.map((route) =>
          route.isPrivate ? (
            <Route
              key={route.name}
              path={route.path}
              element={
                <PrivateRoute>
                  <route.component />
                </PrivateRoute>
              }
            />
          ) : (
            <Route
              key={route.name}
              path={route.path}
              element={
                route.exact ? (
                  <PublicRoute>
                    <route.component />
                  </PublicRoute>
                ) : (
                  <route.component />
                )
              }
            />
          )
        )}
        <Route path='/api/callback/discord' element={<DiscordCallback />} />
        <Route
          path='*'
          element={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
              }}
            >
              <h1>404 Page Not Found</h1>
            </div>
          }
        />
      </Routes>
      <Footer />
    </Suspense>
  );
}

export default AppRoutes;
