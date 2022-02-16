import React from "react";
import { Box, CssBaseline } from "@mui/material";
import Drawer from "@app/renderer/components/ui/Drawer";
import ReactSplit, { SplitDirection } from "@devbookhq/splitter";
import ToolPane from "@app/renderer/components/editor/ToolPane";
import MTabs from "@app/renderer/components/editor/Tabs";
import Editor from "@app/renderer/Editor";
import "./Layout.css";

const Tile = ({ children }) => {
  return <div className="tile">{children}</div>;
};

const Layout = ({ children, ...props }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <ReactSplit
          direction={SplitDirection.Horizontal}
          initialSizes={[15, 85]} // In percentage.
          minWidths={[0, 200]} // In pc
          gutterClassName="custom-gutter-horizontal"
          draggerClassName="custom-dragger-horizontal"
        >
          <Tile>
            <ToolPane />
          </Tile>
          <Tile>
            <MTabs />
            <Editor />
          </Tile>
        </ReactSplit>
      </Box>
    </Box>
  );
};

export default Layout;
