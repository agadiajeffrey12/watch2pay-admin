import Sidebar from '@/components/layouts/AppSideBar'
import React from 'react'
import ClientLayout from './clientLayout'

const DashboardLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <ClientLayout>
      <div className='flex'>
        <Sidebar/>
        <main className='flex-1'>
            {children}
        </main>
    </div>
    </ClientLayout>
  )
}

export default DashboardLayout