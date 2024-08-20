interface ITableColumn {
  label: string;
  width?: number;
}

export interface ITableProps {
  columns: ITableColumn[];
  rows: (string | React.ReactNode)[][];
}
