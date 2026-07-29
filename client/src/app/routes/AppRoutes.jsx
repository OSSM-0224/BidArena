import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PublicRoute from "../protectedRoutes/PublicRoute";
import AuthLayout from "../layouts/AuthLayout";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import ProtectedRoute from "../protectedRoutes/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "@/features/dashboard/pages/Dashboard";

const AppRoutes = () => {
  let router = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoute />,
      children: [
        {
          path: "",
          element: <AuthLayout />,
          children: [
            {
              path: "",
              element: <Login />,
            },
            {
              path: "register",
              element: <Register />,
            },
          ],
        },
      ],
    },
    {
      path: "/dashboard",
      element: <ProtectedRoute />,
      children: [
        {
          path: "",
          element: <DashboardLayout />,
          children: [
            {
              path: "",
              element: <Dashboard />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router}/>;
};

export default AppRoutes;
