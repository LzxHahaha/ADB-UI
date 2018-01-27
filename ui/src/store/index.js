import DevicesStore from './devices';
import TabStore from './tab';

export default class RootStore {
  constructor() {
    this.devices = new DevicesStore(this);
    this.tab = new TabStore(this);
  }
}
