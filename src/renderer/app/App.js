import React from "react";
import { ThemeProvider } from "@mui/material";

import darkTheme from "@app/renderer/theme/theme";
import Layout from "@app/renderer/components/ui/Layout";

import "./App.css";
import Title  from "../titlebar";

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Title />
      <Layout></Layout>
    </ThemeProvider>
  );
};

export default App;
