'use babel';

import * as utils from '../lib/utils';
import temp from 'temp';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

temp.track();

describe('utils', () => {
  describe('parentDirs', () => {
    it('provides parent directories for a file path', () => {
      const dirs = [...utils.parentDirs('/foo/bar/baz/bing.jpg')];
      expect(dirs).toEqual(['/foo/bar/baz', '/foo/bar', '/foo', '/']);
    });

    it('root has itself as only parent', () => {
      const dirs = [...utils.parentDirs('/')];
      expect(dirs).toEqual(['/']);
    })
  });

  describe('getNearestPackageJson', () => {
    let tempDir;

    beforeEach(() => {
      tempDir = temp.mkdirSync('getNearestPackageJson');
      fs.writeFileSync(path.join(tempDir, 'package.json'), JSON.stringify({foo: 'root'}));
      mkdirp.sync(path.join(tempDir, 'foo/bar'));
      fs.writeFileSync(path.join(tempDir, 'foo/bar/package.json'), JSON.stringify({foo: 'subdir'}));
    });

    it('finds a package.json in the same directory', () => {
      const packageJson = utils.getNearestPackageJson(path.join(tempDir, 'foo/bar/app.js'));
      expect(packageJson).toEqual({foo: 'subdir'});
    })

    it('finds a package.json in a parent directory', () => {
      const packageJson = utils.getNearestPackageJson(path.join(tempDir, 'foo/bar'));
      expect(packageJson).toEqual({foo: 'root'});
    })
  });

  describe('getRequireCode', () => {
    beforeEach(() => atom.config.set('node-require.packageToImportNameMap', ''));
    beforeEach(() => atom.config.set('node-require.useConst', true));
    beforeEach(() => atom.config.set('node-require.addSemicolon', true));

    it('uses const', () => {
      expect(utils.getRequireCode('foo')).toEqual("const foo = require('foo');");
    });
  });
});
