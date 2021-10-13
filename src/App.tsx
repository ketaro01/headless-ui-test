import React, {useState} from 'react';
import { genTestData } from './useTestTable/genTestData';

function App() {
  const [testData] = useState(genTestData({
    id: 'index',
    switch: 'boolean',
    userName: 'name',
    age: 'number:20,30',
    place: 'place',
    date: 'date:YYYY-MM-DD',
    value: 'fixValue',
  })(200));

  return (
    <div className="App">
      {testData.dataSource.map((item) => (
        <div key={item.id}>{item.userName}/{item.age}/{item.place}/{item.date}</div>
      ))}
    </div>
  );
}

export default App;
