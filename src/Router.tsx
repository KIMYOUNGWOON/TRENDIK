import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Main from "./pages/Main/Main";
import Menu from "./pages/Menu/Menu";
import ProfileEdit from "./pages/ProfileEdit/ProfileEdit";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import UserLookAround from "./pages/UserLookAround/UserLookAround";
import UserHome from "./pages/UserHome/UserHome";
import AuthLayout from "./components/AuthLayout";
import Join from "./pages/Join";
import Login from "./pages/Login";
import FollowerFollowing from "./pages/FollowerFollowing/FollowerFollowing";
import PostUpload from "./pages/PostUpload/PostUpload";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Main /> },
      { path: "/menu", element: <Menu /> },
      { path: "/profile-edit", element: <ProfileEdit /> },
      { path: "/account-info", element: <AccountInfo /> },
      { path: "/users", element: <UserLookAround /> },
      { path: "/users/:userId", element: <UserHome /> },
      { path: "/users/:userId/:select", element: <FollowerFollowing /> },
      { path: "/posting", element: <PostUpload /> },
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
