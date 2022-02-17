import React, { useContext, createContext } from "react";
import { loadCodeForMonaco, writeFile } from "@app/renderer/fileSystem";
import { isDirtyDialog, SaveAsDialog } from "@app/renderer/Editor/dialogs";
import useState from "react-usestateref";

export const defaultModel = {
  filename: undefined,
  modelValue: undefined,
  modelView: undefined,
  isDirty: false,
  versionId: undefined,
  isUntitled: false,
};

export const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const editor = useEditorProvider();
  return (
    <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);

export const useEditorProvider = () => {
  const [instance, setInstance, instanceRef] = useState(null);
  const [openedFile, setOpenedFile, openedFileRef] = useState("");
  const [currentModel, setCurrentModel, currentModelRef] =
    useState(defaultModel);
  const [models, setModels, modelsRef] = useState({});

  /*
   * Set Current model
   */
  const saveCurrentToModel = (
    filename = openedFile.current,
    saveVersionId = false
  ) => {
    // This implies that the model was set
    const modelView = instanceRef.current.saveViewState();
    const modelValue = instanceRef.current.getModel();
    const isDirty = currentModelRef.current.isDirty;

    // Get previous models state
    let oldModelState = { ...modelsRef.current };

    oldModelState[filename] = {
      ...oldModelState[filename],
      filename,
      modelValue,
      modelView,
      isDirty,
    };

    // Set Version ID
    if (saveVersionId) {
      oldModelState[filename] = {
        ...oldModelState[filename],
        versionId: modelValue.getAlternativeVersionId(),
      };
    }

    // Re-add it to state
    setModels(oldModelState);
  };

  /*
   *  Activate Model
   */
  const activateModel = (desiredModel) => {
    // Our desired model is now the current model
    setCurrentModel(desiredModel);
    setOpenedFile(desiredModel.filename);

    // Load model and view into Monaco
    instanceRef.current.setModel(desiredModel.modelValue);

    if (desiredModel.modelView)
      //Restore view if it exist
      instanceRef.current.restoreViewState(desiredModel.modelView);
  };

  /*
   *  Request new tab, file should exist
   */
  const requestNewTab = (filename) => {
    // If current model is the same just focus it;
    if (filename === openedFileRef.current) {
      instanceRef.current.focus();
      return;
    }

    // Check if we have a valid model and save it contents
    if (currentModelRef.current.modelValue) {
      saveCurrentToModel(currentModelRef.current.filename, false); // Dont save version Id
    }

    // If requested tab exist in our models
    if (modelsRef.current.hasOwnProperty(filename)) {
      const desiredModel = modelsRef.current[filename];
      activateModel(desiredModel);
    } else if (filename) {
      // if we have a filename
      const desiredModel = getModelFromFile(filename);
      activateModel(desiredModel);

      let oldModelState = { ...modelsRef.current };
      oldModelState[filename] = desiredModel;

      // Add it to state
      setModels(oldModelState);
    } else {
      // Prob. we want an empty model
    }
  };

  /*
   *  Get model from file or create if it doesnt exist
   */
  const getModelFromFile = (filename) => {
    const newModel = filename
      ? loadCodeForMonaco(filename)
      : monaco.editor.createModel("");

    // Add Listener to it to detect dirtiness
    newModel.onDidChangeContent(() => {
      // It assumes that the current models is itself
      const isDirty =
        currentModelRef.current.versionId !==
        newModel.getAlternativeVersionId();

      if (isDirty == currentModelRef.current.isDirty) return; // Setting is expesive and it causes lag
      setCurrentModel({ ...currentModelRef.current, isDirty });
      saveCurrentToModel(filename, false);
    });

    const newFileName = filename ? filename : getUntitledIndex();

    return {
      filename: newFileName,
      modelValue: newModel,
      modelView: undefined, // We dont have a view yet
      isDirty: false,
      isUntitled: filename ? false : true,
      versionId: newModel.getAlternativeVersionId(),
    };
  };

  /*
   *  Get untitled index
   */
  const getUntitledIndex = () =>
    `untitled-${
      Math.max(
        ...Object.keys(modelsRef.current)
          .find((k) => k.startsWith("untitled"))
          .map((k) => parseInt(k.replace("untitled-")))
      ) + 1
    }`;

  /*
   * Delete Model
   */
  const deleteModel = (hashToDelete) => {
    let oldModelState = { ...modelsRef.current };

    // Safely dispose model
    oldModelState[hashToDelete]?.modelValue?.dispose();
    delete oldModelState[hashToDelete];

    // Add it to state
    setModels(oldModelState);
  };

  /*
   *  Request Close Tab
   */
  const requestCloseTab = (filename) => {
    const keys = Object.keys(modelsRef.current);
    const loc = keys.indexOf(filename);

    if (loc < 0) return; // No tab with given name

    if (modelsRef.current[filename]?.isDirty) {
      let response = isDirtyDialog(filename);
      console.log(response);
      if (response == 0) {
        saveFile(filename);
      } else if (response == 2) {
        console.log("cancel");
        return;
      }
    }

    if (keys.length <= 1) {
      // Only one tab
    } else {
      if (filename === currentModelRef.current.filename) {
        const newIndex = loc == 0 ? loc + 1 : loc - 1;
        const modelToFocus = modelsRef.current[keys[newIndex]];

        deleteModel(filename);

        // Activate previous model
        activateModel(modelToFocus);
        instanceRef.current.focus();
      } else {
        deleteModel(filename);
      }
    }
  };

  /*
   *  Handle Open file
   */
  const openFile = (filename) => {
    console.log(filename);
  };

  /*
   *  Handle Save as
   */
  const saveAsFile = (filename = openedFileRef.current) => {
    const pathToSave = SaveAsDialog(__dirname); //<- Change __dirname to a more global scope
    if (pathToSave) {
      saveFile(pathToSave, true);
    }
  };

  /*
   *  Handle silent save
   */
  const saveFile = (filename = openedFileRef.current, skipCheck = false) => {
    if (modelsRef.current[filename]?.isUntitled && skipCheck == false) {
      saveAsFile(filename);
    } else {
      const modelTosave =
        currentModelRef.filename === filename
          ? instanceRef.current.getModel()
          : modelsRef.current[filename].modelValue;

      if (modelTosave) {
        writeFile(filename, modelTosave.getValue());
        if (currentModelRef.current.filename === filename) {
          //if we are saving the current model
          setCurrentModel({ ...currentModelRef.current, isDirty: false });
          saveCurrentToModel(filename, true);
        } else {
          let oldValue = { ...modelsRef.current };
          oldValue[filename] = {
            ...oldValue[filename],
            isDirty: false,
          };
          setModels(oldValue);
        }
      } else {
        console.error("Could not save model");
      }
    }
  };

  return {
    instance,
    setInstance,

    currentModel,
    models,
    setModels,

    openedFile,
    setOpenedFile,

    requestNewTab,
    requestCloseTab,

    openFile,
    saveFile,
  };
};
