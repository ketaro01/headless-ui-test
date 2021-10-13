import React, {useState} from 'react';
import { genTestData } from './useTestTable/genTestData';
import Example from './Example';

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
      <Example />
    </div>
  );
}

export default App;
