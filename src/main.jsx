import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import {PrimeReactProvider} from "primereact/api";
import App from "./App.jsx";
// tailwind css
import "./index.css";
// prim react css
import "primeicons/primeicons.css";

// recast router
import {
    createBrowserRouter, Navigate,
    RouterProvider,
} from "react-router-dom";

// Routes
import ErrorPage from "./routes/error-page.jsx";
import RegisterPage from "./routes/register.jsx";
import FilesPage from "./routes/documents.jsx";
import {useAuth} from "./hooks/useAuth.jsx";


const ProtectedFilesPage = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Show a loading indicator while checking auth
    }

    return isAuthenticated ? <FilesPage /> :  <Navigate to="/" replace />;
};


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: "/register",
        element: <RegisterPage/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: "/documents",
        element: <ProtectedFilesPage/>,
        errorElement: <ErrorPage/>,
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} >
            <PrimeReactProvider value={{unstyled: false}}>
                <App/>
            </PrimeReactProvider>
        </RouterProvider>
    </React.StrictMode>
);
