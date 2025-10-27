import React, { useContext } from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';

const navbar = () => {

    const navigate = useNavigate();

    // get the aToken 

    const {aToken,setAToken}= useContext(AdminContext);

    const {dToken,setDToken} = useContext(DoctorContext)

    const logout = ()=>{
          navigate('/'); // user will redirect to the / page 
           aToken && setAToken('')
           aToken && localStorage.removeItem('aToken')
           dToken && setDToken('')
           dToken && localStorage.removeItem('dToken')
    }

    


  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
         <div className='flex items-center gap-2 text-xs'>
              <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
              <p className='border px-2.5 py-0.5 rounded-full broder-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
         </div>
{/* 
          if we click the this button then we will logout (means the token will be removed from the localStorage) */}

         <button 
         onClick={logout}
         className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default navbar
