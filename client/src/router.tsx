import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthLayout } from "./pages/layouts/AuthLayout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import { RootLayout } from "./pages/layouts/RootLayout";
import { Home } from "./pages/Home";
import { NewChannel } from "./pages/channel/new";

const ContextWrapper = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "/channel",
            children: [{ path: "new", element: <NewChannel /> }],
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "signup",
            element: <Signup />,
          },
        ],
      },
    ],
  },
]);
