export default class Notification {
  constructor(data = {}, key) {
    this.key = key;
    this.title = data.title;
    this.content = data.content;
    this.inquiryId = data.inquiryId;
    this.fromUid = data.fromUid;
    this.toUid = data.toUid;
    this.timestamp = data.timestamp;
  }
}
