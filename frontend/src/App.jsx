import React from 'react'
import MainRoutes from './Routes/MainRoutes';
import Lenis from 'lenis';

const App = () => {

const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

  return (
    <div className='h-auto w-full'>
        <MainRoutes/>
    </div>
  )
}

export default App;