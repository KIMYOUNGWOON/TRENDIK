import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Main from "./pages/Main/Main";
import Join from "./pages/Join";
import Login from "./pages/Login";
import AuthLayout from "./components/AuthLayout";
import Menu from "./pages/Menu";
import ProfileEdit from "./pages/ProfileEdit/ProfileEdit";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import UserLookAround from "./pages/UserLookAround/UserLookAround";
import UserHome from "./pages/UserHome/Userhome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Main /> },
      { path: "/menu", element: <Menu /> },
      { path: "/profile-edit", element: <ProfileEdit /> },
      { path: "/account-info", element: <AccountInfo /> },
      { path: "/users", element: <UserLookAround /> },
      { path: "/users/:id", element: <UserHome /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/join",
        element: <Join />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
