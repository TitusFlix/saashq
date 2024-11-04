'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Sale } from '../table-data/schema';
import { DataTableColumnHeader } from './data-table-column-header';
import moment from 'moment';
import Link from 'next/link';
import { useState } from 'react';

// Separate component for the Reconcile Checkbox
const ReconcileCheckbox: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="w-[40px] text-center">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
    </div>
  );
};

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: 'reconcile',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reconcile" />
    ),
    cell: () => <ReconcileCheckbox />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'date1',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {moment(row.getValue('date1')).format('YYYY-MM-DD')}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <Link href={`/crm/sales/${row.original.id}`}>
        <div className="w-[250px]">{row.getValue('name')}</div>
      </Link>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <div>
        {row.original.amount
          ? row.original.amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'KES',
            })
          : 'N/A'}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'paid',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid ?" />
    ),
    cell: ({ row }) => (
      <Link href={`/crm/sales/${row.original.id}`}>
        <div className="w-[250px]">{row.getValue('paid')}</div>
      </Link>
    ),
    enableSorting: true,
    enableHiding: true,
  },
];
