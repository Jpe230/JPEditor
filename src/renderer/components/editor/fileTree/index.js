import React, { useEffect, useState } from "react";
import { TreeView } from "@mui/lab";
import { Box, styled, Typography, Button } from "@mui/material";
import { getDirectory } from "@app/renderer/fileSystem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MTreeViewItem from "@app/renderer/components/editor/fileTree/TreeViewItem";
import { useEditor } from "@app/renderer/Editor/Provider";

const chokidar = require("chokidar");

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  height: "100%",
  width: "100%",
  zIndex: 1,
  display: "block",
  padding: theme.spacing(2),
  "&>*": {
    marginBottom: `${theme.spacing(4)}!important`,
  },
}));

const FileTree = (props) => {
  const [directory, setDirectory] = useState({});
  const { workspace, newWorkspace } = useEditor();

  const makeDirectory = (path) => {
    const result = getDirectory(workspace);
    setDirectory(result);
  };

  useEffect(() => {
    if (workspace) {
      makeDirectory(workspace);
      //init chokidar
      chokidar
        .watch(workspace, {
          ignored: /(^|[\/\\])\../, // ignore dotfiles
          persistent: true,
        })
        .on("all", (event, path) => {
          makeDirectory(workspace);
        });
    }
  }, [workspace]);

  const renderTree = (nodes, isFirst = false) => (
    <MTreeViewItem
      key={nodes.path}
      nodeId={nodes.path}
      labelText={nodes.name == isFirst ? nodes.name.toUpperCase() : nodes.name}
      isFolder={nodes.type === "directory"}
      fullPath={nodes.path}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </MTreeViewItem>
  );

  return (
    <>
      {workspace === undefined && (
        <StyledBox>
          <Typography variant="subtitle2" gutterBottom>
            NO FOLDER OPENED
          </Typography>
          <Typography variant="body2" gutterBottom>
            You have not yet opened a folder
          </Typography>
          <Button variant="contained" fullWidth onClick={newWorkspace}>
            Open Folder
          </Button>
          <Typography variant="body2" gutterBottom>
            Opening a folder will close all currently open editors.
          </Typography>
        </StyledBox>
      )}
      {workspace && (
        <TreeView
          aria-label="Explorer"
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={["root"]}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{ height: "100vh", flexGrow: 1, overflowY: "auto" }}
        >
          {Object.keys(directory).length > 0 && renderTree(directory, true)}
        </TreeView>
      )}
    </>
  );
};

export { FileTree };
