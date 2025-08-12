import { useLocation } from '../contexts/LocationContext'
import MapWithCenterPointer from '../components/MapWithCenterPointer';
import AddressForm from '../components/AddressForm';
import { useRef } from 'react';

const Addresses = () => {
  const { setOpenAddressWindow, openAddressWindow } = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      <div className='h-full'>
        <div className='flex flex-col items-center justify-center h-full space-y-2'>
          <img src="/not-found.webp" alt="address" className='h-80 w-auto' />
          <span className='font-poppins text-sm font-medium'>You have no saved addresses</span>
          <span className='font-poppins text-sm font-light text-gray-500'>Tell us where you want your orders delivered</span>
          <button
            onClick={() => setOpenAddressWindow(true)}
            className='bg-darkGreen text-white px-10 py-2 text-base font-poppins rounded'>
            Add Address
          </button>
        </div>
      </div>

      {openAddressWindow &&
        <div className='fixed top-0 left-0 right-0 w-full h-screen bg-black/40 z-50'>
          <div ref={mapRef} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[55rem] h-[70vh] rounded-md overflow-hidden flex justify-center items-start'>
            <div className='w-1/2 h-full overflow-hidden'>
              <MapWithCenterPointer />
            </div>
            <div className='w-1/2 overflow-auto'>
              <AddressForm />
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Addresses
