// import React, { useState, useEffect} from 'react';
import React, {useEffect} from "react";
// import Form from './components/Form';

const App = (): JSX.Element => {
  // const [currentlyReading, setCurrentlyReading] = useState([]);

  useEffect(() => {
    fetchAPI();
  }, []);

  const fetchAPI = async () => {
    try {
      const response = await fetch('http://localhost:3000/1/currently_reading');
      const result = await response.json();
      console.log(result)
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div>hello</div>
      <div>what</div>
      <div>why</div>
    </div>
  )
};

export default App;