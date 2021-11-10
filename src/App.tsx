import React, { useState, useEffect } from 'react';
// import { Book, ReadEntry } from '../interfaces/interface';
import { BookITF } from './interfaces/interface';
import Card from './components/card/Card';
// import image from './assets/scott-webb-UjupleczBOY-unsplash.jpg';
import image from './assets/pawel-czerwinski-Qiy4hr18aGs-unsplash.jpg';

const App = () => {
  const [ currentlyReadingList, setCurrentlyReadingList ] = useState<BookITF[]>([]);
  // const [ finishedReadingList, setFinishedReadingList ] = useState<BookITF[]>([]);

  useEffect(() => {
    getCurrentlyReadingList();
  }, []);

  const getCurrentlyReadingList = async () => {
    try {
      const response = await fetch('http://localhost:3000/1/currently_reading');
      const result = await response.json();
      setCurrentlyReadingList(result);
    } catch(err) {
      console.error(err);
    }
  };

  // const getFinishedReadingList = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3000/1/currently_reading');
  //     const result = await response.json();
  //     setFinishedReadingList(result);
  //   } catch(err) {
  //     console.error(err);
  //   }
  // };

  return (
    <div style={{backgroundImage: `url('${image}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className='flex flex-wrap justify-center' >
        {currentlyReadingList.map((book) => {
          return <Card key={`${book.b_id}`} book={book} />
        })}
      </div>
    </div>
  )
};

export default App;