import '@/styles/globals.css';
import { Providers } from './providers';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export const metadata = {
  title: 'HSJS - Meetings',
  description: 'Plan your meeting',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='bg-background text-foreground antialiased'>
        <Providers>
          <div className='absolute right-4 top-4 z-10'>
            <ThemeSwitcher />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
