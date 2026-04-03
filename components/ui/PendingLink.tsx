'use client'

import Link, { type LinkProps } from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { forwardRef, useEffect, useRef, useState, type ComponentPropsWithoutRef, type MouseEvent } from 'react'

type PendingLinkProps = LinkProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
    pendingClassName?: string
  }

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
}

const PendingLink = forwardRef<HTMLAnchorElement, PendingLinkProps>(function PendingLink(
  { className, pendingClassName, onClick, target, children, ...props },
  ref,
) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pendingSourceKey, setPendingSourceKey] = useState<string | null>(null)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentLocationKey = `${pathname}?${searchParams.toString()}`
  const isPending = pendingSourceKey === currentLocationKey

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Link
      ref={ref}
      {...props}
      target={target}
      className={`${className ?? ''} pending-link ${isPending && pendingClassName ? pendingClassName : ''}`.trim()}
      data-pending={isPending ? 'true' : undefined}
      aria-busy={isPending ? 'true' : undefined}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || target === '_blank' || isModifiedEvent(event)) {
          return
        }

        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current)
        }

        setPendingSourceKey(currentLocationKey)
        resetTimeoutRef.current = setTimeout(() => {
          setPendingSourceKey(null)
        }, 1800)
      }}
    >
      {children}
    </Link>
  )
})

export default PendingLink
