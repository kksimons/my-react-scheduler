
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  user: any; // Replace `any` with `User` from Firebase if applicable
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="./userAuth/SignIn" />;
  }

  return children;
};

export default ProtectedRoute;
