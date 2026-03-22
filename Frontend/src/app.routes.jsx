import {createBrowserRouter} from "react-router";
import RootLayout from "./layouts/RootLayout";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import LandingPage from "./features/landing/pages/LandingPage";

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/",
                element: <LandingPage />
            },
            {
                path: "/home",
                element: <Protected><Home /></Protected>
            },
            {
                path: "/interview/:interviewId",
                element: <Protected><Interview /></Protected>
            }
        ]
    }
])