import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import Join from "./pages/Join";
import Login from "./pages/Login";
import Main from "./pages/Main/Main";
import Menu from "./pages/Menu/Menu";
import ProfileEdit from "./pages/ProfileEdit/ProfileEdit";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import UserLookAround from "./pages/UserLookAround/UserLookAround";
import UserHome from "./pages/UserHome/UserHome";
import FollowerFollowing from "./pages/FollowerFollowing/FollowerFollowing";
import PostUpload from "./pages/PostUpload/PostUpload";
import FeedDetail from "./pages/FeedDetail/FeedDetail";
import FeedEdit from "./pages/FeedEdit/FeedEdit";
import PickFeed from "./pages/PickFeed/PickFeed";
import FeedLookAround from "./pages/FeedLookAround/FeedLookAround";
import SearchFeeds from "./pages/SearchFeeds/SearchFeeds";
import FilterFeeds from "./pages/FilterFeeds/FilterFeeds";

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
      { path: "/feeds", element: <FeedLookAround /> },
      { path: "/feeds/search", element: <SearchFeeds /> },
      { path: "/feeds/filter", element: <FilterFeeds /> },
      { path: "/feeds/:postId", element: <FeedDetail /> },
      { path: "/feeds/:postId/edit", element: <FeedEdit /> },
      { path: "/:userId/picks", element: <PickFeed /> },
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
