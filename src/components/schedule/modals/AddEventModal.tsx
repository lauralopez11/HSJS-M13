'use client';

import SelectDate from '@/components/schedule/add-event-components/SelectDate';
import { useModalContext } from '@/providers/ModalProvider';
import { useScheduler } from '@/providers/SchedulerProvider';
import {
  Event,
  EventFormData,
  eventSchema,
  EventWithParticipantIds,
} from '@/types/schedule';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Input, Textarea } from '@nextui-org/input';
import { ModalFooter } from '@nextui-org/modal';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import {
  Select,
  SelectedItemProps,
  SelectedItems,
  SelectItem,
} from '@nextui-org/select';
import { TrashIcon } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function AddEventModal({
  CustomAddEventModal,
}: {
  CustomAddEventModal?: React.FC<{ register: any; errors: any }>;
}) {
  const { onClose, data } = useModalContext();

  const typedData = data as Event;

  const { handlers, users } = useScheduler();

  console.log('users', users);

  const { data: session, status } = useSession();

  const { register, handleSubmit, reset, formState, setValue, getValues } =
    useForm<EventFormData>({
      resolver: zodResolver(eventSchema),
      defaultValues: {
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        participants: [],
      },
    });

  const errors = formState?.errors;
  // Reset the form on initialization

  useEffect(() => {
    console.log('typedData', JSON.stringify(typedData));
    if (typedData) {
      reset({
        title: typedData.title,
        description: typedData.description || '',
        startDate: typedData.startDate,
        endDate: typedData.endDate,
        participants: typedData.participants
          ? typedData.participants.map((participant) => participant.id)
          : [],
      });
    }
  }, [typedData, reset]);

  const onSubmit: SubmitHandler<EventFormData> = (formData) => {
    console.log('formData', formData);
    if (session?.user?.id === undefined) {
      console.error('User ID is undefined');
      return;
    }

    console.log('participants', formData.participants);

    const newEvent: EventWithParticipantIds = {
      ...formData,
      authorId: session?.user?.id,
      participants: formData.participants || [],
    };

    if (!typedData?.id) handlers.handleAddEvent(newEvent);
    else handlers.handleUpdateEvent(newEvent, typedData.id);
    onClose(); // Close the modal after submission
  };

  // Delete event handler
  const handleDelete = () => {
    if (typedData?.id) {
      handlers.handleDeleteEvent(typedData.id);
      onClose();
    }
  };

  console.log("getValues('participants')", getValues('participants'));

  return (
    <form
      className='flex flex-col gap-3'
      onSubmit={(e) => {
        handleSubmit(onSubmit)(e).then((res) => {
          console.log('form errors', JSON.stringify(errors));
        });
      }}
    >
      {CustomAddEventModal ? (
        CustomAddEventModal({ register, errors })
      ) : (
        <>
          <Input
            {...register('title')}
            label='Event Name'
            placeholder='Enter event name'
            variant='bordered'
            isInvalid={!!errors.title}
            errorMessage={errors.title?.message}
          />
          <Textarea
            {...register('description')}
            label='Description'
            placeholder='Enter event description'
            variant='bordered'
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
          />

          <Select
            selectedKeys={getValues('participants')}
            onSelectionChange={(selectedIds) => {
              const updatedParticipants = Array.from(selectedIds) as string[];
              setValue('participants', updatedParticipants, {
                shouldValidate: true,
              });
              console.log('Updated Participants:', getValues('participants'));
            }}
            isLoading={session?.user?.id === undefined}
            items={users.filter((user) => user.id !== session?.user?.id)}
            variant='bordered'
            isMultiline={true}
            selectionMode='multiple'
            placeholder='Select a user'
            labelPlacement='inside'
            isInvalid={!!errors.participants}
            errorMessage={errors.participants?.message}
            classNames={{
              trigger: 'min-h-12 py-2',
              listboxWrapper: 'max-h-[300px]',
            }}
            renderValue={(items: SelectedItems<User>) => {
              return (
                <ScrollShadow hideScrollBar className='max-h-[60px]'>
                  {items.map((item: SelectedItemProps<User>) => (
                    <Chip
                      key={item.key}
                      variant='flat'
                      avatar={
                        <Avatar
                          alt={item.data?.name as string}
                          name={item.data?.name as string}
                          src={item.data?.image ?? undefined}
                          classNames={{
                            img: 'opacity-100',
                          }}
                        />
                      }
                    >
                      {item.data?.name}
                    </Chip>
                  ))}
                </ScrollShadow>
              );
            }}
          >
            {(user) => (
              <SelectItem
                key={user.id as string}
                textValue={user.name as string}
              >
                <div className='flex gap-2 items-center'>
                  <Avatar
                    className='flex-shrink-0'
                    size='sm'
                    alt={user.name as string}
                    name={user.name as string}
                    src={user.image ?? undefined}
                    classNames={{
                      img: 'opacity-100',
                    }}
                  />
                  <div className='flex flex-col'>
                    <span className='text-small'>{user.name}</span>
                    <span className='text-tiny text-default-400'>
                      {user.email}
                    </span>
                  </div>
                </div>
              </SelectItem>
            )}
          </Select>

          <SelectDate data={data} setValue={setValue} formState={formState} />

          <ModalFooter className='px-0'>
            {typedData?.id && typedData.authorId === session?.user?.id && (
              <Button color='danger' variant='flat' onPress={handleDelete}>
                <TrashIcon />
                Remove Event
              </Button>
            )}
            <Button color='danger' variant='light' onPress={onClose}>
              Cancel
            </Button>
            <Button
              color='primary'
              type='submit'
              isLoading={status === 'loading'}
            >
              Save Event
            </Button>
          </ModalFooter>
        </>
      )}
    </form>
  );
}
