'use client'

import { useState, useEffect } from 'react'
import { File } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useQuery } from 'convex/react'
import { useUser } from '@clerk/clerk-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'

import { useSearch } from '@/hooks/use-search'

import { api } from '@/convex/_generated/api'

export const SearchCommand = () => {
  const { user } = useUser()
  const router = useRouter()
  const documents = useQuery(api.documents.getSearch)
  const [isMounted, setIsMounted] = useState(false)

  const toggle = useSearch(store => store.toggle)
  const isOpen = useSearch(store => store.isOpen)
  const onClose = useSearch(store => store.onClose)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', down)
    return () => {
      document.removeEventListener('keydown', down)
    }
  }, [toggle])

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`)
    onClose()
  }

  if (!isMounted) {
    return null
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`Search ${user?.firstName}'s scriptorium...`}
      />
      <CommandList>
        <CommandEmpty>No documents found.</CommandEmpty>
        {documents && documents.length > 0 && (
          <CommandGroup heading='Documents'>
            {documents.map(document => (
              <CommandItem
                key={document._id}
                value={document._id}
                title={document.title}
                onSelect={onSelect}
              >
                {document.icon ? (
                  <p className='mr-2 text-[18px]'>{document.icon}</p>
                ) : (
                  <File className='mr-2 h-4 w-4' />
                )}
                {document.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
