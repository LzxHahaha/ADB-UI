import { observable, action } from 'mobx';

import router from '../router';

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
    if (this.tabs.find(el => el.key === tab.key)) {
      this.tab = tab.key;
      return;
    }

    tab.component = router[tab.key];
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
      this.tab = (this.tabs[index - 1] || { key: 'home' }).key;
    }
  }
}