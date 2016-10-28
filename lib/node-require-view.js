'use babel';

import { SelectListView, $$ } from 'atom-space-pen-views';
import { getRequireCode } from './utils';

export default class NodeRequireView extends SelectListView {
  constructor () {
    super();
  }

  show (items) {
    if (!this.panel) {
      this.setItems(items);
      this.panel = atom.workspace.addModalPanel({item: this});
      this.panel.show();
      this.storeFocusedElement();
      this.focusFilterEditor();
    }
  }

  hide () {
    this.panel.destroy();
    delete this.panel;
  }

  isVisible () {
    return !!this.panel;
  }

  confirmed (packageName) {
    const code = getRequireCode(packageName);
    atom.workspace.getActiveTextEditor().insertText(code);
    this.cancel();
  }

  cancelled () {
    this.hide();
  }

  viewForItem (item) {
    return $$(function itemView () {
      this.li(item);
    });
  }
};
