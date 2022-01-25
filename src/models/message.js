import {FIREBASE_IMAGE} from '../config/constant';

export default class Message {
  constructor(data = {}) {
    this._id = data._id;
    this.text = data.text;
    this.createdAt = new Date(data.createdAt.seconds * 1000);
    this.user = new UserM(data.user);
  }
}

class UserM {
  constructor(data = {}) {
    this._id = data._id;
    this.name = data.name;
    this.avatar = data.avatar;
  }

  getUrl() {
    return FIREBASE_IMAGE(`users%2F${this._id}`, this.avatar);
  }
}
