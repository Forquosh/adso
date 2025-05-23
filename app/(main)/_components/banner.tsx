'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ConfirmModal } from '@/components/modals/confirm-modal'

interface BannerProps {
  documentId: Id<'documents'>
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter()
  const remove = useMutation(api.documents.remove)
  const restore = useMutation(api.documents.restore)

  const onRemove = () => {
    const promise = remove({ id: documentId })
    toast.promise(promise, {
      loading: 'Deleting document...',
      success: 'Document deleted!',
      error: 'Error deleting document.'
    })

    router.push('/documents')
  }

  const onRestore = () => {
    const promise = restore({ id: documentId })
    toast.promise(promise, {
      loading: 'Restoring document...',
      success: 'Document restored!',
      error: 'Error restoring document.'
    })
  }

  return (
    <div className='flex w-full items-center justify-center gap-x-2 bg-rose-500 p-2 text-center text-sm text-white'>
      <p>This page is in the Trash.</p>
      <Button
        size='sm'
        onClick={onRestore}
        variant='outline'
        className='hover:bg-primary/5 h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:text-white'
      >
        Restore document
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size='sm'
          variant='outline'
          className='hover:bg-primary/5 h-auto border-white bg-transparent p-1 px-2 font-normal text-white hover:text-white'
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  )
}
