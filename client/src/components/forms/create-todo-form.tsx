import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TodoSchemaType } from '@/zod-schemas/todo';
import { UseFormReturn } from 'react-hook-form';

interface CreateTodoFormProps {
  form: UseFormReturn<TodoSchemaType>;
  onSubmit: (values: TodoSchemaType) => void;
}

export function CreateTodoForm({ form, onSubmit }: CreateTodoFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="todo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Todo</FormLabel>
              <FormControl>
                <Input placeholder="Create an App." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full' type="submit">Submit</Button>
      </form>
    </Form>
  );
}
