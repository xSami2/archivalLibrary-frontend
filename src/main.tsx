import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import {PrimeReactProvider} from "primereact/api";
import App from "./App";
// tailwind css
import "./index.css";
// prim react css
import "primeicons/primeicons.css";

// recast router
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

// Routes
import Root from "../src/routes/route";
// @ts-ignore
import ErrorPage from "../src/routes/error-page";
// @ts-ignore
import RegisterPage from "../src/routes/register";


const router = createBrowserRouter([
    {
        path: "/login",
        element: <App/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: "/register",
        element: <RegisterPage/>,
        errorElement: <ErrorPage/>,

    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} >
            <PrimeReactProvider value={{unstyled: false}}>
                <App/>
            </PrimeReactProvider>
        </RouterProvider>
    </React.StrictMode>
);
