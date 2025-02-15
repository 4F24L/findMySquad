import React from 'react'

const Button = ({label, bg, textClr, onClick, classes, isDisabled, children}) => {
  return (
    <>
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={`font-medium rounded-lg py-2 px-4 
        ${bg || "bg-[#A78DFB]"} 
        ${textClr || "text-white"} 
        ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} 
        ${classes}`}
    >
      {label || children}
    </button>
    </>
  )
}

export default Button