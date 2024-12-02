'use client';

import { Button } from '@nextui-org/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { ReactElement, useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <Button
        isIconOnly
        variant='light'
        size='sm'
        aria-label={
          theme === 'light' ? 'Toggle dark mode' : 'Toggle light mode'
        }
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? <Moon /> : <Sun />}
      </Button>
    </div>
  );
}
