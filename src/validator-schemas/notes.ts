import { z } from 'zod';

import { TFormState } from '@/types/validator';

export const noteSchema = z.object({
  id: z.string().optional(),
  note: z.string().trim().min(3, 'Note must be 3 chars long!'),
  date: z.string().optional(),
});

export type TNoteFieldErrors = { errors?: z.inferFlattenedErrors<typeof noteSchema>['fieldErrors'] } & TFormState;
