import React from 'react'
import assets from '../assets/assets'

const RightSidebar = ({selectedUser}) => {
  return selectedUser && (
    <div >
        <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
            <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
            <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
                <p className='w-2 h-2 rounded-full bg-green-500'></p>{selectedUser.fullName}
            </h1>
        </div>
    </div>
  )
}

export default RightSidebar