import React, { useEffect, useState } from "react";
import { TreeView } from "@mui/lab";
import { getDirectory } from "@app/renderer/fileSystem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MTreeViewItem from "@app/renderer/components/editor/fileTree/TreeViewItem";

const FileTree = (props) => {
  const [directory, setDirectory] = useState({});

  useEffect(() => {
    getDirectory(null, (_, res, _dir) =>
      setDirectory({ name: _dir.toUpperCase(), children: res, type: "folder" })
    );
  }, []);

  const renderTree = (nodes) => (
    <MTreeViewItem
      key={nodes.name}
      nodeId={nodes.name}
      labelText={nodes.name}
      isFolder={nodes.type === "folder"}
      fullPath={nodes.fullPath}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </MTreeViewItem>
  );

  return (
    <TreeView
      aria-label="Explorer"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={["root"]}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: "100vh", flexGrow: 1, overflowY: "auto" }}
    >
      {directory?.children && renderTree(directory)}
    </TreeView>
  );
};

export { FileTree };
