import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CustomRouter } from "./components/CustomRouter.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CustomRouter>
      <App />
    </CustomRouter>
  </React.StrictMode>
);
