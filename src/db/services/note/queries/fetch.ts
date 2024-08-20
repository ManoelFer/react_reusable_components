import { pool } from '@/db/client';

import { INote } from '@/types/notes';

export async function fetchNotes() {
  try {
    const data = await pool.query<INote>('SELECT * FROM notes');

    return data.rows;
  } catch (error) {
    console.error('Error to fetch notes => ', error);

    throw new Error('Error to fetch notes');
  }
}
