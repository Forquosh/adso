'use client'

import { cn } from '@/lib/utils'
import {
  ChevronsLeft,
  MenuIcon,
  PlusCircle,
  Search,
  Settings
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import UserItem from './user-item'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Item from './item'
import { toast } from 'sonner'
import DocumentList from './document_list'

const Navigation = () => {
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<HTMLElement>(null)
  const navbarRef = useRef<HTMLDivElement>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)

  const create = useMutation(api.documents.create)

  useEffect(() => {
    if (isMobile) {
      collapse()
    } else {
      resetWidth()
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }
  }, [pathname, isMobile])

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return

    let newWidth = event.clientX
    if (newWidth < 240) newWidth = 240
    if (newWidth > 480) newWidth = 480

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.setProperty('left', `${newWidth}px`)
      navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)
      sidebarRef.current.style.width = isMobile ? '100%' : '240px'
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)'
      )
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px')
      setTimeout(() => {
        setIsResetting(false)
      }, 200)
    }
  }

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)
      sidebarRef.current.style.width = '0'
      navbarRef.current.style.setProperty('width', '100%')
      navbarRef.current.style.setProperty('left', '0')

      setTimeout(() => {
        setIsResetting(false)
      }, 200)
    }
  }

  const handleCreate = async () => {
    const promise = create({ title: 'Untitled' })

    toast.promise(promise, {
      loading: 'Preparing a fresh manuscript...',
      success: 'New manuscript prepared!',
      error: 'Failed to prepare manuscript'
    })
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar bg-secondary relative z-[99999] flex h-full w-60 flex-col overflow-y-auto',
          isResetting && 'transition-all duration-200 ease-in-out',
          isMobile && 'w-0'
        )}
      >
        <div
          onClick={collapse}
          role='button'
          className={cn(
            'text-muted-foreground absolute top-3 right-2 h-6 w-6 rounded-sm opacity-0 transition group-hover/sidebar:opacity-100 hover:bg-neutral-200 dark:hover:bg-neutral-600',
            isMobile && 'opacity-100'
          )}
        >
          <ChevronsLeft className='h-6 w-6' />
        </div>
        <div>
          <UserItem />
          <Item label='Search' icon={Search} isSearch onClick={() => {}} />
          <Item label='Settings' icon={Settings} onClick={() => {}} />
          <Item
            onClick={handleCreate}
            label='New manuscript'
            icon={PlusCircle}
          />
        </div>
        <div className='mt-4'>
          <DocumentList />
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className='bg-primary/10 absolute top-0 right-0 h-full w-1 cursor-ew-resize opacity-0 transition group-hover/sidebar:opacity-100'
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 left-60 z-[99999] w-[calc(100%-240px)]',
          isResetting && 'transition-all duration-200 ease-in-out',
          isMobile && 'left-0 w-full'
        )}
      >
        <nav className='w-full bg-transparent px-3 py-2'>
          {isCollapsed && (
            <MenuIcon
              onClick={resetWidth}
              role='button'
              className='text-muted-foreground h-6 w-6'
            />
          )}
        </nav>
      </div>
    </>
  )
}

export default Navigation
