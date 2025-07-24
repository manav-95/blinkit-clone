import { Link, NavLink, Outlet } from 'react-router-dom'

import { navLinks } from '../data/navLinks'

const AccountLayout = () => {
    return (
        <div className='max-w-6xl h-[80vh] shadow-xl my-10 mx-auto flex items-center justify-center'>
            <div className='w-4/12 border h-full'>
                <div className='flex flex-col justify-center items-center w-full '>
                    {navLinks.map((link, index) => {
                        const Icon = link.icon
                        return (
                            <NavLink
                                to={`/account/${link.path}`}
                                key={index}
                                className={({ isActive }) =>
                                    isActive
                                        ? 'flex items-center justify-start text-black bg-gray-100 w-full px-10 py-4 border-b capitalize font-poppins'
                                        : 'flex items-center justify-start text-gray-700 bg-white w-full px-10 py-4 border-b capitalize font-poppins'
                                }
                            >
                                <Icon className='mr-2.5 h-5 w-5' />
                                <span>{link.name}</span>
                            </NavLink>
                        )
                    }

                    )}
                </div>
            </div>
            <div className='w-full h-full border py-4 px-6 bg-white overflow-y-auto'>
                <Outlet />
            </div>
        </div>
    )
}

export default AccountLayout
