import { Button, Card, Image, Link } from '@nextui-org/react';

export function Welcome() {
  return (
    <div className='flex h-screen flex-col items-center justify-center p-4'>
      <Image
        src='/logo.png'
        alt='App Logo'
        width={128}
        height={128}
        className='mb-6'
      />

      <Card className='w-full max-w-md p-6 shadow-lg'>
        <h1 className='mb-9 text-center text-4xl font-bold'>
          Welcome to EduBook
        </h1>
        <p className='text-center'>
          EduBook is an interactive platform designed to simplify appointment
          scheduling between students and teachers. Book your time with ease and
          stay organized!
        </p>

        {/* Action Buttons */}
        <div className='mt-9 flex justify-center space-x-4'>
          <Link href='/signin'>
            <Button color='primary'>Sign In</Button>
          </Link>
          <Link href='/signup'>
            <Button color='primary'>Create an Account</Button>
          </Link>
        </div>
      </Card>

      {/* Spacer */}
    </div>
  );
}
