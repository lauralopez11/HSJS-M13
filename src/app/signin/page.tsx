'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';
import { AlertCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlertMessage('');
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        console.log(res);
        setAlertMessage('Invalid email or password');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      setAlertMessage(
        'An error occurred during signin. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='flex w-full max-w-sm flex-col items-center rounded-lg border p-5 shadow-md'
      >
        <h1 className='mb-4 text-3xl font-bold'>Sign in</h1>

        {alertMessage && (
          <Alert variant='destructive' className='mb-5 bg-red-50 shadow'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <Input
          className='mb-3 max-w-xs'
          type='email'
          label='Email'
          variant='bordered'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          className='mb-3 max-w-xs'
          label='Password'
          variant='bordered'
          endContent={
            <button
              className='focus:outline-none'
              type='button'
              onClick={() => setIsPasswordVisible((v) => !v)}
              aria-label='toggle password visibility'
            >
              {isPasswordVisible ? (
                <EyeSlashFilledIcon className='pointer-events-none text-2xl text-default-400' />
              ) : (
                <EyeFilledIcon className='pointer-events-none text-2xl text-default-400' />
              )}
            </button>
          }
          type={isPasswordVisible ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          className='mt-3 w-full font-semibold'
          type='submit'
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className='mt-4 text-center'>
          <span className='text-sm text-default-500'>
            Don&apos;t have an account?
            <Link href='/signup' className='ml-2 text-blue-500 hover:underline'>
              Create an account
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
