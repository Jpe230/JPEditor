import React, { useState, useEffect } from "react";
import { remote } from "electron";
import { useMenu } from "./menu";
import TitleBar from "frameless-titlebar";

const currentWindow = remote.getCurrentWindow();

const Example = () => {
  // manage window state, default to currentWindow maximized state
  const [maximized, setMaximized] = useState(currentWindow.isMaximized());
  // add window listeners for currentWindow
  useEffect(() => {
    const onMaximized = () => setMaximized(true);
    const onRestore = () => setMaximized(false);
    currentWindow.on("maximize", onMaximized);
    currentWindow.on("unmaximize", onRestore);
    return () => {
      currentWindow.removeListener("maximize", onMaximized);
      currentWindow.removeListener("unmaximize", onRestore);
    };
  }, []);

  // used by double click on the titlebar
  // and by the maximize control button
  const handleMaximize = () => {
    if (maximized) {
      currentWindow.restore();
    } else {
      currentWindow.maximize();
    }
  };

  const defaultMenu = [
    {
      label: "File",
      submenu: [
        {
          label: "New",
          accelerator: "Ctrl+N",
        },
        {
          type: "separator",
        },
        {
          label: "Open file...",
          accelerator: "Ctrl+O",
        },
        {
          label: "Open folder...",
          accelerator: "Ctrl+Shift+O",
        },
        {
          type: "separator",
        },
        {
          label: "Save",
          accelerator: "Ctrl+S",
        },
        {
          label: "Save As...",
          accelerator: "Ctrl+Shift+S",
        },
        {
          type: "separator",
        },
        {
          label: "Exit",
          accelerator: "Alt+F4",
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "Ctrl+Z",
        },
        {
          label: "Redo",
          accelerator: "Ctrl+Y",
        },
        {
          type: "separator",
        },
        {
          label: "Cut",
          accelerator: "Ctrl+X",
        },
        {
          label: "Copy",
          accelerator: "Ctrl+C",
        },
        {
          label: "Paste",
          accelerator: "Ctrl+V",
        },
        {
          type: "separator",
        },
        {
          label: "Find",
          accelerator: "Ctrl+F",
        },
        {
          label: "Replace",
          accelerator: "Ctrl+H",
        },
      ],
    },
    {
      label: "Selection",
      submenu: [
        {
          label: "Select All",
          accelerator: "Ctrl+A",
        },
        {
          label: "Expand Selection",
          accelerator: "Shift+Alt+RightArrow",
        },
        {
          label: "Shrink Selection",
          accelerator: "Shift+Alt+LeftArrow",
        },
        {
          type: "separator",
        },
        {
          label: "Copy Line Up",
          accelerator: "Shift+Alt+UpArrow",
        },
        {
          label: "Copy Line Down",
          accelerator: "Shift+Alt+DownArrow",
        },
        {
          label: "Move Line Up",
          accelerator: "Alt+UpArrow",
        },
        {
          label: "Move Line Down",
          accelerator: "Alt+DownArrow",
        },
        {
          type: "separator",
        },
        {
          label: "Add Cursor Above",
          accelerator: "Ctrk+Alt+UpArrow",
        },
        {
          label: "Add Cursor Below",
          accelerator: "Ctrk+Alt+DownArrow",
        },
        {
          label: "Add Cursor to Line Ends",
          accelerator: "Shift+Alt+I",
        },
        {
          label: "Add Next Ocurrence",
          accelerator: "Ctrl+D",
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Built with",
        },
        {
          label: "Electron",
        },
        {
          label: "React",
        },
        {
          label: "Jpe230 (C)",
        },
      ],
    },
  ];
  return (
    <div>
      <TitleBar
        currentWindow={currentWindow} // electron window instance
        platform={process.platform} // win32, darwin, linux
        menu={defaultMenu}
        title="frameless app"
        onClose={() => currentWindow.close()}
        onMinimize={() => currentWindow.minimize()}
        onMaximize={handleMaximize}
        // when the titlebar is double clicked
        onDoubleClick={handleMaximize}
        // hide minimize windows control
        disableMinimize={false}
        // hide maximize windows control
        disableMaximize={false}
        // is the current window maximized?
        maximized={maximized}
      >
        {/* custom titlebar items */}
      </TitleBar>
    </div>
  );
};
export default Example;
