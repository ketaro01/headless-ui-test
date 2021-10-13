import React, {useState} from 'react';
import './Example.scss';
import { useTestTable } from './useTestTable';

function Example() {
  const {
    getPage,
    setNext,
    setPrev,
    setPage,
  } = useTestTable({
    columns: {
      id: 'index',
      switch: 'boolean',
      userName: 'name',
      age: 'number:20,30',
      place: 'place',
      date: 'date:YYYY-MM-DD',
      value: 'fixValue',
    },
    rowSize: 201,
    pageOption: {
      page: 1,
      limit: 10,
    },
    pageNumLength: 5,
  });

  const [pageNumber, setPageNumber] = useState<number|undefined>(undefined);
  const [keyword, setKeyword] = useState('');
  const [value, setValue] = useState('');
  const { rows, pageNumbers, currentPage, pageSize } = getPage([{ userName: keyword, like: true, }]);

  const handleMovePage = (e) => {
    if (e.type === 'keyup' && (e.key !== 'Enter' || e.isComposing)) return;
    if (typeof pageNumber !== 'number') return;
    if (pageNumber > pageSize || pageNumber < 1) return;
    e.preventDefault();
    setPage(pageNumber);
  }

  const handleSearchPage = (e) => {
    if (e.type === 'keyup' && (e.key !== 'Enter' || e.isComposing)) return;
    e.preventDefault();
    setKeyword(value);
    setPage(1);
  }

  const handleNext = () => {
    if (currentPage < pageSize) setNext();
  }

  const handlePrev = () => {
    if (currentPage > 1) setPrev();
  }

  return (
    <div className="headless-table">
      <div className="search-area">
        <input
          onChange={(e) => setValue(e.target.value)}
          onKeyUp={handleSearchPage}
        />
        <button onClick={handleSearchPage}>검색</button>
      </div>
      <table>
        <thead>
        <tr>
          <th>이름</th>
          <th>나이</th>
          <th>거주지</th>
          <th>생성일</th>
        </tr>
        </thead>
        <tbody>
        {rows.map((item) => (
          <tr key={item.id}>
            <td>
              {item.userName}
            </td>
            <td>
              {item.age}
            </td>
            <td>
              {item.place}
            </td>
            <td>
              {item.date}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <div className="pagination-area">
        <div className="pagination">
          <button onClick={handlePrev}>prev</button>
          {pageNumbers.map((num) => (
            <span key={num}>{num === currentPage ? <b>{num}</b> : num}</span>
          ))}
          <button onClick={handleNext}>next</button>
        </div>
        <div className="quick-jump">
          <input
            type="number"
            onChange={(e) => setPageNumber(parseInt(e.target.value, 10))}
            onKeyUp={handleMovePage}
          />
          {' '}
          <button onClick={handleMovePage}>이동</button>
        </div>
      </div>
    </div>
  );
}

export default Example;
