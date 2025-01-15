import { ReactNode, Suspense } from "react";

import { Navigate, Route } from "react-router-dom";
import { Routes } from "react-router";

import { ROUTES } from "./routes.ts";
import AgentListpage from "../pages/allagents/index.tsx";
import Navbar from "../components/navbar/index.tsx";
import Footer from "../components/footer/index.tsx";

interface IRoutesProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

function PrivateRoute(props: IRoutesProps) {
  const { children, isAuthenticated } = props;
  return isAuthenticated ? (children as JSX.Element) : <Navigate to='/login' />;
}

function PublicRoute(props: IRoutesProps) {
  const { children, isAuthenticated } = props;
  return isAuthenticated
    ? (children as JSX.Element)
    : (children as JSX.Element);
}

function AppRoutes() {
  // const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const isLoggedIn = true;
  console.log("ROUTES", ROUTES);

  return (
    <Suspense fallback={<div>loading...</div>}>
      <Navbar />
      <Routes>
        {/* <Route key='main' path='/' element={<AgentListpage />} /> */}
        {ROUTES.map((route) => (
          // route.isPrivate ? (
          //   <Route
          //     key={route.name}
          //     path={route.path}
          //     element={
          //       <PrivateRoute isAuthenticated={isLoggedIn}>
          //         <route.component />
          //       </PrivateRoute>
          //     }
          //   />
          // ) :
          <Route
            key={route.name}
            path={route.path}
            element={
              route.exact ? (
                <PublicRoute isAuthenticated={isLoggedIn}>
                  <route.component />
                </PublicRoute>
              ) : (
                <route.component />
              )
            }
          />
        ))}
      </Routes>
      <Footer />
    </Suspense>
  );
}

export default AppRoutes;
