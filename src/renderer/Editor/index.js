import React, { useEffect } from "react";
import { styled } from "pretty-lights";
import { useEditor } from "@app/renderer/Editor/Provider";
import { createEditor } from "@app/renderer/Editor/create";
import WelcomePage from "@app/renderer/Editor/WelcomePage";

const MonacoContainer = styled.div`
  position: relative;
  height: 100%;
`;

const Editor = ({ ...options }) => {
  const context = useEditor();
  const { setInstance, instance, currentModel } = context;
  Object.defineProperty(window, "editorContext", {
    value: context,
    writable: true,
  });
  Object.defineProperty(window, "editorInstance", {
    value: instance,
    writable: true,
  });

  window.editorContext = context;
  useEffect(() => {
    if (!instance) {
      setInstance(
        createEditor(document.getElementById("monaco-parent"), options, context)
      );
    } else {
      instance.teslaContext = context;
    }
  });

  return (
    <>
      {(currentModel?.filename === undefined) && <WelcomePage/>}
      <MonacoContainer id="monaco-parent" />
    </>
  );
};

export default Editor;
