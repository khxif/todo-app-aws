'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { todoSchema, TodoSchemaType } from '@/zod-schemas/todo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateTodoForm } from '../forms/create-todo-form';
import { insertTask } from '@/db';

interface CreateTodoModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function CreateTodoModal({ isOpen, setIsOpen }: CreateTodoModalProps) {
  const form = useForm<TodoSchemaType>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      todo: '',
    },
  });

  async function onSubmit(values: TodoSchemaType) {
    await insertTask(values.todo);
    setIsOpen(false);
    form.reset();
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Todo</DialogTitle>
        </DialogHeader>

        <CreateTodoForm form={form} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
