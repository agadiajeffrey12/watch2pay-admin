import Sidebar from '@/components/layouts/AppSideBar'
import React from 'react'

const DashboardLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex'>
        <Sidebar/>
        <main className='flex-1 border border-black md:ml-auto'>
            {children}
        </main>
    </div>
  )
}

export default DashboardLayout