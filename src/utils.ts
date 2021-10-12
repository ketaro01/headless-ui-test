import * as R from 'ramda';

export type ConditionItem = {
  [key: string]: any;
  type?: 'string' | 'number' | 'boolean';
  required?: boolean;
  like?: boolean;
};

const convertValue = (value: any, item: ConditionItem) => {
  switch (item.type) {
    case 'number':
      return parseInt(value, 10);
    case 'boolean':
      return value === 'true';
    case 'string':
    default:
      return item.like ? `${value}:%like%` : value;
  }
};

export const getConditions = (items: ConditionItem[]): Record<string, any>[] => {
  const conditions: Record<string, any>[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemKey = Object.keys(item).find((key) => key !== 'type' && key !== 'required');
    if (!itemKey) throw new Error('invalid item key');
    const isExist = item[itemKey] && typeof item[itemKey] === 'string';
    if (item.required && !isExist) throw new Error(`${itemKey} is required`);
    if (isExist) conditions.push({ [itemKey]: convertValue(item[itemKey], item) });
  }
  return conditions;
};

export const findItem = (list) => (
  conditions: Record<string, any>[],
): Record<string, any> | undefined => {
  return R.find(
    R.allPass(
      conditions.map((condition) => {
        const key = Object.keys(condition)[0];
        return R.propEq(key, condition[key]);
      }),
    ),
  )(list);
};

export const filteredList = (list) => (
  conditions: Record<string, any>[],
): Record<string, any>[] => {
  const obj = {};
  for (let i = 0; i < conditions.length; i++) {
    const key = Object.keys(conditions[i])[0];
    const value = conditions[i][key];
    if (typeof value === 'string' && value.indexOf(':%like%') > -1) {
      const likeValue = value.replace(':%like%', '');
      obj[key] = R.pipe(R.toUpper, R.contains(likeValue.toUpperCase()));
    } else if(value === 'string') {
      obj[key] = R.pipe(R.toUpper, R.equals(value.toUpperCase()));
    } else {
      obj[key] = R.equals(value);
    }
  }
  return R.filter(R.where(obj), list);
};

export const sortedList = (list) => (sorts: string[]): Record<string, any>[] => {
  return R.sortWith(
    sorts.map((sortItem) => {
      const [column, order] = sortItem.split(':');
      const orderFC = order === 'desc' ? R.descend : R.ascend;
      return orderFC(R.prop(column));
    }),
    list,
  );
};

export const updateList = (list) => (
  conditions: Record<string, any>[],
  item?: Record<string, any>,
) => {
  const itemIndex = R.findIndex(
    R.allPass(
      conditions.map((condition) => {
        const key = Object.keys(condition)[0];
        return R.propEq(key, condition[key]);
      }),
    ),
  )(list);

  if (itemIndex === -1) return list;

  const copyList = R.clone(list);

  if (item) copyList.splice(itemIndex, 1, item);
  else copyList.splice(itemIndex, 1);

  return copyList;
};

export const getPagination = (list) => (
  limit,
  offset,
  conditions?: Record<string, any>[],
  sorts?: string[],
  meta?: string,
) => {
  if (!list && !list.length) return [];

  const nLimit = parseInt(limit, 10);
  const nOffset = offset ? parseInt(offset, 10) : 0;
  let result = list;

  // 조건절 filter
  if (conditions) result = filteredList(list)(conditions);
  const totalCount = result.length;

  // 정렬
  if (sorts) result = sortedList(result)(sorts);

  // 페이징 처리
  result = result.slice(nOffset, limit ? nOffset + nLimit : undefined);

  if (meta !== 'on') return result;

  // meta값이 on인 경우 meta정보를 추가하여 전체 obj생성
  return {
    result,
    meta: {
      totalCount,
      currentCount: result.length,
      limit: nLimit,
      offset: nOffset,
    },
  };
};

export const getPagingRange = (current, { min = 1, total = 20, length = 5 } = {}) => {
  let pageItemLength = length;
  if (pageItemLength > total) pageItemLength = total;

  let start = current - Math.floor(pageItemLength / 2);
  start = Math.max(start, min);
  start = Math.min(start, min + total - pageItemLength);

  return Array.from({ length: pageItemLength }, (el, i) => start + i);
};
