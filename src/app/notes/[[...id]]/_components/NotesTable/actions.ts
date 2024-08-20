'use server';

import { revalidatePath } from 'next/cache';

import { deleteNote } from '@/db/services/note/mutations';

export async function deleteAction(data: FormData) {
  const id = data.get('id')?.valueOf();

  try {
    await deleteNote(id as string);

    revalidatePath('/notes');
  } catch (error) {
    console.error('error to delete note => ', error);
  }
}
