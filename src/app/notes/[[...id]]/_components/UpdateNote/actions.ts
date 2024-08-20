'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { updateNote } from '@/db/services/note/mutations';
import { noteSchema, TNoteFieldErrors } from '@/validator-schemas/notes';

export async function updateAction(_data: TNoteFieldErrors, formData: FormData): Promise<TNoteFieldErrors> {
  const resultValidation = noteSchema.safeParse({
    id: formData.get('id'),
    note: formData.get('note'),
    date: formData.get('date'),
  });

  if (!resultValidation.success) return { success: false, errors: resultValidation.error.flatten().fieldErrors };

  try {
    await updateNote({
      id: resultValidation.data.id!,
      ...resultValidation.data,
    });

    revalidatePath('/notes');

    return { success: true };
  } catch (error) {
    console.error('error to update note =>', error);
    return { success: false };
  } finally {
    redirect('/');
  }
}
