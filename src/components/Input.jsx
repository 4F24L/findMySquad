import React from 'react'

const Input = ({name, placeholder, type, value, onChange, isRequired, classes}) => {
  return (
    <input required={isRequired} name={name} onChange={onChange} value={value} type={type} placeholder={placeholder} className={`border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#a78dfb] ${classes}`} />
  )
}

export default Input