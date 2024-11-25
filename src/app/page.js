'use client';
import { useState, useCallback } from 'react';
import { useSession, SessionProvider, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/button';
import ReactBigCalendar from '@/components/ReactBigCalendar';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/signin');
    return <></>;
  }

  if (status === 'authenticated') {
    return (
      <SessionProvider>
        <div>
          <Button onClick={() => signOut()}>Sign Out</Button>
          <ReactBigCalendar />
        </div>
      </SessionProvider>
    );
  }
}
