'use client';
import { useState, useCallback } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from 'next/navigation';
import ReactBigCalendar from "@/app/components/ReactBigCalendar";
import MeetModal from "@/app/components/MeetModal";


export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/login');
    return (
      <>
      </>
    )
  }


  return (
    <SessionProvider>
      <div>
        <button onClick={() => setShowModal(true)} />
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
