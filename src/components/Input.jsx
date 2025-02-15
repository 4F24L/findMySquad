import React from 'react'

const Input = ({placeholder, type, value, onChange, isRequired}) => {
  return (
    <input required={isRequired} onChange={onChange} value={value} type={type} placeholder={placeholder} className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#a78dfb]" />
  )
}

export default Input