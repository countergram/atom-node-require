'use babel';

import NodeRequireView from './node-require-view';
import { CompositeDisposable } from 'atom';
import { getNearestPackageJsonForEditor, collectDependencyNames } from './utils';

export default {
  config: {
    useConst: {
      type: 'boolean',
      default: true,
      order: 0
    },
    addSemicolon: {
      type: 'boolean',
      default: true,
      order: 1
    },
    packageToImportNameMap: {
      type: 'array',
      default: ['bluebird:Promise', 'aws-sdk:AWS'],
      order: 2,
      items: {
        type: 'string'
      }
    }
  },

  nodeRequireView: null,
  subscriptions: null,

  activate() {
    this.nodeRequireView = new NodeRequireView();
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'node-require:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    if (this.nodeRequireView.isVisible()) {
      this.nodeRequireView.hide();
    } else {
      let packageJson = getNearestPackageJsonForEditor();
      if (packageJson) {
        this.nodeRequireView.show(collectDependencyNames(packageJson));
      }
    }
  }
};
