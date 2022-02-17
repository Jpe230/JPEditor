import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { alpha, styled, Collapse, Box, Typography } from "@mui/material";
import { TreeItem, treeItemClasses } from "@mui/lab";
import { useSpring, animated } from "@react-spring/web";
import { SickFileIcon } from "react-sick-file-icon";
import { useEditor } from "@app/renderer/Editor/Provider";

import "react-sick-file-icon/src/icons.css";

const TransitionComponent = (props) => {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: "translate3d(20px,0,0)",
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
};

TransitionComponent.propTypes = {
  in: PropTypes.bool,
};

const StyledTreeItemRoot = styled((props) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const MTreeViewItem = (props) => {
  const { bgColor, color, labelText, isFolder, fullPath, ...other } = props;
  const { requestNewTab } = useEditor();

  const onClickCallBack = (event) => {
    if (!isFolder) {
      requestNewTab(fullPath);
    }
  };

  return (
    <StyledTreeItemRoot
      onClick={onClickCallBack}
      label={
        <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box color="inherit" sx={{ mr: 1 }}>
            <SickFileIcon filename={labelText} isFolder={isFolder} />
          </Box>

          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelText}
          </Typography>
        </Box>
      }
      {...other}
    />
  );
};

export default MTreeViewItem;
