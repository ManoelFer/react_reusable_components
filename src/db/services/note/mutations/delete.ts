import { pool } from '@/db/client';

export const deleteNote = async (id: string) => pool.query('DELETE FROM notes WHERE id = $1', [id]);
