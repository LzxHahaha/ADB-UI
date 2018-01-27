import { observable, action } from 'mobx';
import { ipcRenderer } from 'electron';

export default class DevicesStore {
  @observable list = [];
  @observable current = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  getDevices() {
    const list = ipcRenderer.sendSync('get-devices');
    this.list = list;
    if (list.length === 0) {
      this.current = null;
    } else if (!this.current) {
      this.current = list[0].serialNumber;
    }
  }

  @action
  setCurrentDevice(index) {
    this.current = this.list[index].serialNumber;
  }
}