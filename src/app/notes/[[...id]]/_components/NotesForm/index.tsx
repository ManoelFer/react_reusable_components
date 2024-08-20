'use client';

import { useActionState, useEffect, useRef } from 'react';

import { Form } from '@/components';
import { INote } from '@/types/notes';
import { TNoteFieldErrors } from '@/validator-schemas/notes';
import { Button } from '@/components/ui';

export function NotesForm({
  action,
  data,
}: {
  action: (data: TNoteFieldErrors, formData: FormData) => Promise<TNoteFieldErrors>;
  data?: INote;
}) {
  const ref = useRef<HTMLFormElement>(null);

  const [actionState, formAction, isPending] = useActionState(action, { success: false, errors: undefined });

  //  TODO: RESET FORM WHEN REQUEST IS SUCCESSFUL
  useEffect(() => {
    if (actionState.success) {
      ref.current?.reset();
    }
  }, [actionState.success]);

  return (
    <Form.Root ref={ref} action={formAction} className="space-y-5">
      {/* TODO: STRATEGY TO GET THE ID THROUGH ACTION */}
      <input type="hidden" name={'id'} value={data?.id} />

      <Form.Input
        type="text"
        errorMessage={actionState.errors?.note}
        name="note"
        id="note"
        placeholder="Add note"
        defaultValue={data?.note}
      />

      <Form.Input type="date" name="date" id="date" defaultValue={data?.date} placeholder="Add date" />

      <Button type="submit" label="Submit" isLoading={isPending} />
    </Form.Root>
  );
}
