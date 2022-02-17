import * as path from "path";
const dialog = require("electron").remote.dialog;
/*
 *  Dialog when file is dirty (aka close confirmation)
 */
export const isDirtyDialog = (filename) =>
  dialog.showMessageBoxSync({
    title: "Jpeditor",
    type: "warning",
    buttons: ["Save", "Don't Save", "Cancel"],
    message: `Do you to save the changes you made to ${path.basename(
      filename
    )}`,
    detail: "Your changes will be lost if you don't save them",
    noLink: true,
  });

/*
 *  Save as Dialog
 */
export const SaveAsDialog = (defaultPath) =>
  dialog.showSaveDialogSync({
    title: "Jpeditor",
    defaultPath,
    noLink: true,
  });
