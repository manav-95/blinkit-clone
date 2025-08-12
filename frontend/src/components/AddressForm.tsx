import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import { LuX } from 'react-icons/lu'

import { useLocation } from '../contexts/LocationContext'

import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

type JwtPayload = {
    id: string;
    phone: string;
}

const token = localStorage.getItem('accessToken');
let decodedToken = null;
if (token) {
    decodedToken = jwtDecode<JwtPayload>(token)
    console.log(decodedToken)
}

const AddressForm = () => {
    const { setOpenAddressWindow, address } = useLocation()
    const [selectedType, setSelectedType] = useState<string>('Home')
    const [formData, setFormData] = useState({
        addressType: 'Home',
        flatName: '',
        floor: '',
        area: '',
        landmark: '',
        name: '',
        phone: decodedToken?.phone.slice(3) || '',
    })

    const [submitting, setSubmitting] = useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value, // ✅ updates the phone too
        }));
    };

    const handleAddressTypeChange = (type: string) => {
        setSelectedType(type);
        setFormData({ ...formData, addressType: type });
    };

    const validateForm = () => {
        if (!formData.flatName) {
            alert('Flat Name is required');
            return false;
        }
        if (!formData.name) {
            alert('Your Name is required');
            return false;
        }
        if (formData.phone.trim().length < 10) {
            alert('Phone number must be 10 digits');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (!validateForm()) return;
            setSubmitting(true)
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name)
            formDataToSend.append("phone", formData.phone)
            formDataToSend.append("addressType", formData.addressType)
            formDataToSend.append("flatName", formData.flatName)
            formDataToSend.append("area", address)
            formDataToSend.append("floor", formData.floor)
            formDataToSend.append("landmark", formData.landmark)
            formDataToSend.append("user", decodedToken.id)

            console.log("Submitted Form Data: ", Object.fromEntries(formDataToSend))

            const res = await axios.post(`${baseUrl}/users/add-address`, formDataToSend)

            if (res) {
                setFormData({
                    addressType: 'Home',
                    flatName: '',
                    floor: '',
                    area: '',
                    landmark: '',
                    name: '',
                    phone: decodedToken?.phone.slice(3) || '',
                })

                alert("Form Data Successfully Submitted")
                setOpenAddressWindow(false);
            }

        } catch (error) {
            console.log("Error Submitting FormData: ", error)
        } finally {
            setSubmitting(false)
        }

    }


    return (
        <>
            <div className='font-poppins flex flex-col justify-between h-full'>
                <div>
                    <div className='w-full flex justify-between border-b py-2.5 px-4 font-semibold'>
                        <span>Enter Complete Address</span>
                        <button onClick={() => setOpenAddressWindow(false)}>
                            <LuX className='h-5 w-5' />
                        </button>
                    </div>
                    <div className='py-2 px-4'>
                        <label className='text-xs text-gray-400'>Save Address as *</label>
                        <div className="flex space-x-2 w-full text-xs my-2">
                            {['Home', 'Office', 'Other'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleAddressTypeChange(type)}
                                    className={`${selectedType === type
                                        ? 'bg-green-100 border border-darkGreen'
                                        : 'border'
                                        } px-5 py-1.5 rounded transition-all`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className='overflow-auto flex-1 max-h-72 scrollbar-none'>
                            <form id='addressForm'>
                                <input
                                    type="text"
                                    value={formData.flatName}
                                    name='flatName'
                                    onChange={handleChange}
                                    placeholder='Flat / House no / Building Name *'
                                    className={`${formData.flatName ? 'border-darkGreen' : ''} text-xs font-light w-full px-4 py-3 border rounded-lg mb-2.5 outline-none`}
                                />
                                <input
                                    type="text"
                                    value={formData.floor}
                                    name='floor'
                                    onChange={handleChange}
                                    placeholder='Floor (Optional)'
                                    className={`${formData.floor ? 'border-darkGreen' : ''} text-xs font-light w-full px-4 py-3 border rounded-lg mb-3.5 outline-none`}
                                />
                                <div className='relative text-xs font-light w-full px-4 py-3 border-none bg-gray-100 rounded-lg mb-2.5'>
                                    <div className='absolute -top-2'>
                                        <span className='text-[10px] text-gray-500'>Area / Sector / Locality *</span>
                                    </div>
                                    <span className='line-clamp-1 font-medium'>{address}</span>
                                </div>
                                <input
                                    type="text"
                                    value={formData.landmark}
                                    name='landmark'
                                    onChange={handleChange}
                                    placeholder='Nearby landmark (Optional)'
                                    className={`${formData.landmark ? 'border-darkGreen' : ''} text-xs font-light w-full px-4 py-3 border rounded-lg mb-2.5 outline-none`}
                                />

                                <div className=' flex flex-col space-y-2'>
                                    <span className='text-xs text-gray-500'>Enter your details for seamless delivery experience</span>
                                    <div className=''>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            name='name'
                                            onChange={handleChange}
                                            placeholder='Your Name *'
                                            className={` ${formData.name ? 'border-darkGreen' : ''} text-xs font-light w-full px-4 py-3 mb-3 border rounded-lg outline-none`}
                                        />
                                    </div>
                                    <div className='relative text-xs font-light w-full border-none bg-gray-100 rounded-lg mb-2.5'>
                                        <div className='absolute -top-2 left-4'>
                                            <span className='text-[10px] text-gray-500'>Your Phone no*</span>
                                        </div>
                                        <input
                                            type="text"
                                            name='phone'
                                            value={formData.phone}
                                            onChange={handleChange}
                                            maxLength={10}
                                            className='w-full font-medium bg-gray-100 outline-none px-4 py-3 rounded-lg'
                                        />
                                    </div>

                                </div>

                            </form>
                        </div>
                    </div>
                </div>

                <div className='px-4 py-4 flex items-center min-h-full mt-auto rounded-t-3xl bg-slate-100 flex-shrink-0'>
                    <button
                        type='submit'
                        form='addressForm'
                        disabled={submitting}
                        onClick={handleSubmit} className='flex justify-center items-center px-4 py-2.5 text-sm rounded-lg w-full bg-darkGreen text-white'
                    >
                        {submitting
                            ? (
                                <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <span>Save Address</span>
                            )}
                    </button>
                </div>

            </div>
        </>
    )
}

export default AddressForm
