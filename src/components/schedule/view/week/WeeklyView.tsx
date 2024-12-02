import AddEventModal from '@/components/schedule/modals/AddEventModal';
import { useModalContext } from '@/providers/ModalProvider';
import { useScheduler } from '@/providers/SchedulerProvider';
import { CustomEventModal, Event } from '@/types/schedule';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
// Import Framer Motion
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useRef, useState } from 'react';
import EventStyled from '../event-component/EventStyled';

const hours = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, '0')}:00`
);

interface ChipData {
  id: number;
  color: 'primary' | 'warning' | 'danger';
  title: string;
  description: string;
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger children animations
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function WeeklyView({
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
  const { getters, handlers } = useScheduler();
  const hoursColumnRef = useRef<HTMLDivElement>(null);
  const [detailedHour, setDetailedHour] = useState<string | null>(null);
  const [timelinePosition, setTimelinePosition] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { showModal } = useModalContext();

  const daysOfWeek = getters?.getDaysInWeek(
    getters?.getWeekNumber(currentDate),
    currentDate.getFullYear()
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hourHeight = rect.height / 24;
    const hour = Math.max(0, Math.min(23, Math.floor(y / hourHeight)));
    const minuteFraction = (y % hourHeight) / hourHeight;
    const minutes = Math.floor(minuteFraction * 60);
    setDetailedHour(
      `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    );
    setTimelinePosition(y + 83);
  };

  function handleAddEvent(event?: Partial<Event>) {
    showModal({
      title: 'Add Event',
      body: <AddEventModal />,
      getter: async () => {
        const startDate = event?.startDate || new Date();
        const endDate = event?.endDate || new Date();
        return { startDate, endDate };
      },
    });
  }

  const handleNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const handlePrevWeek = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  function handleAddEventWeek(dayIndex: number, detailedHour: string) {
    if (!detailedHour) {
      console.error('Detailed hour not provided.');
      return;
    }

    const [hours, minutes] = detailedHour.split(':').map(Number);
    const chosenDay = daysOfWeek[dayIndex % 7].getDate();

    // Ensure day is valid
    if (chosenDay < 1 || chosenDay > 31) {
      console.error('Invalid day selected:', chosenDay);
      return;
    }

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      chosenDay,
      hours,
      minutes
    );

    handleAddEvent({
      startDate: date,
      endDate: new Date(date.getTime() + 60 * 60 * 1000), // 1-hour duration
    });
  }

  return (
    <div className='flex flex-col gap-4'>
      <motion.div
        key={currentDate.toDateString() + 'parent'}
        className='all-week-events flex flex-col gap-2'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {/* {chipData.map((chip) => (
          <motion.div key={chip.id} variants={itemVariants}>
            <Chip
              color={chip.color}
              className="min-w-full p-4 min-h-fit rounded-lg"
              variant="flat"
            >
              <div className="title">
                <span className="text-sm">{chip.title}</span>
              </div>
              <div className="description">{chip.description}</div>
            </Chip>
          </motion.div>
        ))} */}
      </motion.div>

      <div className='ml-auto flex gap-3'>
        {prevButton ? (
          <div onClick={handlePrevWeek}>{prevButton}</div>
        ) : (
          <Button
            className={classNames?.prev}
            startContent={<ArrowLeft />}
            onClick={handlePrevWeek}
          >
            Prev
          </Button>
        )}
        {nextButton ? (
          <div onClick={handleNextWeek}>{nextButton}</div>
        ) : (
          <Button
            className={classNames?.next}
            onClick={handleNextWeek}
            endContent={<ArrowRight />}
          >
            Next
          </Button>
        )}
      </div>
      <div
        key={currentDate.toDateString()}
        className='use-automation-zoom-in grid grid-cols-8 gap-0'
      >
        <div className='sticky left-0 top-0 z-30 flex h-full items-center justify-center rounded-tl-lg border-0 bg-default-100'>
          <span className='text-lg font-semibold text-muted-foreground'>
            Week {getters.getWeekNumber(currentDate)}
          </span>
        </div>

        <div className='relative col-span-7 flex flex-col'>
          <div className='grid flex-grow grid-cols-7 gap-0'>
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className='relative flex flex-col'>
                <div className='sticky top-0 z-20 flex flex-grow items-center justify-center bg-default-100'>
                  <div className='p-4 text-center'>
                    <div className='text-lg font-semibold'>
                      {getters.getDayName(day.getDay())}
                    </div>
                    <div
                      className={clsx(
                        'text-lg font-semibold',
                        new Date().getDate() === day.getDate() &&
                          new Date().getMonth() === currentDate.getMonth() &&
                          new Date().getFullYear() === currentDate.getFullYear()
                          ? 'text-secondary-500'
                          : ''
                      )}
                    >
                      {day.getDate()}
                    </div>
                  </div>
                </div>
                <div className='absolute right-0 top-12 h-[calc(100%-3rem)] w-px'></div>
              </div>
            ))}
          </div>

          {detailedHour && (
            <div
              className='pointer-events-none absolute left-0 z-10 flex h-[3px] w-full rounded-full bg-primary-300 dark:bg-primary/30'
              style={{ top: `${timelinePosition}px` }}
            >
              <Chip
                color='success'
                variant='flat'
                className='vertical-abs-center absolute left-[-55px] z-50 text-xs uppercase'
              >
                {detailedHour}
              </Chip>
            </div>
          )}
        </div>

        <div
          ref={hoursColumnRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setDetailedHour(null)}
          className='relative col-span-8 grid grid-cols-8'
        >
          <div className='col-span-1 bg-default-50 transition duration-400 hover:bg-default-100'>
            {hours.map((hour, index) => (
              <div
                key={`hour-${index}`}
                className='h-[64px] cursor-pointer border-b border-r border-default-200 p-[16px] text-center text-sm text-muted-foreground'
              >
                {hour}
              </div>
            ))}
          </div>

          <div className='col-span-7 grid h-full grid-cols-7 bg-default-50'>
            {Array.from({ length: 7 }, (_, dayIndex) => {
              const dayEvents = getters.getEventsForDay(
                daysOfWeek[dayIndex % 7].getDate(),
                currentDate
              );

              return (
                <div
                  key={`day-${dayIndex}`}
                  className='relative z-20 col-span-1 cursor-pointer border-b border-r border-default-200 text-center text-sm text-muted-foreground transition duration-300'
                  onClick={() => {
                    handleAddEventWeek(dayIndex, detailedHour as string);
                  }}
                >
                  <AnimatePresence mode='wait'>
                    {dayEvents?.map((event, eventIndex) => {
                      const { height, left, maxWidth, minWidth, top, zIndex } =
                        handlers.handleEventStyling(event, dayEvents);

                      return (
                        <div
                          key={`event-${event.id}-${eventIndex}`}
                          style={{
                            minHeight: height,
                            height,
                            top: top,
                            left: left,
                            maxWidth: maxWidth,
                            minWidth: minWidth,
                          }}
                          className='transitio absolute z-50 flex flex-grow flex-col transition-all duration-1000'
                        >
                          <EventStyled
                            event={{
                              ...event,
                              CustomEventComponent,
                              minmized: true,
                            }}
                            CustomEventModal={CustomEventModal}
                          />
                        </div>
                      );
                    })}
                  </AnimatePresence>
                  {/* Render hour slots */}
                  {Array.from({ length: 24 }, (_, hourIndex) => (
                    <div
                      key={`day-${dayIndex}-hour-${hourIndex}`}
                      className='relative z-20 col-span-1 h-16 cursor-pointer border-b border-r border-default-200 text-center text-sm text-muted-foreground transition duration-300'
                    >
                      <div className='absolute flex h-full w-full items-center justify-center bg-default-100 text-xs opacity-0 transition duration-250 hover:opacity-100'>
                        Add Event
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
