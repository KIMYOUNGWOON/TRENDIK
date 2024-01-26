import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Main from "./pages/Main/Main";
import Join from "./pages/Join";
import Login from "./pages/Login";
import AuthLayout from "./components/AuthLayout";
import Menu from "./pages/Menu";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Main /> },
      { path: "/menu", element: <Menu /> },
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
