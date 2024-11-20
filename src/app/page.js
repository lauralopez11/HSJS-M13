'use client';
import { useState, useCallback } from "react";
import { useSession, SessionProvider, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Button } from "@nextui-org/button";
import ReactBigCalendar from "@/app/components/ReactBigCalendar";
import MeetModal from "@/app/components/MeetModal";


export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/login');
    return (
      <>
      </>
    )
  }

  if (status === 'authenticated') {
    return (
      <SessionProvider>
        <div>
          <Button onClick={() => signOut()}>signOut</Button>
          <ReactBigCalendar />
          {showModal && <MeetModal
            show={showModal}
            handleClose={handleCloseModal}
            setCurrentMeet={setCurrentMeet}
            saveMeet={saveMeet}
            meet={currentMeet}
          />}
        </div>
      </SessionProvider>
    );
  }
}
