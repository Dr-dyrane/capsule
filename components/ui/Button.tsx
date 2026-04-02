'use client'

import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`btn btn-${variant} btn-${size} ${loading ? 'loading' : ''} ${className || ''}`}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="spinner"></span>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
