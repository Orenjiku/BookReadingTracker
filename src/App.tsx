import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '../src/components/header/Header';
import CurrentlyReading from './routes/CurrentlyReading';
import FinishedReading from './routes/FinishedReading'
// import image from './assets/scott-webb-UjupleczBOY-unsplash.jpg';
// import image from './assets/pawel-czerwinski-Qiy4hr18aGs-unsplash.jpg';
import image from './assets/pawel-czerwinski-Qiy4hr18aGs-unsplash__1636577204_69.127.44.115.jpg';

const App = () => {
  const userId = 1;

  return (
    <div className='min-h-screen' style={{backgroundImage: `url('${image}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <Header userId={userId} />
      <main>
        <Routes>
          {/* <Route path='/' element={<FinishedReading />} /> */}
          <Route path='/' element={<Navigate to ='/:id/currentlyReading' />} />
          <Route path='/:id/currentlyReading' element={<CurrentlyReading />} />
          <Route path='/:id/finishedReading' element={<FinishedReading />} />
        </Routes>
      </main>
    </div>
  )
};

export default App;