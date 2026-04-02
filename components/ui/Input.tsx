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
        <style jsx>{`
          .input-wrapper {
            width: 100%;
          }
          .input {
            width: 100%;
            padding: var(--space-16);
            border-radius: var(--radius-md);
            font-size: 17px;
            color: var(--text-primary);
            background-color: var(--surface-1);
            transition: background-color var(--duration-micro) var(--ease-standard);
          }
          .input:placeholder {
            color: var(--text-tertiary);
          }
          .input:focus {
            background-color: var(--surface-2);
          }
        `}</style>
      </div>
    )
  }
)
Input.displayName = 'Input'
