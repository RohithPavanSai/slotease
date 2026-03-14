import React, { useContext, useState } from 'react'
import { contexts } from '../../context/Authentication'
import { useNavigate } from 'react-router-dom';
const Menu = () => {
const {isMenuActive,setIsMenuActive} = useContext(contexts);
const navigate =useNavigate();
  return isMenuActive&&(
      <div className={`flex flex-col gap-2 items-center w-full px-4 py-4 bg-gray-900 text-white ${isMenuActive ? "flex" : "hidden"}`}>
          <p className='flex items-center justify-center text-black bg-red-500 px-1 py-1 h-6 w-6 cursor-pointer'
                onClick={()=>{
                    setIsMenuActive(false);
                }}
            >X</p>
          <p className='text-medium cursor-pointer hover:bg-black px-1'
            onClick={()=>{
                navigate("/");
            }}
          >Home</p>
          <p className='text-medium cursor-pointer hover:bg-black px-1'
            onClick={()=>{
                navigate("/salons");
            }}
          >Salons</p>
          <p className='text-medium cursor-pointer hover:bg-black px-1'
            onClick={()=>{
                navigate("/bookslot")
            }}
          >BookSlot</p>
          <p className='text-medium cursor-pointer hover:bg-black px-1'
            onClick={()=>{
                navigate("/mybookings");
            }}
          >MyBookings</p>          
      </div>
  )
}

export default Menu
