'use client'

import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef, type ComponentPropsWithoutRef, type MouseEvent } from 'react'

import { useNavigationFeedback } from '@/components/providers/NavigationFeedbackProvider'

type PendingLinkProps = LinkProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'href'> & {
    pendingClassName?: string
  }

function normalizeHref(href: LinkProps['href'], fallbackPathname: string) {
  if (typeof href === 'string') {
    try {
      return new URL(href, 'http://localhost').pathname
    } catch {
      return href
    }
  }

  const pathname = href.pathname ?? fallbackPathname
  return pathname
}

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
}

const PendingLink = forwardRef<HTMLAnchorElement, PendingLinkProps>(function PendingLink(
  { className, pendingClassName, onClick, target, children, ...props },
  ref,
) {
  const pathname = usePathname()
  const { beginNavigation, pendingHref } = useNavigationFeedback()
  const currentLocationKey = pathname
  const resolvedHref = normalizeHref(props.href, pathname)
  const isPending = pendingHref === resolvedHref

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

        const targetUrl = new URL(event.currentTarget.href)
        const targetLocationKey = targetUrl.pathname

        if (targetLocationKey === currentLocationKey) {
          return
        }

        beginNavigation(targetLocationKey)
      }}
    >
      {children}
    </Link>
  )
})

export default PendingLink
