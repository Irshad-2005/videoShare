import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
]);
createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
