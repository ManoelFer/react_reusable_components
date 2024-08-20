import { pool } from '@/db/client';

import { ICreateNoteBody } from '@/types/notes';

export const createNote = async (data: ICreateNoteBody) =>
  pool.query('INSERT INTO notes (note, date) VALUES ($1, $2)', [data?.note, data?.date]);
