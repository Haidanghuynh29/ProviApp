export default class Chat {
  constructor(data = {}, key) {
    this.key = key;
    this.employer_key = data.employer_key;
    this.worker_key = data.worker_key;
    this.status = data.status;
    this.e_cnt = data.e_cnt ?? 0; // employer received msg count
    this.w_cnt = data.w_cnt ?? 0; // worker received msg count
    // 0: employer -> worker
    // 1: worker -> employer
    // 2: messaging
    // 3: canceled by worker
    // 4: rejected by employer
    // 5: success
    this.timestamp = data.timestamp;
  }
}
