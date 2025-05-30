'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useConvexAuth } from 'convex/react'
import { Spinner } from '@/components/spinner'
import Link from 'next/link'
import { SignInButton } from '@clerk/clerk-react'

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()

  return (
    <div className='flex max-w-3xl flex-col items-center justify-center space-y-4 gap-x-4 gap-y-4 px-4 py-12 md:px-22 md:py-28 lg:flex-row'>
      <Image
        src='/logo.png'
        alt='Journal'
        width={400}
        height={400}
        className='h-[250px] w-[200px] md:h-[370px] md:w-[300px]'
      />
      <div className='flex flex-col items-center justify-center space-y-4 gap-y-4'>
        <h1 className='text-3xl text-nowrap sm:text-4xl md:text-5xl'>
          Your thoughts, organised. <br /> Your ideas, articulated. <br />
          Meet <span className='font-bold'>Adso</span>.
        </h1>
        <h3 className='text-base font-medium sm:text-xl md:text-2xl'>
          Adso is a note-taking app designed to help you explore your deepest
          thoughts and give light to your brightest ideas.
        </h3>
        {isLoading && (
          <div className='flex w-full items-center justify-center'>
            <Spinner size='lg' />
          </div>
        )}
        {isAuthenticated && !isLoading && (
          <Button asChild>
            <Link href='/documents'>
              Enter Adso
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>
        )}
        {!isAuthenticated && !isLoading && (
          <SignInButton mode='modal'>
            <Button>
              Get Adso
              <ArrowRight className='h-4 w-4' />
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  )
}
