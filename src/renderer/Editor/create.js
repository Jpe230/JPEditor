import * as monaco from "monaco-editor";
import { loadWASM } from "onigasm";
import { convertTheme } from "monaco-vscode-textmate-theme-converter/lib/cjs";
import { Registry } from "monaco-textmate"; // peer dependency
import { wireTmGrammars } from "monaco-editor-textmate";

const darkPlusTheme = require("./themes/dark_plus.json");
const cssGrammar = require("./css.tmLanguage.json");
const jsGrammar = require("./JavaScript.tmLanguage.json");

export const defaultOptions = {
  theme: "vs-dark",
  height: "100%",
  fontSize: "18px",
  scrollBeyondLastLine: false,
  width: "100%",
};

export const liftOff = async (editor) => {
  await loadWASM(require("onigasm/lib/onigasm.wasm").default);

  const registry = new Registry({
    getGrammarDefinition: async (scopeName) => {
      return {
        format: "json",
        content: jsGrammar,
      };
    },
  });

  const grammars = new Map();
  grammars.set("css", "source.css");
  grammars.set("html", "text.html.basic");
  grammars.set("typescript", "source.ts");
  grammars.set("javascript", "source.js");

  const testtheme = {
    ...convertTheme(darkPlusTheme),
    inherit: true,
  };

  console.log(testtheme);
  monaco.editor.defineTheme("vs-dark-p", testtheme);
  monaco.languages.register({id: 'javascript'});

  await wireTmGrammars(monaco, registry, grammars, editor);
};

export const createEditor = (parentElement, options, context) => {
  const editor = monaco.editor.create(parentElement, {
    ...defaultOptions,
    ...options,
    language: "javascript",
    automaticLayout: true,
  });

  //Key binding
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    context.saveFile();
  });

  const supportedActions = editor.getSupportedActions().map((a) => a.id);
  console.log({ supportedActions });

  monaco.editor.setTheme("vs-dark");
  liftOff(editor).then(() => monaco.editor.setTheme("vs-dark-p"));

  return editor;
};
