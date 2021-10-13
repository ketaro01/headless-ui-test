import moment, {Moment} from 'moment';
import { equals } from 'ramda';
import randomName from 'random-name';

type NumType = `number:${string}`;
type DateType = `date:${string}`;
export type ColumnsType = Record<string, 'name'|'fullName'|'first'|'middle'|'last'|'place'|'index'|'boolean'|'date'|'number'|NumType|DateType|string>

const randomDate = (type: string, date: Moment, subtractNum: number): string => {
  const [, rule] = type.split(':');
  let value = date.utc().subtract(subtractNum, 'day');
  return rule ? value.format(rule) : value.toISOString();
}

const randomNumber = (type: string) => {
  let min = 0, max = 100;
  const [, rule] = type.split(':');
  if (rule) {
    const [minStr, maxStr] = rule.split(',');

    if (!minStr && !maxStr) throw new Error('invalid min max value');

    min = minStr ? Math.ceil(parseInt(minStr, 10)) : min;
    max = maxStr ? Math.ceil(parseInt(maxStr, 10)) : max;

    if (min > max) throw new Error(`invalid min: ${min} max: ${max} value`);
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type DataType = {
  dataSource: Record<string, any>[];
  meta: {
    columns: ColumnsType;
    size: number;
  };
};

export const genTestData = (
  columns: ColumnsType,
) => (size: number): DataType => {
  const oldDataSourceString = localStorage.getItem('dataSource');
  if (oldDataSourceString) {
    const oldDataSource = JSON.parse(oldDataSourceString);
    // 메타정보가 동일할 경우 기존 데이터를 사용한다.
    if (equals(oldDataSource.meta, { columns, size })) return oldDataSource;
  }

  // 새로운 Test Data 생성 및 저장
  const keys = Object.keys(columns);
  const dataSource = Array.from(Array(size)).map((_, index) => {
    const obj: Record<string, any> = {};
    let date: Moment|undefined;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const fullType = columns[key];
      const [type] = fullType.split(':');

      switch (type) {
        case 'name':
          obj[key] = `${randomName.first()} ${randomName.last()}`;
          break;
        case 'fullName':
          obj[key] = `${randomName.first()} ${randomName.middle()} ${randomName.last()}`;
          break;
        case 'first':
          obj[key] = randomName.first();
          break;
        case 'middle':
          obj[key] = randomName.middle();
          break;
        case 'last':
          obj[key] = randomName.last();
          break;
        case 'number':
          obj[key] = randomNumber(fullType);
          break;
        case 'place':
          obj[key] = randomName.place();
          break;
        case 'index':
          obj[key] = index;
          break;
        case 'boolean':
          obj[key] = Math.random() >= 0.5;
          break;
        case 'date':
          if (!date) date = moment();
          obj[key] = randomDate(fullType, date, index);
          break;
        default:
          obj[key] = fullType;
          break;
      }
    }
    return obj;
  });
  localStorage.setItem('dataSource', JSON.stringify({
    dataSource,
    meta: {
      columns,
      size,
    }
  }));
  return {
    dataSource,
    meta: {
      columns,
      size,
    }
  };
};
