'use client'
import { QueryClient, QueryClientProvider } from'react-query';
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation'

export function Providers({ children }) {
  const router = useRouter();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <NextUIProvider navigate={router.push}>
          {children}
        </NextUIProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}