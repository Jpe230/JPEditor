import React, {useState} from "react";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

import {Button} from "@mui/material";

import TopBar from "@app/renderer/TopBar";
import Editor from "@app/renderer/Editor";
import { useEditor } from "@app/renderer/Editor/Provider";
import { orange } from '@mui/material/colors';

const theme = createTheme({
  status: {
    danger: orange[500],
  },
});

export default function MainScreen() {

  const [a, b] = useState('100');
  return (
    <ThemeProvider theme={theme}>
    <div>
      {/* {instance ? <TopBar /> : <Splash />} */}
      <TopBar />
      <Button>Test</Button>
      HELLO {a}
      <Editor />
    </div>
    </ThemeProvider>
  );
}
