import React, { useContext, createContext } from "react";
import { ipcRenderer } from "electron";
import { loadCodeForMonaco, writeFile } from "@app/renderer/fileSystem";
import useState from "react-usestateref";
const dialog = require("electron").remote.dialog;

export const EditorContext = createContext();

export const defaultCode = {
  filename: undefined,
  content: undefined,
  language: undefined,
};

export const EditorProvider = ({ children }) => {
  const editor = useEditorProvider();
  return (
    <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);

export const useEditorProvider = () => {
  const [language, setLanguage] = useState(undefined);
  const [dirty, setDirty, dirtyRef] = useState(false);
  const [filename, setFilename] = useState("");
  const [code, setCode] = useState(defaultCode);
  const [instance, setInstance] = useState(null);
  const [tabs, setTabs, tabRef] = useState({});

  const saveViewModel = (
    filename = code?.filename,
    editor = instance,
    saveAlternateVersion = false
  ) => {
    const view = (editor || instance).saveViewState();
    const model = (editor || instance).getModel();
    const isDirty = dirtyRef.current;

    let prevTabs = { ...tabRef.current };
    prevTabs[filename] = {
      ...prevTabs[filename],
      view,
      model,
      isDirty,
    };

    if (saveAlternateVersion) {
      prevTabs[filename] = {
        ...prevTabs[filename],
        versionId: model.getAlternativeVersionId(),
      };
    }

    setTabs(prevTabs);
  };

  const openTab = (filename, requestedTab, editor = instance) => {
    editor.setModel(requestedTab.model);
    editor.restoreViewState(requestedTab.view);
    setDirty(requestedTab.isDirty);
    const detectedLanguage = requestedTab.model.getLanguageId();
    setFilename(filename);
    setCode({
      filename: filename,
      content: requestedTab.model.getValue(),
      language: detectedLanguage,
    });
    setLanguage(detectedLanguage);
  };

  const requestNewTab = (filename = code?.filename, editor = instance) => {
    if (filename === code?.filename) {
      (editor || instance)?.focus();
      return;
    }

    if (code?.filename) {
      saveViewModel(code?.filename, editor);
    }

    if (filename && tabs.hasOwnProperty(filename)) {
      const tabToOpen = tabs[filename];
      openTab(filename, tabToOpen, editor);
      (editor || instance)?.focus();
    } else {
      openFile(filename, editor);
    }
  };

  const openFile = (filename = code?.filename, editor = instance) => {
    console.log(`opening file: ${filename}`);

    const model = loadCodeForMonaco(filename);
    const detectedLanguage = model.getLanguageId();

    editor.setModel(model);
    setFilename(filename);
    setCode({
      filename: filename,
      content: model.getValue(),
      language: detectedLanguage,
    });

    setDirty(false);
    setLanguage(detectedLanguage);

    model.onDidChangeContent(() => {
      const isDirty =
        tabRef.current[filename].versionId !== model.getAlternativeVersionId();
      setDirty(isDirty);
    });

    console.log("openFile", { filename, detectedLanguage });
    (editor || instance)?.focus();
    saveViewModel(filename, editor, true);
    return model;
  };

  if (instance) {
    ipcRenderer.on("open-file", (_, filename) => {
      openFile(filename);
    });
    ipcRenderer.on("save-file", (_, filename) => {
      saveFile(filename);
    });
  }

  const saveFile = (filename = code?.filename, editor = instance) => {
    console.log(`saving file: ${filename}`);
    writeFile(filename, editor.getModel().getValue());
    setDirty(false);
  };

  const updateOptions = (opts) => {
    const options = opts || {};
    instance.updateOptions(options);

    console.log("updateOptions", options);
    if ("language" in options) {
      setLanguage(options.language);
    }
    instance.layout();
  };

  const isDirtyDialog = (filename = code?.filename) =>
    dialog.showMessageBoxSync({
      title: "Jpeditor",
      type: "warning",
      buttons: ["Save", "Don't Save", "Cancel"],
      message: `Do you to save the changes you made to ${filename}`,
      detail: "Your changes will be lost if you don't save them",
      noLink: true,
    });

  const requestCloseTab = (filename = code?.filename) => {
    const keys = Object.keys(tabRef.current);
    const loc = keys.indexOf(filename);

    if (loc < 0) return; // No tab with given name

    if (tabRef.current[filename]?.isDirty) {
      let response = isDirtyDialog(filename);

      if (response == 1) {
        //Do something
      }
    }

    //Handle if closing the single tab
    if (keys.length <= 1) {
    } else {
      //Check if we are closing the currenttab
      if (filename === code?.filename) {
        let prevTab = tabRef.current[keys[loc - 1]];
        let oldState = { ...tabRef.current };
        // delete currentTab
        oldState[filename].model.dispose();
        delete oldState[filename];
        openTab(keys[loc - 1], prevTab);
        //Set previous tab
        setTabs(oldState);
        //console.log(tabRef);
        instance?.focus();
      } else {
        let oldState = { ...tabRef.current };
        // delete currentTab
        oldState[filename].model.dispose();
        delete oldState[filename];
        setTabs(oldState);
      }
    }
  };

  return {
    requestNewTab,

    code,
    setCode,

    dirty,
    setDirty,

    language,
    setLanguage,

    instance,
    setInstance,

    tabs,
    setTabs,

    filename,
    setFilename,

    requestCloseTab,

    openFile,
    saveFile,
    updateOptions,
  };
};
