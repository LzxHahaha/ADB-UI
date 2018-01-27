import DevicesStore from './devices';

export default class RootStore {
    constructor() {
        this.devicesStore = new DevicesStore(this);
    }
}
