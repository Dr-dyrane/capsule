'use client'

import React, { useState } from 'react'

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
          <span className="spinner">
            <style jsx>{`
              .spinner {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
              }
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </span>
        ) : (
          children
        )}

        <style jsx>{`
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-md);
            font-weight: 600;
            transition: all var(--duration-micro) var(--ease-standard);
            white-space: nowrap;
          }

          .btn:active {
            transform: scale(0.97);
          }

          .btn-primary {
            background-color: var(--accent);
            color: white;
          }
          .btn-primary:hover { background-color: var(--accent-hover); }

          .btn-secondary {
            background-color: var(--surface-1);
            color: var(--text-primary);
            backdrop-filter: var(--glass);
          }
          .btn-secondary:hover { background-color: var(--surface-2); }

          .btn-ghost {
            color: var(--text-secondary);
          }
          .btn-ghost:hover { color: var(--text-primary); background-color: var(--surface-1); }

          .btn-destructive {
            background-color: var(--destructive);
            color: white;
          }

          .btn-sm { padding: var(--space-8) var(--space-16); font-size: 13px; }
          .btn-md { padding: var(--space-12) var(--space-24); font-size: 15px; }
          .btn-lg { padding: var(--space-16) var(--space-32); font-size: 17px; }

          .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
      </button>
    )
  }
)
Button.displayName = 'Button'
