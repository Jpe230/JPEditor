import React from "react";
import ReactDOM from "react-dom";

import App from "renderer/app/App";
import { EditorProvider } from "@app/renderer/Editor/Provider";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

ReactDOM.render(
  <React.StrictMode>
    <EditorProvider>
      <App />
    </EditorProvider>
  </React.StrictMode>,
  document.getElementById("app")
);
