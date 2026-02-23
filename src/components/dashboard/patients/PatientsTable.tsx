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
import { useI18n } from '@/components/providers/I18nProvider';
import { formatDate, formatNumber } from '@/i18n/translate';

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
  const { t, locale } = useI18n();
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
      ? t('patients.results').replace('{{count}}', formatNumber(locale, filteredPatients.length))
      : t('patients.resultsFiltered')
          .replace('{{count}}', formatNumber(locale, filteredPatients.length))
          .replace('{{total}}', formatNumber(locale, patients.length));

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
    <div className='flex flex-col gap-6 p-4'>
      <div className='bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-sm'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='relative flex flex-1 items-center max-w-md'>
            <Input
              placeholder={t('patients.searchPlaceholder')}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className='w-full ps-9'
            />
            <div className='text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center ps-3 start-0'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-search'
              >
                <circle cx='11' cy='11' r='8' />
                <path d='m21 21-4.3-4.3' />
              </svg>
            </div>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
            >
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder={t('patients.filterPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('patients.all')}</SelectItem>
                <SelectItem value='completed'>{t('patients.completed')}</SelectItem>
                <SelectItem value='pending'>{t('patients.pending')}</SelectItem>
              </SelectContent>
            </Select>
            <div className='bg-muted/50 hidden h-8 w-[1px] md:block' />
            <div className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
               <span className='bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs'>
                {resultsCountText}
              </span>
              {isLoading && <span className='animate-pulse'>{t('common.loading')}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className='rounded-xl border bg-card shadow-sm overflow-hidden'>
        <div className='overflow-x-auto overflow-y-hidden'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='cursor-pointer select-none' onClick={() => handleSort('name')}>
                  <span className='inline-flex items-center gap-1'>
                    {t('patients.table.name')}
                    {renderSortArrow('name')}
                  </span>
                </TableHead>
                <TableHead className='cursor-pointer select-none' onClick={() => handleSort('phone')}>
                  <span className='inline-flex items-center gap-1'>
                    {t('patients.table.phone')}
                    {renderSortArrow('phone')}
                  </span>
                </TableHead>
                <TableHead className='cursor-pointer select-none text-start' onClick={() => handleSort('status')}>
                  <span className='inline-flex items-center gap-1'>
                    {t('patients.table.status')}
                    {renderSortArrow('status')}
                  </span>
                </TableHead>
                <TableHead className='cursor-pointer select-none text-end' onClick={() => handleSort('cost')}>
                  <div className='inline-flex items-center gap-1 justify-end w-full'>
                    {t('patients.table.cost')}
                    {renderSortArrow('cost')}
                  </div>
                </TableHead>
                <TableHead
                  className='cursor-pointer select-none text-end'
                  onClick={() => handleSort('createdAt')}
                >
                  <div className='inline-flex items-center gap-1 justify-end w-full'>
                    {t('patients.table.addedDate')}
                    {renderSortArrow('createdAt')}
                  </div>
                </TableHead>
                <TableHead className='text-end'>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='h-24 text-center'>
                    {t('patients.table.noPatients')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient._id}>
                    <TableCell className='font-medium text-start'>{patient.name}</TableCell>
                    <TableCell className='text-start'>{patient.phone}</TableCell>
                    <TableCell className='text-start'>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        patient.status === 'approved' 
                          ? 'bg-green-50 text-green-700 ring-green-600/20' 
                          : patient.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                          : 'bg-red-50 text-red-700 ring-red-600/20'
                      }`}>
                        {t(`patients.${patient.status}`)}
                      </span>
                    </TableCell>
                    <TableCell className='text-end font-medium tabular-nums'>
                      {formatNumber(locale, patient.cost)}
                    </TableCell>
                    <TableCell className='text-end'>
                      <div className='tabular-nums'>
                        {patient.createdAt ? formatDate(locale, patient.createdAt) : ''}
                      </div>
                    </TableCell>
                    <TableCell className='text-end'>
                      <div className='flex justify-end gap-2'>
                        <EditPatientDialog patient={patient} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
