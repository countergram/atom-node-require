'use babel';

import path from 'path';
import fs from 'fs';

export function collectDependencyNames (packageJson) {
  return [].concat(
    Object.keys(packageJson.dependencies || {}),
    Object.keys(packageJson.devDependencies || {})
  );
}

export function getNearestPackageJson (filePath) {
  for (let dirPath of parentDirs(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(path.join(dirPath, 'package.json')));
    } catch (err) {}
  }
  return null;
}

export function getNearestPackageJsonForEditor () {
  let editor = atom.workspace.getActiveTextEditor();
  if (editor) {
    let filePath = editor.getPath();
    if (filePath) {
      return getNearestPackageJson(filePath);
    }
  }
}

export function * parentDirs (startPath) {
  let point = startPath;
  do {
    point = path.dirname(point);
    yield point;
  } while (point !== '/');
}

export function getRequireCode (packageName) {
  const importName = getImportName(packageName);
  const declaration = atom.config.get('node-require.useConst') ? 'const' : 'var';
  const terminator = atom.config.get('node-require.addSemicolon') ? ';' : '';
  return `${declaration} ${importName} = require('${packageName}')${terminator}`;
}

function getNameMap () {
  const rawNameMap = atom.config.get('node-require.packageToImportNameMap') || [];
  return configArrayToObject(rawNameMap);
}

function configArrayToObject (configArray) {
  const nameMap = {};
  configArray.forEach((item) => {
    const [packageName, importName] = item.split(':');
    if (packageName && importName) {
      nameMap[packageName] = importName;
    }
  });
  return nameMap;
}

export function getImportName (packageName) {
  const nameMap = getNameMap();
  return nameMap[packageName] || toCamelCase(packageName);
}

function toCamelCase (name) {
  let parts = name.split(/[^A-Za-z0-9]/);
  parts = [parts[0], ...parts.splice(1).map(part => upperCaseFirst(part))];
  return parts.join('');
}

function upperCaseFirst (str) {
  return str.charAt(0).toUpperCase() + str.substr(1);
}
