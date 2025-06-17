// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
// src/index.js
import "./Animations.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import reportWebVitals from "./reportWebVitals";
import { App } from "./Components/App";
import "./Index.css";
import { CreatedBy } from "./Components/Footer";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <CreatedBy />
  </React.StrictMode>
);

reportWebVitals();
