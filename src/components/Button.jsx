import React from 'react'

const Button = ({label, bg, textClr, onClick, classes}) => {
  return (
    <>
    <button onClick={onClick} className={` cursor-pointer font-medium rounded-lg py-2 px-4  ${bg? bg : "bg-[#A78DFB]"} ${textClr? textClr : "text-white"} ${classes}`} >{label}</button>
    </>
  )
}

export default Button