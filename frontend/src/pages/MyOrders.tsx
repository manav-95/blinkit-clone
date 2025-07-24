import React from 'react'

const MyOrders = () => {
  return (
    <div className='h-full'>
      <div className='flex flex-col items-center justify-center h-full'>
        <img src="/not-found.webp" alt="address" className='h-80 w-auto' />
        <span className='bg-darkGreen text-white text-base px-10 py-2 font-poppins rounded'>
          Oops! you haven't placed any order yet
        </span>
      </div>
    </div>
  )
}

export default MyOrders
