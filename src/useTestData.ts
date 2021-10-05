import randomName from 'random-name';
import moment, { Moment } from 'moment';

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

type NumType = `number:${string}`;
type DateType = `date:${string}`;

type ColumnsType = Record<string, 'name'|'fullName'|'first'|'middle'|'last'|'place'|'index'|'boolean'|'date'|'number'|NumType|DateType|string>

const useTestData = (
  columns: ColumnsType,
) => (size: number): Record<string, any>[] => {
  const keys = Object.keys(columns);
  return Array.from(Array(size)).map((_, index) => {
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
};

export {
  useTestData,
};
