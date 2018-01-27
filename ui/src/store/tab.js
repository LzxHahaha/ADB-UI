import { observable, action } from 'mobx';

import router from '../router';

const keyCounter = {
  '/': 0
};

export default class DevicesStore {
  @observable tab = 'home';
  @observable tabs = [];

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  go(key) {
    this.tab = key;
  }

  @action
  push(tab) {
    if (keyCounter[tab.key]) {
      keyCounter[tab.key] += 1;
    } else {
      keyCounter[tab.key] = 1;
    }

    tab.component = router[tab.key];

    tab.key = `${tab.key}?__v=${keyCounter[tab.key]}`;

    this.tabs.push(tab);
    this.tab = tab.key;
  }

  @action
  remove(key) {
    const index = this.tabs.findIndex(el => el.key === key);
    if (index < 0) {
      return;
    }

    this.tabs.splice(index, 1);
    if (this.tab === key) {
      this.tab = this.tabs[index - 1].key;
    }
  }
}