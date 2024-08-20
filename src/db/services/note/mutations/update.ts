import { pool } from '@/db/client';

import { ICreateNoteBody } from '@/types/notes';

interface IUpdateNote extends Partial<ICreateNoteBody> {
  id: string;
}

export async function updateNote(data: IUpdateNote) {
  const { id, note, date } = data;

  return pool.query('UPDATE notes SET note = $1, date = $2 WHERE id = $3', [note, date, id]);
}
