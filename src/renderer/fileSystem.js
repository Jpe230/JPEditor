import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as monaco from "monaco-editor";

const dirTree = require("directory-tree");

export const resolveHome = (filepath) => {
  if (filepath[0] === "~") {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return path.resolve(filepath);
};

export const writeFile = (filename, content) => {
  fs.writeFileSync(resolveHome(filename), content);
};

export const readFile = (filename) => {
  return fs.readFileSync(resolveHome(filename), "utf-8");
};

export const getDirectory = (_dir) => {
  let __dir = _dir ? path.resolve(_dir) : __dirname;
  return dirTree(__dir, {exclude: /^\./, attributes:['type']});
};

export const loadCodeForMonaco = (filename, language) => {
  const content = readFile(filename);
  const model = monaco.editor.createModel(
    content,
    language, // detect language when `undefined`
    monaco.Uri.file(filename) // uri
  );
  return model;
};

export const collapseHome = (t) => t.replace(os.homedir(), "~");
