'use client';

import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps): React.ReactElement {
  const router = useRouter();
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <NextUIProvider navigate={router.push}>
          <ThemeProvider attribute='class' defaultTheme='light'>
            {children}
          </ThemeProvider>
        </NextUIProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
