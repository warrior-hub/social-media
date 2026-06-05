import React from 'react'
import ChatList from './ChatList'

const RightHome = () => {
  return (
    <div className="w-[25%] hidden lg:flex flex-col h-screen bg-black border-l border-gray-800">
      <ChatList/>

    </div>
  )
}

export default RightHome