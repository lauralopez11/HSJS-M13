'use client';
import { useTheme } from 'next-themes';
import { Button } from '@nextui-org/react';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <Button
        isIconOnly
        variant='light'
        size='sm'
        aria-label={
          theme === 'light' ? 'Toggle dark mode' : 'Toggle light mode'
        }
        onClick={() =>
          setTheme((theme) => (theme === 'light' ? 'dark' : 'light'))
        }
      >
        {theme === 'light' ? <Moon /> : <Sun />}
      </Button>
    </div>
  );
}
