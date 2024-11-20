'use client'
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation'

export function Providers({ children }) {
  const router = useRouter();

  return (
    <SessionProvider>
      <NextUIProvider navigate={router.push}>
        {children}
      </NextUIProvider>
    </SessionProvider>
  )
}