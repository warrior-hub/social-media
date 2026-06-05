import React from 'react'
import LeftHome from '../components/LeftHome'
import RightHome from '../components/RightHome'
import Feed from '../components/Feed'
const Home = () => {
  return (
    <div className='w-full flex justify-center items-center'>
      <LeftHome/>
       <Feed/> 
      <RightHome/>
    
    </div>
  )
}

export default Home
