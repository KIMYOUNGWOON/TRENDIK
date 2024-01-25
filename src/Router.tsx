import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Main from "./pages/Main/Main";
import Join from "./pages/Join";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Main /> },
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
