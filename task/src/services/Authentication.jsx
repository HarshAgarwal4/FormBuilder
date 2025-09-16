import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/GlobalContext.jsx";
import axios from "./axios.jsx";

const ProtectedRoutes = ({ children }) => {
  const { user, loading} = useContext(AppContext); 

  if(loading) {
    return (<div>Loading...</div>)
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoutes;
