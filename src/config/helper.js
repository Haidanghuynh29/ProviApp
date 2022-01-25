import _ from 'lodash';
import {PREFECTURES, PAY_KINDS} from './constant';

export const get_unit = (kind = 1) => {
  switch (kind) {
    case 1:
      return '円・時';
    case 2:
      return '円・日';
    case 3:
      return '円・月';
  }
};
export const number_delimiter = (number = 0) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const pickerOptions = (pickerKind) => {
  var options = [];
  var values;

  switch (pickerKind) {
    case 0:
      values = _.range(18, 60);
      options = [
        {
          key: 'a',
          items: values.map((value) => {
            return {label: value + '歳', value: value + ''};
          }),
        },
        {
          key: 'b',
          items: values.map((value) => {
            return {label: value + '歳', value: value + ''};
          }),
        },
      ];
      break;
    case 1:
    case 8:
      options = [
        {
          key: 'a',
          items: PAY_KINDS.map((value) => {
            return {label: value, value: value};
          }),
        },
      ];
      break;
    case 2:
    case 5:
    case 9:
      values = _.range(0, 101).map((d) => d * 10000);
      options = [
        {
          key: 'a',
          items: values.map((value) => {
            return {label: number_delimiter(value) + '円', value: value};
          }),
        },
        {
          key: 'b',
          items: values
            .slice(1)
            .map((value) => {
              return {label: number_delimiter(value) + '円', value: value};
            })
            .concat([{label: '1,000,000円以上', value: 9999999}]),
        },
      ];
      break;
    case 3:
      values = _.range(1, 8);
      options = [
        {
          key: 'a',
          items: values.map((value) => {
            return {label: value + '日', value: value + ''};
          }),
        },
        {
          key: 'b',
          items: values.map((value) => {
            return {label: value + '日', value: value + ''};
          }),
        },
      ];
      break;
    case 4:
    case 7:
      options = [
        {
          key: 'a',
          items: PREFECTURES.map((value) => {
            return {label: value, value: value};
          }),
        },
      ];
      break;
    case 6:
      values = _.range(1, 100);
      options = [
        {
          key: 'a',
          items: values.map((value, i) => {
            return {label: value + '組', value: value};
          }),
        },
        {
          key: 'b',
          items: values
            .slice(1)
            .map((value, i) => {
              return {label: value + '組', value: value};
            })
            .concat([{label: '100組以上', value: 9999}]),
        },
      ];
      break;
  }

  return options;
};
