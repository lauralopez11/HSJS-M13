'use client';

import AddEventModal from '@/components/schedule/modals/AddEventModal';
import ShowMoreEventsModal from '@/components/schedule/modals/ShowMoreEventsModal';
import { useModalContext } from '@/providers/ModalProvider';
import { useScheduler } from '@/providers/SchedulerProvider';
import { CustomEventModal, Event } from '@/types/schedule';
import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import EventStyled from '../event-component/EventStyled';

export default function MonthView({
  prevButton,
  nextButton,
  CustomEventComponent,
  CustomEventModal,
  classNames,
}: {
  prevButton?: React.ReactNode;
  nextButton?: React.ReactNode;
  CustomEventComponent?: React.FC<Event>;
  CustomEventModal?: CustomEventModal;
  classNames?: { prev?: string; next?: string; addEvent?: string };
}) {
  const { getters, weekStartsOn } = useScheduler();
  const { showModal } = useModalContext();

  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = getters.getDaysInMonth(
    currentDate.getMonth(),
    currentDate.getFullYear()
  );

  const handlePrevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(newDate);
  };

  function handleAddEvent(selectedDay: number) {
    showModal({
      title: 'Add Event',
      body: <AddEventModal />,
      getter: async () => {
        const startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          selectedDay ?? 1,
          0,
          0,
          0,
          0
        );
        const endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          selectedDay ?? 1,
          23,
          59,
          59,
          999
        );
        return { startDate, endDate };
      },
    });
  }

  function handleShowMoreEvents(dayEvents: Event[]) {
    showModal({
      title: dayEvents && dayEvents[0]?.startDate.toDateString(),
      body: <ShowMoreEventsModal />,
      getter: async () => ({ dayEvents }),
    });
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const daysOfWeek =
    weekStartsOn === 'monday'
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const startOffset =
    (firstDayOfMonth.getDay() - (weekStartsOn === 'monday' ? 1 : 0) + 7) % 7;

  // Calculate previous month's last days for placeholders
  const prevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const lastDateOfPrevMonth = new Date(
    prevMonth.getFullYear(),
    prevMonth.getMonth() + 1,
    0
  ).getDate();
  return (
    <div>
      <div className='mb-4 flex flex-col'>
        <motion.h2
          key={currentDate.getMonth()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className='my-5 text-3xl font-bold tracking-tighter'
        >
          {currentDate.toLocaleString('default', { month: 'long' })}{' '}
          {currentDate.getFullYear()}
        </motion.h2>
        <div className='flex gap-3'>
          {prevButton ? (
            <div onClick={handlePrevMonth}>{prevButton}</div>
          ) : (
            <Button
              className={classNames?.prev}
              startContent={<ArrowLeft />}
              onClick={handlePrevMonth}
            >
              Prev
            </Button>
          )}
          {nextButton ? (
            <div onClick={handleNextMonth}>{nextButton}</div>
          ) : (
            <Button
              className={classNames?.next}
              onClick={handleNextMonth}
              endContent={<ArrowRight />}
            >
              Next
            </Button>
          )}
        </div>
      </div>
      <AnimatePresence mode='wait'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          key={currentDate.getMonth()}
          className='grid grid-cols-7 gap-1 sm:gap-2'
        >
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              className='my-8 text-left text-4xl font-medium tracking-tighter'
            >
              {day}
            </div>
          ))}

          {Array.from({ length: startOffset }).map((_, idx) => (
            <div key={`offset-${idx}`} className='h-[150px] opacity-50'>
              <div className={clsx('relative mb-1 text-3xl font-semibold')}>
                {lastDateOfPrevMonth - startOffset + idx + 1}
              </div>
            </div>
          ))}

          {daysInMonth.map((dayObj) => {
            const dayEvents = getters.getEventsForDay(dayObj.day, currentDate);

            return (
              <motion.div
                className='group flex h-[150px] flex-col rounded border-none hover:z-50'
                key={dayObj.day}
                variants={itemVariants}
              >
                <Card
                  isPressable
                  className='relative flex h-full border border-default-100 p-4 shadow-md'
                  onClick={() => handleAddEvent(dayObj.day)}
                >
                  <div
                    className={clsx(
                      'relative mb-1 text-3xl font-semibold',
                      dayEvents.length > 0
                        ? 'text-primary-600'
                        : 'text-muted-foreground',
                      new Date().getDate() === dayObj.day &&
                        new Date().getMonth() === currentDate.getMonth() &&
                        new Date().getFullYear() === currentDate.getFullYear()
                        ? 'text-secondary-500'
                        : ''
                    )}
                  >
                    {dayObj.day}
                  </div>
                  <div className='flex w-full flex-grow flex-col gap-2 overflow-hidden'>
                    <AnimatePresence mode='wait'>
                      {dayEvents?.length > 0 && (
                        <EventStyled
                          event={{
                            ...dayEvents[0],
                            CustomEventComponent,
                            minmized: true,
                          }}
                          CustomEventModal={CustomEventModal}
                        />
                      )}
                    </AnimatePresence>
                    {dayEvents.length > 1 && (
                      <Chip
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowMoreEvents(dayEvents);
                        }}
                        variant='flat'
                        className='absolute right-2 top-2 text-xs transition duration-300 hover:bg-default-200'
                      >
                        {dayEvents.length > 1
                          ? `+${dayEvents.length - 1}`
                          : ' '}
                      </Chip>
                    )}
                  </div>

                  {/* Hover Text */}
                  {dayEvents.length === 0 && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                      <span className='text-lg font-semibold tracking-tighter text-white'>
                        Add Event
                      </span>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
