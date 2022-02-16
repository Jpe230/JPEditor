import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as monaco from "monaco-editor";

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

export const getDirectory = (_dir, _cb) => {
  let results = [];

  let __dir = _dir ? _dir : __dirname;

  fs.readdir(__dir, function (err, list) {
    if (err) return _cb(err);

    let pending = list.length;

    if (!pending)
      return _cb(
        null,
        {
          name: path.basename(__dir),
          type: "folder",
          fullPath: path.resolve(__dir),
          children: results,
        },
        path.basename(__dir)
      );

    list.forEach(function (file) {
      file = path.resolve(__dir, file);
      fs.stat(file, function (err, stat) {
        if (stat && stat.isDirectory()) {
          getDirectory(file, function (err, res) {
            results.push({
              name: path.basename(file),
              type: "folder",

              fullPath: path.resolve(file),
              children: res,
            });
            if (!--pending) _cb(null, results, path.basename(__dir));
          });
        } else {
          results.push({
            type: "file",
            name: path.basename(file),
            fullPath: path.resolve(file),
          });
          if (!--pending) _cb(null, results, path.basename(__dir));
        }
      });
    });
  });
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
