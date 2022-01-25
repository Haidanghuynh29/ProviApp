import moment from 'moment';
import 'moment/locale/ja';

export const J_DATE = 'YYYY年M月D日';
export const J_DATE2 = 'M月D日';
export const J_TIME = 'H:mm';
export const CALENDAR_DAY = 'YYYY-MM-DD';

export const timestamp = (timestamp, mode = J_DATE) => {
  return timestamp ? moment(new Date(timestamp)).format(mode) : '';
};

export const getAge = (timestamp) => {
  const m = moment(new Date(timestamp));
  return moment().year() - m.year();
};

export const compareTime = (timestamp1, timestamp2) => {
  const moment1 = moment(new Date(timestamp1));
  const moment2 = moment(new Date(timestamp2));
  return moment1.hours() > moment2.hours() ||
    (moment1.hours() == moment2.hours() &&
      moment1.minutes() >= moment2.minutes())
};

export const calendar = (date) => {
  return moment(date).format(CALENDAR_DAY);
};

export const isSameDay = (a, b) => {
  const timeA = typeof a == 'number' ? new Date(a) : a;
  const timeB = typeof b == 'number' ? new Date(b) : b;
  const m1 = moment(timeA);
  const m2 = moment(timeB);

  return isSameDayAndMonth(m1, m2);
};

function isSameDayAndMonth(m1, m2) {
  return m1.date() === m2.date() && m1.month() === m2.month();
}