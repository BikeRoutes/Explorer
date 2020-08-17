import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

import "./setup/addDeviceClassName";
import "./theme";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
