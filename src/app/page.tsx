'use client';

import SchedulerWrapper from '@/components/schedule/view/SchedulerViewFilteration';
import { Welcome } from '@/components/Welcome';
import { SchedulerProvider } from '@/providers/SchedulerProvider';
import { Spinner } from '@nextui-org/spinner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function Loading() {
  return (
    <div className='flex h-screen flex-col items-center justify-center p-4'>
      <Spinner size='lg' />
    </div>
  );
}

function Unauthenticated() {
  return (
    <div className='flex h-screen flex-col items-center justify-center p-4'>
      <Welcome />
    </div>
  );
}

function Authenticated() {
  return (
    <section className='p-8'>
      <SchedulerProvider weekStartsOn='monday'>
        <SchedulerWrapper defaultTab='week' />
      </SchedulerProvider>
    </section>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  switch (status) {
    case 'loading':
      return <Loading />;
    case 'unauthenticated':
      return <Unauthenticated />;
    case 'authenticated':
      return <Authenticated />;
  }
}
