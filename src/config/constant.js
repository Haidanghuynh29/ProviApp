export const FIREBASE_MSG_URL = 'https://fcm.googleapis.com/fcm/send';
export const FIREBASE_SERVER_KEY =
  'AAAAf9GPMaw:APA91bENhg1uUwcHQgwLCxd_CCKUxSPsZ-wV-MI6elKoDzUzFyjo57ypaCfsxt7v21FJdRHCE3RMdNalbWGLI3Q5buA07FXeOxdq8XmbiZkba8aXUHRnOKAmutV1v5YtG6oBIv1g0YeN';
export const FIREBASE_STORAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/provi-app-8b975.appspot.com/o/';

export const MAIL_CHECK =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const FIREBASE_IMAGE = (folder, name) => {
  return FIREBASE_STORAGE_URL + folder + '%2F' + name;
};

export const URL_PRIVACY = 'https://provi-app-8b975.web.app/terms';

export const FETCH_WORKER = 'FETCH_WORKER';
export const FETCH_WORKER_SUCCESS = 'FETCH_WORKER_SUCCESS';
export const FETCH_WORKER_FAIL = 'FETCH_WORKER_FAIL';

export const FETCH_EMPLOYER = 'FETCH_EMPLOYER';
export const FETCH_EMPLOYER_SUCCESS = 'FETCH_EMPLOYER_SUCCESS';
export const FETCH_EMPLOYER_FAIL = 'FETCH_EMPLOYER_FAIL';

export const FETCH_CHAT = 'FETCH_CHAT';
export const FETCH_CHAT_SUCCESS = 'FETCH_CHAT_SUCCESS';
export const FETCH_CHAT_FAIL = 'FETCH_CHAT_FAIL';

export const FETCH_FAV_IDS = 'FETCH_FAV_IDS';
export const FETCH_FAV_IDS_SUCCESS = 'FETCH_FAV_IDS_SUCCESS';
export const FETCH_FAV_IDS_FAIL = 'FETCH_FAV_IDS_FAIL';

export const FETCH_BLOCKING_IDS = 'FETCH_BLOCKING_IDS';
export const FETCH_BLOCKING_IDS_SUCCESS = 'FETCH_BLOCKING_IDS_SUCCESS';
export const FETCH_BLOCKING_IDS_FAIL = 'FETCH_BLOCKING_IDS_FAIL';

export const FETCH_BLOCKED_IDS = 'FETCH_BLOCKED_IDS';
export const FETCH_BLOCKED_IDS_SUCCESS = 'FETCH_BLOCKED_IDS_SUCCESS';
export const FETCH_BLOCKED_IDS_FAIL = 'FETCH_BLOCKED_IDS_FAIL';

export const PREFECTURES = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

export const LABELS = {
  nickname: '名前',
  birthday: '生年月日',
  hope_pay: '希望給料',
  hope_days: '希望勤務日数(週)',
  hope_prefecture: '希望勤務地',
  hope_address: '希望勤務地(詳細)',
  exp_years: `ナイトワーク${'\n'}経歴年数`,
  exp_area: '勤務経歴地',
  prospect_sales: '見込売上(円/月)',
  prospect_count: '見込組数(組/月)',
  prefecture: '住所都道府県',
  // address: '以降住所',
  b_size: 'B（バスト）',
  w_size: 'W（ウエスト）',
  h_size: 'H（ヒップ）',
  height: '身長（cm）',
  job: '現職',
  shop_name: '店舗名',
  shop_telephone: `店舗電話番号${'\n'}(固定電話)`,
  shop_prefecture: '勤務地都道府県',
  shop_address: '店舗住所',
  shop_url: '店舗サイトURL',
  min_pay: '最低給料（¥）',
  unit: '単位',
};

// shows on message item
export const BTN_STRS = [
  `スカウト${'\n'}受ける`,
  `スカウト${'\n'}受けない`,
  '面接する',
  `面接${'\n'}取り消し`,
  '面接結果',
  '取り消し',
  '不採用',
  '採用',
];

export const DLG_STRS = [
  `本当にスカウトを${'\n'}受けますか？`, // -> 2
  `本当にスカウトを${'\n'}キャンセルしますか？`, // -> 3
  '本当に面接しますか？', // -> 2
  `本当に面接を${'\n'}取り消しますか？`, // -> 3
];

export const PRICES = [
  1100, 2080, 3060, 4040, 5020, 6100, 7000, 8000, 9000, 10000,
];

export const PAY_KINDS = ['時給', '日給', '月給'];
