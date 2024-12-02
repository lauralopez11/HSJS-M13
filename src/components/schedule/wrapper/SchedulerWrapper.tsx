import SchedulerView from '@/components/schedule/view/SchedulerView';

export default function SchedulerWrapper() {
  return (
    <div className='w-full'>
      <h1 className='mb-10 text-8xl font-semibold tracking-tighter'>
        Event Schedule
      </h1>
      <SchedulerView />
    </div>
  );
}
