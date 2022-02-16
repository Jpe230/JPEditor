"use strict";

const {
  app,
  Tray,
  Menu,
  dialog,
  MenuItem,
  nativeImage,
  BrowserWindow,
  ipcMain,
} = require("electron");

import * as path from "path";
import * as fs from "fs";

import { format as formatUrl } from "url";

const isDevelopment = process.env.NODE_ENV !== "production";
const trayIcon = nativeImage.createFromPath(
  path.resolve(__dirname, "../../public/tray.png")
);

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;
app.allowRendererProcessReuse = true;

const addZoom = (win) => {
  // Upper Limit is working of 500 %
  win.webContents
    .setVisualZoomLevelLimits(1, 5)
    .then(console.log("Zoom Levels Have been Set between 100% and 500%"))
    .catch((err) => console.log(err));

  win.webContents.on("zoom-changed", (event, zoomDirection) => {
    var currentZoom = win.webContents.getZoomFactor();

    if (zoomDirection === "in") {
      win.webContents.zoomFactor = currentZoom + 0.2;
    }
    if (zoomDirection === "out") {
      if (currentZoom - 0.2 < 0.2) {
        win.webContents.zoomFactor = 0.2;
      } else {
        win.webContents.zoomFactor = currentZoom - 0.2;
      }
    }
  });
};

const createMainWindow = () => {
  const window = new BrowserWindow({
    icon: path.resolve(__dirname, "../../public/app.ico"),
    width: 1280,
    height: 961,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
  });

  //if (isDevelopment) {
  window.webContents.openDevTools({ mode: "detach" });
  //}

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  addZoom(window);

  window.on("ready-to-show", () => {
    if (!window) {
      throw new Error('"mainWindow" is not defined');
    }
    window.maximize();
    window.show();
  });

  return window;
};

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  const tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show Window",
      type: "normal",
      click() {
        if (!mainWindow) {
          mainWindow = createMainWindow();
        }
      },
    },
    {
      label: "Quit",
      type: "normal",
      click() {
        process.exit(0);
      },
    },
  ]);

  tray.setToolTip("Jpeditor");
  tray.setContextMenu(contextMenu);

  mainWindow = createMainWindow();
});

app.on("will-quit", (event) => {
  if (
    dialog.showMessageBoxSync(mainWindow, {
      type: "question",
      title: "Jpeditor",
      message: "Are you sure you want to quit?",
      buttons: ["Yes", "No"],
    }) === 1
  ) {
    event.preventDefault();
    mainWindow = createMainWindow();
  }
});

const loadFileIntoRenderer = (filename) => {
  mainWindow.webContents.send("open-file", filename);
};

ipcMain.on("quit", () => {
  process.exit(0);
});

//Menu.setApplicationMenu(menu);
