import { Providers } from '@/app/providers';
import { SiteNavbar } from '@/components/SiteNavbar';
import '@/styles/globals.css';
import React, { ReactElement } from 'react';

export const metadata = {
  title: 'HSJS - Meetings',
  description: 'Plan your meeting',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className='bg-background text-foreground antialiased'>
        <Providers>
          <SiteNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
