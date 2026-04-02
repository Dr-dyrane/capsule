'use client'

import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        <input
          ref={ref}
          className={`input surface-1 ${className || ''}`}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = 'Input'
