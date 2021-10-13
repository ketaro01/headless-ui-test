import { useCallback, useMemo, useState } from 'react';
import { filteredList, getConditions, getPagination, getPagingRange } from '../utils';
import { ColumnsType, genTestData } from './genTestData';

export type PageInfoType = { page: number; limit: number; keyword?: string };

export function useTestTable(
  {
    columns,
    pageOption = {
      page: 1,
      limit: 10,
      keyword: '',
    },
    rowSize,
    pageNumLength = 5,
  }: { columns: ColumnsType; pageOption?: PageInfoType; rowSize: number; pageNumLength?: number }
) {
  const [pageInfo, setPageInfo] = useState<PageInfoType>(pageOption);
  const [rows] = useState(genTestData(columns)(rowSize).dataSource);

  const getPage = useCallback((conditions?: Record<string, any>[], sorts?: string[]) => {
    const {
      page,
      limit,
    } = pageInfo;

    const filteredRows = conditions ? filteredList(rows)(getConditions(conditions)) : rows;
    const totalCount = filteredRows.length;
    const pageSize = Math.ceil(totalCount / pageInfo.limit);
    const dataSource = getPagination(filteredRows)(limit, limit * (page - 1), undefined, sorts, 'on');

    return {
      pageSize,
      rows: dataSource.result,
      currentPage: page,
      pageNumbers: getPagingRange(page, { min: 1, total: pageSize, length: pageNumLength }),
    };
  }, [rows, pageInfo, pageNumLength]);

  return useMemo(() => ({
    ...pageInfo,
    getPage,
    rows,
    setNext() {
      setPageInfo({
        ...pageInfo,
        page: pageInfo.page + 1,
      });
    },
    setPrev() {
      setPageInfo({
        ...pageInfo,
        page: pageInfo.page - 1,
      });
    },
    setPage(page) {
      setPageInfo({
        ...pageInfo,
        page,
      });
    },
  }), [rows, getPage, pageInfo, setPageInfo]);
};
