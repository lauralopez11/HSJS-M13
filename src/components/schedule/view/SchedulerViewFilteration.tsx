'use client';

import AddEventModal from '@/components/schedule/modals/AddEventModal';
import { useModalContext } from '@/providers/ModalProvider';
import { useScheduler } from '@/providers/SchedulerProvider';
import { ClassNames, CustomComponents, Views } from '@/types/schedule';
import { Button } from '@nextui-org/button';
import { Tab, Tabs } from '@nextui-org/tabs';
import { motion } from 'framer-motion';
import { Calendar, CalendarDaysIcon, CalendarSync } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BsCalendarMonth, BsCalendarWeek } from 'react-icons/bs';
import DailyView from './day/DailyView';
import MonthView from './month/MonthView';
import WeeklyView from './week/WeeklyView';

// Animation settings for Framer Motion
const animationConfig = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, type: 'spring', stiffness: 250 },
};

export default function SchedulerViewFilteration({
  views = {
    views: ['day', 'week', 'month'],
    mobileViews: ['day'],
  },
  CustomComponents,
  classNames,
  defaultTab = 'day',
}: {
  views?: Views;
  CustomComponents?: CustomComponents;
  classNames?: ClassNames;
  defaultTab?: 'day' | 'week' | 'month';
}) {
  const { showModal: showAddEventModal } = useModalContext();
  const { refresh, status } = useScheduler();

  const [clientSide, setClientSide] = useState(false);

  useEffect(() => {
    setClientSide(true);
  }, []);

  const [isMobile, setIsMobile] = useState(
    clientSide ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    if (!clientSide) return;
    setIsMobile(window.innerWidth <= 768);

    function handleResize() {
      if (window && window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    window && window.addEventListener('resize', handleResize);

    return () => window && window.removeEventListener('resize', handleResize);
  }, [clientSide]);

  function handleAddEvent(selectedDay?: number) {
    showAddEventModal({
      title:
        CustomComponents?.CustomEventModal?.CustomAddEventModal?.title ||
        'Add Event',
      body: (
        <AddEventModal
          CustomAddEventModal={
            CustomComponents?.CustomEventModal?.CustomAddEventModal?.CustomForm
          }
        />
      ),
      getter: async () => {
        const startDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          selectedDay ?? // current day
            new Date().getDate(),
          0,
          0,
          0,
          0
        );
        const endDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          selectedDay ?? // current day
            new Date().getDate(),
          23,
          59,
          59,
          999
        );
        return { startDate, endDate };
      },
    });
  }

  const viewsSelector = isMobile ? views?.mobileViews : views?.views;
  return (
    <div className='flex w-full flex-col'>
      <div className='flex w-full'>
        <div className='dayly-weekly-monthly-selection relative w-full'>
          <Button
            isIconOnly
            className='mr-4'
            onClick={() => refresh()}
            isLoading={status === 'loading'}
            color='primary'
            size='sm'
            aria-label='Refresh'
          >
            <CalendarSync />
          </Button>
          <Tabs
            classNames={{ ...classNames?.tabs }}
            aria-label='Options'
            color='primary'
            variant='solid'
            defaultSelectedKey={defaultTab}
          >
            {viewsSelector?.includes('day') && (
              <Tab
                key='day'
                title={
                  CustomComponents?.customTabs?.CustomDayTab ? (
                    CustomComponents.customTabs.CustomDayTab
                  ) : (
                    <div className='flex items-center space-x-2'>
                      <CalendarDaysIcon size={15} />
                      <span>Day</span>
                    </div>
                  )
                }
              >
                <motion.div {...animationConfig}>
                  <DailyView
                    classNames={classNames?.buttons}
                    prevButton={
                      CustomComponents?.customButtons?.CustomPrevButton
                    }
                    nextButton={
                      CustomComponents?.customButtons?.CustomNextButton
                    }
                    CustomEventComponent={
                      CustomComponents?.CustomEventComponent
                    }
                    CustomEventModal={CustomComponents?.CustomEventModal}
                  />
                </motion.div>
              </Tab>
            )}
            {viewsSelector?.includes('week') && (
              <Tab
                key='week'
                title={
                  CustomComponents?.customTabs?.CustomWeekTab ? (
                    CustomComponents.customTabs.CustomWeekTab
                  ) : (
                    <div className='flex items-center space-x-2'>
                      <BsCalendarWeek />
                      <span>Week</span>
                    </div>
                  )
                }
              >
                <motion.div {...animationConfig}>
                  <WeeklyView
                    classNames={classNames?.buttons}
                    prevButton={
                      CustomComponents?.customButtons?.CustomPrevButton
                    }
                    nextButton={
                      CustomComponents?.customButtons?.CustomNextButton
                    }
                    CustomEventComponent={
                      CustomComponents?.CustomEventComponent
                    }
                    CustomEventModal={CustomComponents?.CustomEventModal}
                  />
                </motion.div>
              </Tab>
            )}
            {viewsSelector?.includes('month') && (
              <Tab
                key='month'
                title={
                  CustomComponents?.customTabs?.CustomMonthTab ? (
                    CustomComponents.customTabs.CustomMonthTab
                  ) : (
                    <div className='flex items-center space-x-2'>
                      <BsCalendarMonth />
                      <span>Month</span>
                    </div>
                  )
                }
              >
                <motion.div {...animationConfig}>
                  <MonthView
                    classNames={classNames?.buttons}
                    prevButton={
                      CustomComponents?.customButtons?.CustomPrevButton
                    }
                    nextButton={
                      CustomComponents?.customButtons?.CustomNextButton
                    }
                    CustomEventComponent={
                      CustomComponents?.CustomEventComponent
                    }
                    CustomEventModal={CustomComponents?.CustomEventModal}
                  />
                </motion.div>
              </Tab>
            )}
          </Tabs>

          {
            // Add custom button
            CustomComponents?.customButtons?.CustomAddEventButton ? (
              <div
                onClick={() => handleAddEvent()}
                className='absolute right-0 top-0'
              >
                {CustomComponents?.customButtons.CustomAddEventButton}
              </div>
            ) : (
              <Button
                onClick={() => handleAddEvent()}
                className={
                  'absolute right-0 top-0 ' + classNames?.buttons?.addEvent
                }
                color='primary'
                startContent={<Calendar />}
              >
                Add Event
              </Button>
            )
          }
        </div>
      </div>
    </div>
  );
}
