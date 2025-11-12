import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const NavBar = ({ setToken }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className='flex items-center py-2 pt-5 px-[4%] justify-between'>
      <img className='w-[max(9%,20px)]' src={assets.logo} alt="logo" />
      <button
        onClick={handleLogout}
        className='bg-blue-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'
      >
        Logout
      </button>
    </div>
  )
}

export default NavBar
