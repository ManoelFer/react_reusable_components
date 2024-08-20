export interface INote {
  id: string;
  note?: string;
  date?: string;
}

export interface ICreateNoteBody {
  id?: string;
  note?: string;
  date?: string;
}
