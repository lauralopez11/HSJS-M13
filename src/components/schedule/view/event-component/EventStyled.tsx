'use client';

import AddEventModal from '@/components/schedule/modals/AddEventModal';
import { useModalContext } from '@/providers/ModalProvider';
import { useScheduler } from '@/providers/SchedulerProvider';
import { CustomEventModal, Event } from '@/types/schedule';
import { Avatar, AvatarGroup } from '@nextui-org/avatar';
import { Chip } from '@nextui-org/chip';
import { Tooltip } from '@nextui-org/tooltip';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import React from 'react';

// Function to format date
const formatDate = (date: Date) => {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

interface EventStyledProps extends Event {
  minmized?: boolean;
  CustomEventComponent?: React.FC<Event>;
}

export default function EventStyled({
  event,
  CustomEventModal,
}: {
  event: EventStyledProps;
  CustomEventModal?: CustomEventModal;
}) {
  const { data: session, status } = useSession();
  const { showModal: showEventModal } = useModalContext();

  // Handler function
  function handleEditEvent(event: Event) {
    // console.log("Edit event", event);

    showEventModal({
      title: event?.title,
      body: (
        <AddEventModal
          CustomAddEventModal={
            CustomEventModal?.CustomAddEventModal?.CustomForm
          }
        />
      ),
      getter: async () => {
        return { ...event };
      },
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      key={event?.id}
      className='use-automation-zoom-in relative flex w-full flex-grow cursor-pointer flex-col rounded-lg border border-default-400/60'
    >
      {event.CustomEventComponent ? (
        <div
          onClickCapture={(e) => {
            e.stopPropagation(); // Stop event from propagating to parent
            handleEditEvent(event);
          }}
        >
          <event.CustomEventComponent {...event} />
        </div>
      ) : (
        <Chip
          onClickCapture={(e) => {
            e.stopPropagation(); // Stop event from propagating to parent
            handleEditEvent(event);
          }}
          variant='flat'
          color={event?.authorId === session?.user?.id ? 'success' : 'warning'}
          classNames={{ content: 'p-0' }}
          className={`flex min-w-full flex-grow flex-col items-start p-0 ${event?.minmized ? 'h-full' : 'min-h-fit p-1'} rounded-md`}
        >
          <div
            className={`flex ${event?.minmized ? 'p-0' : 'p-1'} w-full flex-grow flex-col items-start rounded-md px-1`}
          >
            <h1
              className={`${event?.minmized && 'p-0 px-1 text-[0.7rem]'} line-clamp-1 font-semibold`}
            >
              {event?.title}
            </h1>

            <p className='text-[0.65rem]'>{event?.description}</p>
            {!event?.minmized && (
              <>
                <div className='flex w-full justify-between'>
                  <p className='text-sm'>{formatDate(event?.startDate)}</p>
                  <p className='text-sm'>-</p>
                  <p className='text-sm'>{formatDate(event?.endDate)}</p>
                </div>
                {/* Participants Section */}
                {event?.participants?.length > 0 && (
                  <AvatarGroup className='mt-2' isBordered max={2}>
                    {event.participants.map((participant) => (
                      <Tooltip
                        key={participant.id}
                        content={
                          <div className='px-1 py-2'>
                            <div className='text-small font-bold'>
                              {participant.name}
                            </div>
                            <div className='text-tiny'>{participant.email}</div>
                          </div>
                        }
                      >
                        <Avatar
                          alt={participant.name as string}
                          name={participant.name as string}
                          src={participant.image ?? undefined}
                          size='sm'
                          classNames={{
                            img: 'opacity-100',
                          }}
                        />
                      </Tooltip>
                    ))}
                  </AvatarGroup>
                )}
              </>
            )}
          </div>
        </Chip>
      )}
    </motion.div>
  );
}
