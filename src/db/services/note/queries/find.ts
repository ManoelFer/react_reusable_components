import { pool } from '@/db/client';

import { INote } from '@/types/notes';

export async function findNote(id: string) {
  try {
    const data = await pool.query<INote>('SELECT * FROM notes WHERE id = $1', [id]);

    return data.rows[0];
  } catch (error) {
    console.error('Error to find note => ', error);

    throw new Error('Error to find note');
  }
}
