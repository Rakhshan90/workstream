'use client';

import React from 'react'
import { Button } from './ui/button';
import board from '@/assets/board.webp'
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {

    const session = useSession();
    const authStatus = session.status;
    const router = useRouter();

    return (
        <div className="max-w-7xl mx-auto px-4 min-h-screen">
            <div className="h-full flex flex-col justify-center py-36">
                <div className="w-full flex justify-center">
                    <div className="flex flex-col gap-8 items-center justify-center">
                        <h1 className="max-w-2xl py-2 text-center text-5xl font-extrabold tracking-tighter md:text-5xl xl:text-6xl">
                            <span className="w-fit bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text pr-1.5 text-center text-transparent md:mb-4">
                                Workstream,
                            </span>{' '}
                            <span className="bg-gradient-to-b from-slate-300 to-slate-500 bg-clip-text py-1 text-transparent">
                                Effortless Project Management Tool for Teams
                            </span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-center text-lg font-medium tracking-tight text-primary/80 md:text-xl text-slate-400">
                            Boost your team's productivity with our intuitive project management tool. Designed to streamline task allocation, track progress, and meet deadlines.
                        </p>
                        <Button onClick={()=> {authStatus === 'authenticated' ? router.push('/board-list'): router.push('/signin')} } className='bg-blue-600 text-slate-950 hover:bg-slate-800 hover:text-slate-300'>
                            Get Started
                        </Button>

                        <Image src={board} alt='board.webp' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage