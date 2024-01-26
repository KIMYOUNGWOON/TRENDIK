import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";

function AuthLayout() {
  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
}

export default AuthLayout;
