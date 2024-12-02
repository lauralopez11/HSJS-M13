import EventStyled from '@/components/schedule/view/event-component/EventStyled';
import { useModalContext } from '@/providers/ModalProvider';
import { Event } from '@/types/schedule';

export default function ShowMoreEventsModal() {
  const { data } = useModalContext();
  const dayEvents = data?.dayEvents || [];

  return (
    <div className='flex flex-col gap-2'>
      {dayEvents.map((event: Event) => (
        <EventStyled key={event.id} event={{ ...event }} />
      ))}
    </div>
  );
}
