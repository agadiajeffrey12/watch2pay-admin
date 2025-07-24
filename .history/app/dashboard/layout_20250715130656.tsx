import Sidebar from '@/components/layouts/AppSideBar'
import React from 'react'

const DashboardLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex'>
        <Sidebar/>
        <main className='flex-1 lg:ml-16'>
            {children}
        </main>
    </div>
  )
}

export default DashboardLayout