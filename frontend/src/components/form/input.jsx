import React from 'react'
import { Label } from "../ui/label"
import { Input as ShadcnInput } from "../ui/input"

export default function Input({ 
  type, 
  text, 
  name, 
  placeholder, 
  handleOnChange, 
  value, 
  multiple 
}) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={name}>{text}</Label>
      <ShadcnInput
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        {...(multiple ? {multiple}: '' )}
        className="w-full"
      />
    </div>
  )
}

