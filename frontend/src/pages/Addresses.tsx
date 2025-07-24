import React from 'react'

const Addresses = () => {
  return (
    <>
      <div className='h-full'>
        <div className='flex flex-col items-center justify-center h-full space-y-2'>
          <img src="/not-found.webp" alt="address" className='h-80 w-auto' />
          <span className='font-poppins text-sm font-medium'>You have no saved addresses</span>
          <span className='font-poppins text-sm font-light text-gray-500'>Tell us where you want your orders delivered</span>
          <span className='bg-darkGreen text-white px-10 py-2 text-base font-poppins rounded'>
            Add Address
          </span>
        </div>
      </div>
    </>
  )
}

export default Addresses
