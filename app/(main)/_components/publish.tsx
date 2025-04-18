'use client'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { useOrigin } from '@/hooks/use-origin'
import { useMutation } from 'convex/react'
import { Check, Copy, Globe } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface PublishProps {
  initialData: Doc<'documents'>
}

export const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin()
  const update = useMutation(api.documents.update)

  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const url = `${origin}/preview/${initialData._id}`

  const onPublish = async () => {
    setIsSubmitting(true)

    const promise = update({
      id: initialData._id,
      isPublished: true
    }).finally(() => {
      setIsSubmitting(false)
    })

    toast.promise(promise, {
      loading: 'Publishing...',
      success: 'Note published!',
      error: 'Failed to publish note.'
    })
  }

  const onUnpublish = async () => {
    setIsSubmitting(true)

    const promise = update({
      id: initialData._id,
      isPublished: false
    }).finally(() => {
      setIsSubmitting(false)
    })

    toast.promise(promise, {
      loading: 'Unpublishing...',
      success: 'Note unpublished!',
      error: 'Failed to unpublish note.'
    })
  }

  const onCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='sm' variant='ghost'>
          Publish
          {initialData.isPublished && (
            <Globe className='ml-2 h-4 w-4 text-sky-500' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-72' align='end' alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className='space-y-4'>
            <div className='flex items-center gap-x-2'>
              <Globe className='h-4 w-4 animate-pulse text-sky-500' />
              <p className='text-xs font-medium text-sky-500'>
                This note is live on the web.
              </p>
            </div>
            <div className='flex items-center'>
              <input
                value={url}
                className='bg-muted h-8 flex-1 truncate rounded-l-md border px-2 text-xs'
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className='h-8 rounded-l-none'
              >
                {copied ? (
                  <Check className='h-4 w-4' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </Button>
            </div>
            <Button
              size='sm'
              className='w-full text-xs'
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <Globe className='text-muted-foreground mb-2 h-8 w-8' />
            <p className='text-sm font-medium'>Publish this note</p>
            <span className='text-muted-foreground mb-4 text-xs'>
              Share your work with others.
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className='w-full text-xs'
              size='sm'
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
