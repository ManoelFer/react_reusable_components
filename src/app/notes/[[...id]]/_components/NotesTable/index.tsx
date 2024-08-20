import Link from 'next/link';

import { fetchNotes } from '@/db/services/note/queries';

import { Form } from '@/components';
import { Table } from '@/components/ui';

import { deleteAction } from './actions';

export async function NotesTable() {
  const notes = await fetchNotes();

  return (
    <>
      <Table
        columns={[{ label: 'Note' }, { label: 'Date' }, { label: 'Actions', width: 20 }]}
        rows={notes.map(({ date, note, id }) => [
          note,
          date || 'No Date',
          <td key={id} className="flex items-center gap-4 px-6 py-4">
            <Link href={'/notes/' + id} className="font-medium text-blue-600 hover:underline dark:text-blue-500">
              Edit
            </Link>

            <Form.ActionButton
              label="Delete"
              action={deleteAction}
              actionKey="id"
              actionValue={id}
              className="font-medium text-red-600 hover:underline dark:text-red-500"
            />
          </td>,
        ])}
      />
    </>
  );
}
