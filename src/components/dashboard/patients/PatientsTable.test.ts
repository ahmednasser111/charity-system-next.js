import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  PatientRecord,
  SortDirection,
  SortField,
  StatusFilter,
  transformPatients,
} from './PatientsTable';

const basePatients: PatientRecord[] = [
  {
    _id: '1',
    name: 'Alice Smith',
    age: 30,
    ssn: '111-11-1111',
    phone: '555-1111',
    maritalStatus: 'single',
    status: 'approved',
    children: 0,
    governorate: 'Cairo',
    address: 'Street 1',
    diagnosis: 'Diagnosis A',
    solution: 'Solution A',
    cost: 100,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    _id: '2',
    name: 'Bob Johnson',
    age: 40,
    ssn: '222-22-2222',
    phone: '555-2222',
    maritalStatus: 'married',
    status: 'pending',
    children: 2,
    governorate: 'Giza',
    address: 'Street 2',
    diagnosis: 'Diagnosis B',
    solution: 'Solution B',
    cost: 200,
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-02T00:00:00.000Z',
  },
  {
    _id: '3',
    name: 'Charlie Davis',
    age: 35,
    ssn: '333-33-3333',
    phone: '555-3333',
    maritalStatus: 'single',
    status: 'rejected',
    children: 1,
    governorate: 'Alexandria',
    address: 'Street 3',
    diagnosis: 'Diagnosis C',
    solution: 'Solution C',
    cost: 150,
    createdAt: '2024-03-01T00:00:00.000Z',
    updatedAt: '2024-03-02T00:00:00.000Z',
  },
];

function runTransform(
  statusFilter: StatusFilter,
  search: string,
  sortField: SortField | null,
  sortDirection: SortDirection,
) {
  return transformPatients(basePatients, {
    statusFilter,
    search,
    sortField,
    sortDirection,
  });
}

test('returns all patients when no filters or sort are applied', () => {
  const result = runTransform('all', '', null, null);
  assert.equal(result.length, basePatients.length);
});

test('applies status filter before search', () => {
  const result = runTransform('completed', 'bob', null, null);
  assert.equal(result.length, 0);

  const completed = runTransform('completed', 'alice', null, null);
  assert.equal(completed.length, 1);
  assert.equal(completed[0].name, 'Alice Smith');
});

test('maps completed status to approved patients', () => {
  const result = runTransform('completed', '', null, null);
  assert.equal(result.length, 1);
  assert.equal(result[0].status, 'approved');
});

test('filters pending patients correctly', () => {
  const result = runTransform('pending', '', null, null);
  assert.equal(result.length, 1);
  assert.equal(result[0].status, 'pending');
});

test('searches only name, phone, and ssn fields case-insensitively', () => {
  const byName = runTransform('all', 'alice', null, null);
  assert.equal(byName.length, 1);
  assert.equal(byName[0].name, 'Alice Smith');

  const byPhone = runTransform('all', '555-2222', null, null);
  assert.equal(byPhone.length, 1);
  assert.equal(byPhone[0].name, 'Bob Johnson');

  const bySsn = runTransform('all', '333-33-3333', null, null);
  assert.equal(bySsn.length, 1);
  assert.equal(bySsn[0].name, 'Charlie Davis');

  const notGovernorate = runTransform('all', 'cairo', null, null);
  assert.equal(notGovernorate.length, 0);
});

test('sorts by name in ascending and descending order', () => {
  const asc = runTransform('all', '', 'name', 'asc');
  assert.deepEqual(
    asc.map((p) => p.name),
    ['Alice Smith', 'Bob Johnson', 'Charlie Davis'],
  );

  const desc = runTransform('all', '', 'name', 'desc');
  assert.deepEqual(
    desc.map((p) => p.name),
    ['Charlie Davis', 'Bob Johnson', 'Alice Smith'],
  );
});

test('sorts by cost numerically', () => {
  const asc = runTransform('all', '', 'cost', 'asc');
  assert.deepEqual(
    asc.map((p) => p.cost),
    [100, 150, 200],
  );

  const desc = runTransform('all', '', 'cost', 'desc');
  assert.deepEqual(
    desc.map((p) => p.cost),
    [200, 150, 100],
  );
});

test('sorts by createdAt date', () => {
  const asc = runTransform('all', '', 'createdAt', 'asc');
  assert.deepEqual(
    asc.map((p) => p._id),
    ['1', '2', '3'],
  );

  const desc = runTransform('all', '', 'createdAt', 'desc');
  assert.deepEqual(
    desc.map((p) => p._id),
    ['3', '2', '1'],
  );
});

test('returns empty array when filters exclude all patients', () => {
  const result = runTransform('pending', 'alice', 'name', 'asc');
  assert.equal(result.length, 0);
});

