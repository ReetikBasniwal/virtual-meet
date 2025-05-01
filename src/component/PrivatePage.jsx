import { Navigate } from "react-router-dom"

export const PrivatePage = ({ children, user }) => {
  return user ? children : <Navigate to="/"></Navigate>;
}
