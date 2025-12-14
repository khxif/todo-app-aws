import { z } from 'zod';

export const todoSchema = z.object({
  todo: z.string().min(2).max(50),
});
export type TodoSchemaType = z.infer<typeof todoSchema>;
