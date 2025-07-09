import React from 'react'
import { NavLink } from 'react-router-dom'

import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  XCircle,
  Bell,
  Menu,
  X,
  Truck,
  CreditCard,
  Tag,
  Store,
  AlertTriangle,
  Clock,
  Star,
  Download,
  Upload,
  RefreshCw,
  FilterIcon,
  Home,
  Zap,
  Megaphone,
  Database,
  Headphones,
  Activity,
} from "lucide-react"

const AdminSidebar = () => {

  const links = [
    { name: 'Dashboard', path: 'dashboard', icon: Home },
    { name: 'Products', path: 'products', icon: Package },
    { name: 'Orders', path: 'orders', icon: ShoppingCart },
  ]

  return (
    <div className=''>
      <div className='flex items-center h-16 px-6 space-x-3 text-white bg-gradient-to-r from-green-600 to-green-700'>
        <div className='bg-white p-2 rounded-xl'>
          <Zap className='h-6 w-6 text-darkGreen' />
        </div>
        <div className=''>
          <h1 className='font-bold text-xl'>Shopit</h1>
          <p className='text-[12px] text-[#dcfce7] tracking-wide'>Admin Panel</p>
        </div>
      </div>

      <div className='px-4 py-6 space-y-1'>
        {links.map((link, index) => {
          const Icon = link.icon
          return (
            <NavLink key={index} to={`/admin/${link.path}`} className={({ isActive }) =>
              isActive
                ? 'group flex items-center border border-blue-100 py-2.5 px-4 bg-blue-50 text-blue-500 font-medium text-[1.105rem] transition-all rounded-xl'
                : 'group flex items-center py-2.5 border border-transparent px-4 hover:bg-slate-50 text-gray-700 font-medium text-[1.105rem] transition-all rounded-xl'
            }>
              <Icon className={`h-5 w-5 flex-shrink-0 mr-3`} />
              <span>{link.name}</span>
            </NavLink>

          )
        })}

      </div>

    </div>
  )
}

export default AdminSidebar
