import React, {useState} from 'react';

import { useTestData } from './useTestData';

function App() {
  const [data] = useState(useTestData({
    id: 'index',
    switch: 'boolean',
    userName: 'name',
    age: 'number:20,30',
    place: 'place',
    date: 'date:YYYY',
    value: 'fixValue',
  })(10));
  return (
    <div className="App">
      {data.map((item) => (
        <div>
          {item.id}/{item.userName}/{item.age}/{item.place}/{item.date}/{item.value}/{String(item.switch)}
        </div>
      ))}
    </div>
  );
}

export default App;
