import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminNavbar from '../components/admin/AdminNavbar'

function AdminLayout() {
    return (
        <div className='flex w-full'>
            <div className='min-w-72 h-screen shadow-2xl'>
                <AdminSidebar />
            </div>
            <div className='h-screen w-full'>
                <div className='bg-red-200'>
                    <AdminNavbar />
                </div>
                <div className={`h-[90%] w-full overflow-y-auto`}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminLayout
