'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EditPatientDialog } from '@/components/dashboard/patients/CreatePatientDialog';
import { Button } from '@/components/ui/button';

export type PatientRecord = {
  _id: string;
  name: string;
  age: number;
  ssn: string;
  phone: string;
  maritalStatus: string;
  status: string;
  children: number;
  governorate: string;
  address: string;
  diagnosis: string;
  solution: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
};

export type PatientsTableProps = {
  patients: PatientRecord[];
};

export type SortField = 'name' | 'phone' | 'status' | 'cost' | 'createdAt';

export type SortDirection = 'asc' | 'desc' | null;

export type StatusFilter = 'all' | 'completed' | 'pending';

export type TransformOptions = {
  statusFilter: StatusFilter;
  search: string;
  sortField: SortField | null;
  sortDirection: SortDirection;
};

export function transformPatients(
  patients: PatientRecord[],
  options: TransformOptions,
): PatientRecord[] {
  const { statusFilter, search, sortField, sortDirection } = options;

  let data = [...patients];

  if (statusFilter !== 'all') {
    data = data.filter((patient) => {
      if (statusFilter === 'completed') {
        return patient.status.toLowerCase() === 'approved';
      }
      if (statusFilter === 'pending') {
        return patient.status.toLowerCase() === 'pending';
      }
      return true;
    });
  }

  const query = search.trim().toLowerCase();
  if (query) {
    data = data.filter((patient) => {
      const name = patient.name?.toLowerCase() ?? '';
      const phone = patient.phone?.toLowerCase() ?? '';
      const ssn = patient.ssn?.toLowerCase() ?? '';

      return name.includes(query) || phone.includes(query) || ssn.includes(query);
    });
  }

  if (sortField && sortDirection) {
    data.sort((a, b) => {
      if (sortField === 'cost') {
        const aNum = typeof a.cost === 'number' ? a.cost : Number(a.cost) || 0;
        const bNum = typeof b.cost === 'number' ? b.cost : Number(b.cost) || 0;
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      if (sortField === 'createdAt') {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
      }

      const aValue = sortField === 'name' ? a.name : sortField === 'phone' ? a.phone : a.status;
      const bValue = sortField === 'name' ? b.name : sortField === 'phone' ? b.phone : b.status;

      const aStr = String(aValue ?? '').toLowerCase();
      const bStr = String(bValue ?? '').toLowerCase();

      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return data;
}

export function PatientsTable({ patients }: PatientsTableProps) {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField | null>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInput]);

  const handleSort = (field: SortField) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection('asc');
      return;
    }

    setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'));
  };

  const filteredPatients = useMemo(
    () =>
      transformPatients(patients, {
        statusFilter,
        search,
        sortField,
        sortDirection,
      }),
    [patients, statusFilter, search, sortField, sortDirection],
  );

  const isLoading = searchInput !== search;

  const resultsCountText =
    filteredPatients.length === patients.length
      ? `${filteredPatients.length} patients`
      : `${filteredPatients.length} of ${patients.length} patients`;

  const renderSortArrow = (field: SortField) => {
    if (sortField !== field || !sortDirection) {
      return null;
    }
    const symbol = sortDirection === 'asc' ? '↑' : '↓';
    return (
      <span key={`${field}-${sortDirection}`} className='transition-transform duration-150'>
        {symbol}
      </span>
    );
  };

  return (
    <div className='space-y-4 p-4'>
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:gap-3'>
          <Input
            placeholder='Search by name, phone, or SSN'
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className='w-full md:max-w-sm'
          />
          <div className='flex items-center gap-2'>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='text-muted-foreground flex items-center gap-3 text-sm'>
          <span>{resultsCountText}</span>
          {statusFilter !== 'all' && (
            <span>Status: {statusFilter === 'completed' ? 'Completed' : 'Pending'}</span>
          )}
          {isLoading && <span>Loading...</span>}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='cursor-pointer select-none' onClick={() => handleSort('name')}>
              <span className='inline-flex items-center gap-1'>
                Name
                {renderSortArrow('name')}
              </span>
            </TableHead>
            <TableHead className='cursor-pointer select-none' onClick={() => handleSort('phone')}>
              <span className='inline-flex items-center gap-1'>
                Phone
                {renderSortArrow('phone')}
              </span>
            </TableHead>
            <TableHead className='cursor-pointer select-none' onClick={() => handleSort('status')}>
              <span className='inline-flex items-center gap-1'>
                Status
                {renderSortArrow('status')}
              </span>
            </TableHead>
            <TableHead className='cursor-pointer select-none' onClick={() => handleSort('cost')}>
              <span className='inline-flex items-center gap-1'>
                Requested Cost
                {renderSortArrow('cost')}
              </span>
            </TableHead>
            <TableHead
              className='cursor-pointer select-none'
              onClick={() => handleSort('createdAt')}
            >
              <span className='inline-flex items-center gap-1'>
                Date Added
                {renderSortArrow('createdAt')}
              </span>
            </TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPatients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className='h-24 text-center'>
                No patients found.
              </TableCell>
            </TableRow>
          ) : (
            filteredPatients.map((patient) => (
              <TableRow key={patient._id}>
                <TableCell className='font-medium'>{patient.name}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.status}</TableCell>
                <TableCell>${patient.cost}</TableCell>
                <TableCell>
                  {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('en-GB') : ''}
                </TableCell>
                <TableCell className='space-x-2 text-right'>
                  <EditPatientDialog patient={patient} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
