'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { EyeFilledIcon, EyeSlashFilledIcon } from '@nextui-org/shared-icons';
import axios, { AxiosError } from 'axios';
import { AlertCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useMutation } from 'react-query';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  error?: string;
}

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

const signUpUser = async ({ username, email, password }: SignUpData) => {
  const { data } = await axios.post('/api/auth/signup', {
    username,
    email,
    password,
  });
  return data;
};

export default function SignUp() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const router = useRouter();

  const {
    mutate: register,
    isLoading,
    error,
  } = useMutation(signUpUser, {
    onSuccess: async () => {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setFormErrors({
          error: 'An error occurred during authentication. Please try again.',
        });
      } else {
        router.push('/');
      }
    },
    onError: (error: AxiosError) => {
      if (error?.response?.data) {
        console.log(error.response);
        setFormErrors(error.response.data);
      } else {
        setFormErrors({
          error: 'Something went wrong. Please try again later.',
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    register({ username, email, password });
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='flex w-full max-w-sm flex-col items-center rounded-lg border p-5 shadow-md'
      >
        <h1 className='mb-8 text-3xl font-bold'>Create an Account</h1>

        {formErrors.error && (
          <Alert variant='destructive' className='mb-5 bg-red-50 shadow'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formErrors.error}</AlertDescription>
          </Alert>
        )}

        <Input
          className='mb-3 max-w-xs'
          type='text'
          label='Username'
          variant='bordered'
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setFormErrors((prevErrors) => ({
              ...prevErrors,
              username: undefined,
            }));
          }}
          isInvalid={Boolean(formErrors?.username)}
          errorMessage={formErrors?.username}
          required
        />

        <Input
          className='mb-3 max-w-xs'
          type='email'
          label='Email'
          variant='bordered'
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFormErrors((prevErrors) => ({
              ...prevErrors,
              email: undefined,
            }));
          }}
          isInvalid={Boolean(formErrors?.email)}
          errorMessage={formErrors?.email}
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
          onFocusChange={(f) => !f && setIsPasswordVisible(false)}
          type={isPasswordVisible ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFormErrors((prevErrors) => ({
              ...prevErrors,
              password: undefined,
            }));
          }}
          isInvalid={Boolean(formErrors?.password)}
          errorMessage={formErrors?.password}
          required
        />

        <Button
          className='mt-3 w-full font-semibold'
          type='submit'
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className='mt-4 text-center'>
          <span className='text-sm text-default-500'>
            Already have an account?
            <Link href='/signin' className='ml-2 text-blue-500 hover:underline'>
              Sign in
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
