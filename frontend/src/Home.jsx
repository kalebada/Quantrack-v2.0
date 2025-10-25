import React from 'react'
import NavBar from './Components/NavBar'
import Hero from './Pages/Hero'

import Features from './Pages/Features'
import Page3 from './Pages/Page3'
import Copyright from './Components/Copyright'

const Home = () => {

// Initialize Lenis


  return (
    <div className='min-h-screen w-full flex flex-col justify-start items-center'>
        <NavBar/>
        <Hero/>
        <Features/>
        <Page3/>
        <Copyright/>
    </div>
  )
}

export default Home