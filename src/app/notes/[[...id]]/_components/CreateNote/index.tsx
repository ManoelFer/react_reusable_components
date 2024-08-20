import { NotesForm } from '../NotesForm';
import { NotesTable } from '../NotesTable';

import { createAction } from './actions';

export function CreateNote() {
  return (
    <main className="m-10 space-y-12">
      <div className="my-5">
        <h1 className="m-5 text-center text-3xl text-gray-50">Add note</h1>
        <NotesForm action={createAction} />
      </div>

      <NotesTable />
    </main>
  );
}
