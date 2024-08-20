import { isValidElement } from 'react';

import { ITableProps } from './types';

export function Table({ columns, rows }: ITableProps) {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns?.map(({ label, width }, index) => (
              <th
                key={label + index}
                scope="col"
                className={`px-6 py-3`}
                style={{
                  width,
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((values, indexRow) => (
            <tr key={indexRow} className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
              {values.map((value, indexValue) => {
                if (isValidElement(value)) return value;

                return (
                  <th
                    key={indexValue}
                    scope="row"
                    className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                  >
                    {value}
                  </th>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
