import { MenuIcon, User} from 'lucide-react';
import React, {  useContext, useState } from 'react'
import { contexts } from '../../context/Authentication';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const {isMenuActive,setIsMenuActive} = useContext(contexts);
  const navigate = useNavigate()
  return (
    <div className='flex items-center justify-between bg-black text-white h-15 w-full px-4 py-2'>
      <div className='flex flex-row gap-1 h-10 cursor-pointer'>
        <img src="/websitelogo.png" alt="logo" className='rounded-md' />
        <p className='text-medium text-3xl'>SlotEase</p>
      </div>
      <div className='flex flex-row align-center justify-between rounded-3xl bg-gray-600 gap-6 px-8 py-2 hidden md:flex'>
        <p className='cursor-pointer'
          onClick={()=>{
            navigate("/");
          }}
        >Home</p>
        <p className='cursor-pointer'
          onClick={()=>{
            navigate("/salons");
          }}
        >Salons</p>
        <p className='cursor-pointer'
          onClick={()=>{
            navigate("/bookslot")
          }}
        >BookSlot</p>
        <p className='cursor-pointer'
          onClick={()=>{
            navigate("/mybookings")
          }}
        >My Bookings</p>
      </div>
    <div className='w-10 h-10 '>
      <img src="/userlogo.png" className='rounded-full cursor-pointer' alt="" />
    </div>
       <MenuIcon className='text-white h-6 w-6 cursor-pointer block md:hidden'
          onClick={()=>{
            setIsMenuActive(!isMenuActive);
          }}
      />
      </div>
  )
}

export default Navbar
