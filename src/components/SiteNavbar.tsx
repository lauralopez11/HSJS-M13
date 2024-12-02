'use client';

import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { Link } from '@nextui-org/link';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/navbar';
import { Skeleton } from '@nextui-org/skeleton';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

export function SiteNavbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <Link className='font-bold text-inherit' href='/'>
          HSJS
        </Link>
      </NavbarBrand>

      {/*
      <NavbarContent className='hidden gap-4 sm:flex' justify='center'>
        <NavbarItem isActive>
          <Link color='foreground' href='#'>
            Features
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href='#' aria-current='page'>
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color='foreground' href='#'>
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
*/}

      <NavbarContent as='div' justify='end'>
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>

        {status === 'authenticated' ? (
          <Dropdown placement='bottom-end'>
            <DropdownTrigger>
              <Avatar
                isBordered
                as='button'
                className='transition-transform'
                color='secondary'
                name={session.user?.name ?? undefined}
                src={session.user?.image ?? undefined}
                size='sm'
              />
            </DropdownTrigger>
            <DropdownMenu aria-label='Profile Actions' variant='flat'>
              <DropdownItem key='profile' className='gap-2'>
                <p className='font-semibold'>{session?.user?.name ?? ''}</p>
                <p className='font-semibold'>{session?.user?.email ?? ''}</p>
              </DropdownItem>
              <DropdownItem key='settings'>Profile Settings</DropdownItem>
              <DropdownItem key='help_and_feedback'>
                Help & Feedback
              </DropdownItem>
              <DropdownItem
                key='logout'
                color='danger'
                onClick={() => {
                  signOut({ redirectTo: '/', redirect: false });
                }}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : status == 'unauthenticated' ? (
          <Button
            href='/signin'
            color='secondary'
            size='sm'
            className='font-semibold'
            onClick={() => router.push('/signin')}
          >
            Sign In
          </Button>
        ) : (
          <Skeleton
            classNames={{
              base: '!duration-1500',
            }}
            className='w-8 h-8 rounded-full'
          />
        )}
      </NavbarContent>
    </Navbar>
  );
}
