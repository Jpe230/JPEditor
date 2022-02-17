import React, { useEffect, useState } from "react";
import { Box, styled } from "@mui/material";
import { useEditor } from "@app/renderer/Editor/Provider";
import { Container, Draggable } from "react-smooth-dnd";
import { tabUnstyledClasses } from "@mui/base/TabUnstyled";
import { arrayMoveImmutable } from "array-move";
import * as path from "path";

import { SickFileIcon } from "react-sick-file-icon";
import "react-sick-file-icon/src/icons.css";

import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import "./tabs.css";

const MTab = styled(Box)`
  color: white;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 300;
  width: 100%;
  padding: 8px 12px;
  border-left: 0.25px solid #252526;
  border-right: 0.25px solid #252526;
  display: flex;
  justify-content: center;
  background-color: #2d2d2d;

  &.${tabUnstyledClasses.selected} {
    background-color: #1e1e1e;
    border-radius: 1px 0;
    box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.43);
    -webkit-box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.43);
    -moz-box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.43);

    .close-icon.dirty svg, &:hover .close-icon svg, .close-icon svg{
      color: rgba(255,255,255, 1);!important
    }
  }
  
  .close-icon {
    display: flex;
    alignItems: center;
    flexWrap: wrap;
  }

  .close-icon svg{
    color: rgba(255,255,255, 0);
    font-size: 1.2rem;
    height: auto;
  }

  .close-icon.dirty svg{
    color: rgba(255,255,255, .5);
  }

  &:hover .close-icon svg{
    color: rgba(255,255,255, .8);
  }
`;

const MTabs = (props) => {
  const [value, setValue] = useState(0);
  const [transformedTabs, setTTabs] = useState([]);

  const { models, setModels, currentModel, requestNewTab, requestCloseTab } =
    useEditor();

  const handleChange = (event, newValue) => {
    requestNewTab(newValue);
  };

  useEffect(() => {
    let _tabs = [];
    Object.keys(models).map((key) => {
      _tabs.push({
        ...models[key],
        fileName: path.basename(key),
        fullPath: key,
      });
    });
    setTTabs(_tabs);
  }, [models]);

  const onDrop = ({ removedIndex, addedIndex }) => {
    setModels((tabs) => {
      let _tabs = {};
      arrayMoveImmutable(Object.keys(tabs), removedIndex, addedIndex).forEach(
        (tab) => {
          _tabs[tab] = { ...tabs[tab] };
        }
      );
      return _tabs;
    });
  };

  const handleClick = (e) => {
    requestNewTab(e);
  };

  const handleCloseButten = (e, tab) => {
    e.preventDefault();
    e.stopPropagation();
    requestCloseTab(tab.fullPath);
  };

  const handleMouseDown = (e, tab) => {
    if (e.button === 1) {
      e.preventDefault();
      e.stopPropagation();
      requestCloseTab(tab.fullPath);
    }
  };

  const checkIfActive = (p) =>
    p === currentModel?.filename ? tabUnstyledClasses.selected : "";

  const checkIfDirty = (p) =>
    p.filename === currentModel?.filename ? currentModel?.isDirty : p.isDirty;

  return (
    <Container onDrop={onDrop} orientation="horizontal" lockAxis="x">
      {transformedTabs &&
        transformedTabs.map((item, index) => (
          <Draggable key={item.fullPath}>
            <MTab
              onMouseDown={(e) => handleMouseDown(e, item)}
              onClick={() => handleClick(item.fullPath)}
              className={checkIfActive(item.fullPath)}
            >
              <Box sx={{ mr: "10px" }}>
                <SickFileIcon filename={item.fileName} isFolder={false} />
              </Box>
              <span>{item.fileName}</span>
              <Box
                sx={{ ml: "10px" }}
                className={`close-icon ${checkIfDirty(item) ? "dirty" : ""}`}
                onClick={(e) => handleCloseButten(e, item)}
              >
                {checkIfDirty(item) && <FiberManualRecordIcon />}
                {!checkIfDirty(item) && <CloseIcon />}
              </Box>
            </MTab>
          </Draggable>
        ))}
    </Container>
  );
};

export default MTabs;
