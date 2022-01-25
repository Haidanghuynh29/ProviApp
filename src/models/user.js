import {FIREBASE_IMAGE} from '../config/constant';

export default class User {
  constructor(data = {}, key) {
    this.key = key;
    this.kind = data.kind ?? 0; // 0: employer, 1:worker
    this.nickname = data.nickname;
    this.email = data.email;
    this.introduction = data.introduction;

    if (this.kind) {
      // worker
      this.img_face = data.img_face;
      this.img_best = data.img_best;
      this.img_full = data.img_full;
      this.video = data.video;
      this.birthday = data.birthday;
      this.unit = data.unit ?? 1;
      this.hope_pay = data.hope_pay ? parseInt(data.hope_pay) : null;
      this.hope_days = data.hope_days ? parseInt(data.hope_days) : null;
      this.hope_prefecture = data.hope_prefecture;
      this.hope_address = data.hope_address;
      this.exp_years = data.exp_years;
      this.exp_area = data.exp_area;
      this.prospect_sales = data.prospect_sales
        ? parseInt(data.prospect_sales)
        : null;
      this.prospect_count = data.prospect_count
        ? parseInt(data.prospect_count)
        : null;
      this.prefecture = data.prefecture;
      this.address = data.address;
      this.b_size = data.b_size ? parseInt(data.b_size) : null;
      this.w_size = data.w_size ? parseInt(data.w_size) : null;
      this.h_size = data.h_size ? parseInt(data.h_size) : null;
      this.height = data.height ? parseInt(data.height) : null;
      this.job = data.job;
    } else {
      // employer
      this.image = data.image;
      this.shop_name = data.shop_name;
      this.shop_telephone = data.shop_telephone;
      this.shop_url = data.shop_url;
      this.exp_years = data.exp_years;
      this.shop_address = data.shop_address;
      this.shop_prefecture = data.shop_prefecture;
      this.min_pay = data.min_pay ? parseInt(data.min_pay) : null;
      this.unit = data.unit ?? 1;
      this.point = data.point ?? 0;

      this.approve = data.approve;
      this.imgCertificate = data.imgCertificate;
    }

    this.ck_notify_ids = data.ck_notify_ids ?? [];
    this.token = data.token;
    this.blocked = data.blocked ?? false;
    this.visible = data.visible ?? true;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.lastCheck = data.lastCheck ?? 0;
  }

  is_worker() {
    return this.kind === 1;
  }
  getUrl(url = null) {
    const temp = url ?? (this.kind ? this.img_face : this.image);
    return FIREBASE_IMAGE(`users%2F${this.key}`, temp);
  }
  get_certificate() {
    return FIREBASE_IMAGE(`users%2F${this.key}`, this.imgCertificate);
  }
}
